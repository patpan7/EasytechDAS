package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public class DeviceCreateRequest {

    @NotBlank(message = "Serial number is required")
    private String serialNumber;

    @NotBlank(message = "Status is required")
    private String status;

    private Long customerId;
    private Long assignedToUserId;

    // Getters and Setters

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getAssignedToUserId() {
        return assignedToUserId;
    }

    public void setAssignedToUserId(Long assignedToUserId) {
        this.assignedToUserId = assignedToUserId;
    }
}
