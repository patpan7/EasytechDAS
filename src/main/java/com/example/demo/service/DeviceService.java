package com.example.demo.service;

import com.example.demo.dto.DeviceDto;
import com.example.demo.model.Device;
import com.example.demo.model.User;
import com.example.demo.repository.DeviceRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing devices.
 */
@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;

    public DeviceService(DeviceRepository deviceRepository, UserRepository userRepository) {
        this.deviceRepository = deviceRepository;
        this.userRepository = userRepository;
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

        List<Device> devices;
        if ("ROLE_SUPERVISOR".equals(user.getRole())) {
            devices = deviceRepository.findAll();
        } else if (user.getRole().startsWith("ROLE_PARTNER")) {
            devices = deviceRepository.findByCustomerUserId(user.getId());
        } else {
            throw new AccessDeniedException("Access denied");
        }

        return devices.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private DeviceDto convertToDto(Device device) {
        DeviceDto dto = new DeviceDto();
        dto.setId(device.getId());
        dto.setSerialNumber(device.getSerialNumber());
        dto.setStatus(device.getStatus());
        dto.setCustomerId(device.getCustomer().getId());
        return dto;
    }
}
