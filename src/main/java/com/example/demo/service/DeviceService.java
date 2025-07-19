package com.example.demo.service;

import com.example.demo.dto.DeviceCreateRequest;
import com.example.demo.dto.DeviceDto;
import com.example.demo.model.Customer;
import com.example.demo.model.Device;
import com.example.demo.model.User;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.DeviceRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing devices.
 */
@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    public DeviceService(DeviceRepository deviceRepository, UserRepository userRepository, CustomerRepository customerRepository) {
        this.deviceRepository = deviceRepository;
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
    }

    /**
     * Gets a list of devices based on the current user's role.
     *
     * @return a list of {@link DeviceDto}s
     */
    public List<DeviceDto> getDevices() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Device> devices = new ArrayList<>();
        if ("ROLE_SUPERVISOR".equals(user.getRole())) {
            devices = deviceRepository.findAll();
        } else if (user.getRole().startsWith("ROLE_PARTNER")) {
            // Partners see devices assigned to their customers AND devices assigned directly to them
            devices.addAll(deviceRepository.findByCustomerUserId(user.getId()));
            devices.addAll(deviceRepository.findByUserId(user.getId()));
        } else {
            throw new AccessDeniedException("Access denied");
        }

        return devices.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Creates a new device.
     *
     * @param request the request containing device details
     * @return the created device DTO
     */
    public DeviceDto createDevice(DeviceCreateRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Device device = new Device();
        device.setSerialNumber(request.getSerialNumber());
        device.setStatus(request.getStatus());

        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new EntityNotFoundException("Customer not found"));

            // Supervisor can assign to any customer
            // Partner can only assign to their own customers
            if (currentUser.getRole().startsWith("ROLE_PARTNER") && !customer.getUser().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException("Partners can only assign devices to their own customers.");
            }
            device.setCustomer(customer);
        } else if (request.getAssignedToUserId() != null) {
            // Only supervisor can assign devices directly to a partner
            if (!"ROLE_SUPERVISOR".equals(currentUser.getRole())) {
                throw new AccessDeniedException("Only supervisors can assign devices directly to partners.");
            }
            User assignedPartner = userRepository.findById(request.getAssignedToUserId())
                    .orElseThrow(() -> new EntityNotFoundException("Assigned partner not found."));
            device.setUser(assignedPartner);
        } else {
            throw new IllegalArgumentException("Device must be assigned to either a customer or a user.");
        }

        Device savedDevice = deviceRepository.save(device);
        return convertToDto(savedDevice);
    }

    /**
     * Assigns a device from a partner's pool to one of their customers.
     *
     * @param deviceId the ID of the device to assign
     * @param customerId the ID of the customer to assign the device to
     * @return the updated device DTO
     */
    public DeviceDto assignDeviceToCustomer(Long deviceId, Long customerId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new EntityNotFoundException("Device not found"));

        // Ensure the device is currently in the partner's pool (assigned to user, not customer)
        if (device.getCustomer() != null || !device.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Device is not in your pool or already assigned to a customer.");
        }

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found."));

        // Ensure the customer belongs to the current partner
        if (!customer.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Customer does not belong to you.");
        }

        device.setCustomer(customer);
        device.setUser(null); // Remove from partner's pool
        Device updatedDevice = deviceRepository.save(device);
        return convertToDto(updatedDevice);
    }

    /**
     * Assigns a device to a partner's pool (only for Supervisor).
     *
     * @param deviceId the ID of the device to assign
     * @param partnerId the ID of the partner to assign the device to
     * @return the updated device DTO
     */
    public DeviceDto assignDeviceToPartner(Long deviceId, Long partnerId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!"ROLE_SUPERVISOR".equals(currentUser.getRole())) {
            throw new AccessDeniedException("Only supervisors can assign devices to partners.");
        }

        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new EntityNotFoundException("Device not found"));

        User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new EntityNotFoundException("Partner not found."));

        device.setCustomer(null); // Remove from customer if assigned
        device.setUser(partner); // Assign to partner's pool
        Device updatedDevice = deviceRepository.save(device);
        return convertToDto(updatedDevice);
    }


    /**
     * Gets a list of customers for the current user.
     * Supervisors see all customers, Partners see only their own customers.
     *
     * @return a list of {@link com.example.demo.dto.CustomerDto}s
     */
    public List<com.example.demo.dto.CustomerDto> getCustomersForCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Customer> customers;
        if ("ROLE_SUPERVISOR".equals(currentUser.getRole())) {
            customers = customerRepository.findAll();
        } else if (currentUser.getRole().startsWith("ROLE_PARTNER")) {
            customers = customerRepository.findByUserId(currentUser.getId());
        } else {
            throw new AccessDeniedException("Access denied");
        }

        return customers.stream()
                .map(c -> {
                    com.example.demo.dto.CustomerDto dto = new com.example.demo.dto.CustomerDto();
                    dto.setId(c.getId());
                    dto.setName(c.getName());
                    dto.setEponimia(c.getEponimia());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private DeviceDto convertToDto(Device device) {
        DeviceDto dto = new DeviceDto();
        dto.setId(device.getId());
        dto.setSerialNumber(device.getSerialNumber());
        dto.setStatus(device.getStatus());
        if (device.getCustomer() != null) {
            dto.setCustomerId(device.getCustomer().getId());
        }
        if (device.getUser() != null) {
            dto.setUserId(device.getUser().getId());
            dto.setAssignedToUsername(device.getUser().getUsername());
        }
        return dto;
    }
}
