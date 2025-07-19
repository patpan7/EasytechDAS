package com.example.demo.service;

import com.example.demo.config.JwtUtil;
import com.example.demo.dto.AuthenticationRequest;
import com.example.demo.dto.AuthenticationResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service for handling user authentication and registration.
 */
@Service
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(AuthenticationManager authenticationManager, UserDetailsService userDetailsService, JwtUtil jwtUtil, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Authenticates a user and returns a JWT.
     *
     * @param request the authentication request containing the username and password
     * @return an {@link AuthenticationResponse} containing the JWT
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (org.springframework.security.authentication.CredentialsExpiredException e) {
            // This is the expected exception for a user with a temporary password.
            // We can ignore it and proceed to generate a token, which will
            // contain the 'temporaryPassword=true' claim, forcing a password change.
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        final User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found"));
        final String jwt = jwtUtil.generateToken(userDetails, user);

        return new AuthenticationResponse(jwt);
    }

    /**
     * Registers a new user.
     *
     * @param request the registration request containing the username, password, and role
     * @return the registered user
     */
    public User register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setEponimia(request.getEponimia());
        user.setTitle(request.getTitle());
        user.setAfm(request.getAfm());
        user.setProfession(request.getProfession());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setZipCode(request.getZipCode());
        user.setDoy(request.getDoy());
        user.setPhone1(request.getPhone1());
        user.setPhone2(request.getPhone2());
        user.setMobile(request.getMobile());
        user.setEmail(request.getEmail());
        user.setEnabled(true); // New users are disabled by default
        user.setTemporaryPassword(true); // New users have temporary password by default
        return userRepository.save(user);
    }
}
