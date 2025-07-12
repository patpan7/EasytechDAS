package com.example.demo.dto;

public class UserDto {
    private Long id;
    private String username;
    private String role;
    private boolean enabled;
    private String eponimia;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getEponimia() {
        return eponimia;
    }

    public void setEponimia(String eponimia) {
        this.eponimia = eponimia;
    }
}
