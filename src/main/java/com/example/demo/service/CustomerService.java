package com.example.demo.service;

import com.example.demo.dto.CustomerCreateRequest;
import com.example.demo.dto.CustomerDto;
import com.example.demo.dto.CustomerUpdateRequest;
import com.example.demo.model.Customer;
import com.example.demo.model.User;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service for managing customers.
 */
@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public CustomerService(CustomerRepository customerRepository, UserRepository userRepository) {
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }

    /**
     * Gets a list of customers based on the current user's role.
     *
     * @return a list of {@link CustomerDto}s
     */
    public List<CustomerDto> getCustomers() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Set<Customer> uniqueCustomers = new LinkedHashSet<>();
        if ("ROLE_SUPERVISOR".equals(user.getRole())) {
            uniqueCustomers.addAll(customerRepository.findAll(Sort.by(Sort.Direction.ASC, "id")));
        } else if (user.getRole().startsWith("ROLE_PARTNER")) {
            uniqueCustomers.addAll(customerRepository.findByUserId(user.getId(), Sort.by(Sort.Direction.ASC, "id")));
        } else {
            throw new AccessDeniedException("Access denied");
        }

        return uniqueCustomers.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Creates a new customer.
     *
     * @param request the request containing customer details
     * @return the created customer DTO
     */
    public CustomerDto createCustomer(CustomerCreateRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Customer customer = new Customer();
        mapDtoToEntity(request, customer);

        if ("ROLE_SUPERVISOR".equals(currentUser.getRole())) {
            if (request.getUserId() != null) {
                User assignedUser = userRepository.findById(request.getUserId())
                        .orElseThrow(() -> new EntityNotFoundException("User not found"));
                customer.setUser(assignedUser);
            } else {
                throw new IllegalArgumentException("Supervisor must assign a user when creating a customer.");
            }
        } else if (currentUser.getRole().startsWith("ROLE_PARTNER")) {
            customer.setUser(currentUser);
        } else {
            throw new AccessDeniedException("Access denied");
        }

        Customer savedCustomer = customerRepository.save(customer);
        return convertToDto(savedCustomer);
    }

    /**
     * Updates an existing customer.
     *
     * @param id the ID of the customer to update
     * @param request the request containing updated customer details
     * @return the updated customer DTO
     */
    public CustomerDto updateCustomer(Long id, CustomerUpdateRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));

        if (currentUser.getRole().startsWith("ROLE_PARTNER") && !customer.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to update this customer.");
        }

        mapDtoToEntity(request, customer);

        if ("ROLE_SUPERVISOR".equals(currentUser.getRole())) {
            if (request.getUserId() != null) {
                User newAssignedUser = userRepository.findById(request.getUserId())
                        .orElseThrow(() -> new EntityNotFoundException("New assigned user not found."));
                customer.setUser(newAssignedUser);
            } else {
                throw new IllegalArgumentException("Supervisor must assign a user when updating a customer.");
            }
        } else if (currentUser.getRole().startsWith("ROLE_PARTNER")) {
            if (request.getUserId() != null && !request.getUserId().equals(customer.getUser().getId())) {
                throw new AccessDeniedException("Partners cannot change customer's assigned user.");
            }
        }

        Customer updatedCustomer = customerRepository.save(customer);
        return convertToDto(updatedCustomer);
    }

    private void mapDtoToEntity(CustomerCreateRequest dto, Customer entity) {
        entity.setName(dto.getName());
        entity.setStatus(dto.getStatus());
        entity.setEponimia(dto.getEponimia());
        entity.setTitle(dto.getTitle());
        entity.setAfm(dto.getAfm());
        entity.setProfession(dto.getProfession());
        entity.setAddress(dto.getAddress());
        entity.setCity(dto.getCity());
        entity.setZipCode(dto.getZipCode());
        entity.setDoy(dto.getDoy());
        entity.setPhone1(dto.getPhone1());
        entity.setPhone2(dto.getPhone2());
        entity.setMobile(dto.getMobile());
        entity.setEmail(dto.getEmail());
    }

    private void mapDtoToEntity(CustomerUpdateRequest dto, Customer entity) {
        entity.setName(dto.getName());
        entity.setStatus(dto.getStatus());
        entity.setEponimia(dto.getEponimia());
        entity.setTitle(dto.getTitle());
        entity.setAfm(dto.getAfm());
        entity.setProfession(dto.getProfession());
        entity.setAddress(dto.getAddress());
        entity.setCity(dto.getCity());
        entity.setZipCode(dto.getZipCode());
        entity.setDoy(dto.getDoy());
        entity.setPhone1(dto.getPhone1());
        entity.setPhone2(dto.getPhone2());
        entity.setMobile(dto.getMobile());
        entity.setEmail(dto.getEmail());
    }

    private CustomerDto convertToDto(Customer customer) {
        CustomerDto dto = new CustomerDto();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setStatus(customer.getStatus());
        dto.setEponimia(customer.getEponimia());
        dto.setTitle(customer.getTitle());
        dto.setAfm(customer.getAfm());
        dto.setProfession(customer.getProfession());
        dto.setAddress(customer.getAddress());
        dto.setCity(customer.getCity());
        dto.setZipCode(customer.getZipCode());
        dto.setDoy(customer.getDoy());
        dto.setPhone1(customer.getPhone1());
        dto.setPhone2(customer.getPhone2());
        dto.setMobile(customer.getMobile());
        dto.setEmail(customer.getEmail());
        dto.setUserId(customer.getUser().getId());
        dto.setPartnerUsername(customer.getUser().getUsername());
        return dto;
    }

    /**
     * Gets a single customer by ID.
     *
     * @param id the ID of the customer
     * @return the {@link CustomerDto} for the given ID
     */
    public CustomerDto getCustomerById(Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));

        // Partners can only view their own customers
        if (currentUser.getRole().startsWith("ROLE_PARTNER") && !customer.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to view this customer.");
        }

        return convertToDto(customer);
    }

    /**
     * Gets a list of customers for a specific partner.
     * Only accessible by SUPERVISOR.
     *
     * @param partnerId the ID of the partner
     * @return a list of {@link CustomerDto}s for the given partner
     */
    public List<CustomerDto> getCustomersByPartnerId(Long partnerId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!"ROLE_SUPERVISOR".equals(currentUser.getRole())) {
            throw new AccessDeniedException("Only supervisors can view customers by partner.");
        }

        return customerRepository.findByUserId(partnerId, Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
}
