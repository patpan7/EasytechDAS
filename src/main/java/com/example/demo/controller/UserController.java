package com.example.demo.controller;

import com.example.demo.dto.ResetPasswordRequest;
import com.example.demo.dto.PasswordChangeRequest;
import com.example.demo.dto.UserDto;
import com.example.demo.dto.UserSelectionDto;
import com.example.demo.dto.UserUpdateRequest;
import com.example.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/partners")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<List<UserSelectionDto>> getPartners() {
        return ResponseEntity.ok(userService.findPartners());
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @PutMapping("/{id}/password")
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'PARTNER')") // Allow supervisor to change any password, partner to change their own
    public ResponseEntity<Void> changePassword(@PathVariable Long id, @RequestBody PasswordChangeRequest request) {
        // In a real application, you would also verify that the authenticated user is allowed to change this password
        // e.g., if it's a partner, check if id matches their own user id.
        userService.changePassword(id, request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/reset-password")
    @PreAuthorize("hasRole('SUPERVISOR')") // Only supervisor can reset passwords
    public ResponseEntity<Void> resetPasswordBySupervisor(@PathVariable Long id, @RequestBody ResetPasswordRequest request) {
        if (request.getTemporaryPassword() == null || request.getTemporaryPassword().isEmpty()) {
            throw new IllegalArgumentException("Temporary password is required.");
        }
        userService.resetPasswordBySupervisor(id, request.getTemporaryPassword());
        return ResponseEntity.ok().build();
    }
}
