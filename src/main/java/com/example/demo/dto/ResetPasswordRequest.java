package com.example.demo.dto;

public class ResetPasswordRequest {
    private String temporaryPassword;

    // Getters and Setters
    public String getTemporaryPassword() {
        return temporaryPassword;
    }

    public void setTemporaryPassword(String temporaryPassword) {
        this.temporaryPassword = temporaryPassword;
    }
}
