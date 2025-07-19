package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public class TaskUpdateRequest {
    @NotBlank(message = "Status is required")
    private String status;

    // Getters and Setters

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
