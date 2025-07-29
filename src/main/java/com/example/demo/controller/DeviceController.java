package com.example.demo.controller;

import com.example.demo.dto.DeviceCreateRequest;
import com.example.demo.dto.DeviceDto;
import com.example.demo.service.DeviceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for handling device-related requests.
 */
@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    /**
     * Gets the list of devices.
     *
     * @return a {@link ResponseEntity} containing the list of {@link DeviceDto}s
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'PARTNER')")
    public ResponseEntity<List<DeviceDto>> getDevices() {
        return ResponseEntity.ok(deviceService.getDevices());
    }

    /**
     * Creates a new device.
     *
     * @param request the request containing device details
     * @return a {@link ResponseEntity} containing the created device DTO
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'PARTNER')")
    public ResponseEntity<DeviceDto> createDevice(@RequestBody DeviceCreateRequest request) {
        DeviceDto createdDevice = deviceService.createDevice(request);
        return new ResponseEntity<>(createdDevice, HttpStatus.CREATED);
    }

    /**
     * Assigns a device from a partner's pool to one of their customers.
     *
     * @param deviceId the ID of the device to assign
     * @param customerId the ID of the customer to assign the device to
     * @return the updated device DTO
     */
    @PutMapping("/{deviceId}/assign-to-customer/{customerId}")
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<DeviceDto> assignDeviceToCustomer(@PathVariable Long deviceId, @PathVariable Long customerId) {
        DeviceDto updatedDevice = deviceService.assignDeviceToCustomer(deviceId, customerId);
        return ResponseEntity.ok(updatedDevice);
    }

    /**
     * Assigns a device to a partner's pool (only for Supervisor).
     *
     * @param deviceId the ID of the device to assign
     * @param partnerId the ID of the partner to assign the device to
     * @return the updated device DTO
     */
    @PutMapping("/{deviceId}/assign-to-partner/{partnerId}")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<DeviceDto> assignDeviceToPartner(@PathVariable Long deviceId, @PathVariable Long partnerId) {
        DeviceDto updatedDevice = deviceService.assignDeviceToPartner(deviceId, partnerId);
        return ResponseEntity.ok(updatedDevice);
    }

    /**
     * Gets a list of customers for the current user.
     *
     * @return a {@link ResponseEntity} containing the list of customers
     */
    @GetMapping("/customers")
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'PARTNER')")
    public ResponseEntity<List<com.example.demo.dto.CustomerDto>> getCustomersForCurrentUser() {
        return ResponseEntity.ok(deviceService.getCustomersForCurrentUser());
    }

    /**
     * Gets a list of devices for a specific customer.
     *
     * @param customerId the ID of the customer
     * @return a {@link ResponseEntity} containing the list of {@link DeviceDto}s
     */
    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'PARTNER')")
    public ResponseEntity<List<DeviceDto>> getDevicesByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(deviceService.getDevicesByCustomerId(customerId));
    }
}
