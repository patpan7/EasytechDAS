package com.example.demo.controller;

import com.example.demo.dto.CustomerCreateRequest;
import com.example.demo.dto.CustomerDto;
import com.example.demo.dto.CustomerUpdateRequest;
import com.example.demo.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for handling customer-related requests.
 */
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    /**
     * Gets the list of customers.
     *
     * @return a {@link ResponseEntity} containing the list of {@link CustomerDto}s
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'PARTNER')")
    public ResponseEntity<List<CustomerDto>> getCustomers() {
        return ResponseEntity.ok(customerService.getCustomers());
    }

    /**
     * Creates a new customer.
     *
     * @param request the request containing customer details
     * @return a {@link ResponseEntity} containing the created customer DTO
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'PARTNER')")
    public ResponseEntity<CustomerDto> createCustomer(@RequestBody CustomerCreateRequest request) {
        CustomerDto createdCustomer = customerService.createCustomer(request);
        return new ResponseEntity<>(createdCustomer, HttpStatus.CREATED);
    }

    /**
     * Updates an existing customer.
     *
     * @param id the ID of the customer to update
     * @param request the request containing updated customer details
     * @return a {@link ResponseEntity} containing the updated customer DTO
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'PARTNER')")
    public ResponseEntity<CustomerDto> updateCustomer(@PathVariable Long id, @RequestBody CustomerUpdateRequest request) {
        CustomerDto updatedCustomer = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(updatedCustomer);
    }
}
