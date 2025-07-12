package com.example.demo.controller;

import com.example.demo.dto.DeviceDto;
import com.example.demo.service.DeviceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<List<DeviceDto>> getDevices() {
        return ResponseEntity.ok(deviceService.getDevices());
    }
}
