package com.example.demo.dto;

/**
 * A DTO representing the response body for user authentication.
 * It contains the JWT token.
 */
public class AuthenticationResponse {

    private final String jwt;

    public AuthenticationResponse(String jwt) {
        this.jwt = jwt;
    }

    public String getJwt() {
        return jwt;
    }
}
