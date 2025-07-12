package com.example.demo.dto;

/**
 * A DTO representing the request body for user authentication.
 * It contains the username and password.
 */
public class AuthenticationRequest {

    private String username;
    private String password;

    // Getters and Setters

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
