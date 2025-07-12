package com.example.demo.dto;

/**
 * A DTO for populating user selection dropdowns.
 */
public class UserSelectionDto {
    private Long id;
    private String username;

    public UserSelectionDto(Long id, String username) {
        this.id = id;
        this.username = username;
    }

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
}
