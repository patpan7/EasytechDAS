package com.example.demo.service;

import com.example.demo.dto.PasswordChangeRequest;
import com.example.demo.dto.UserDto;
import com.example.demo.dto.UserSelectionDto;
import com.example.demo.dto.UserUpdateRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserSelectionDto> findPartners() {
        return userRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).stream()
                .filter(user -> user.getRole().startsWith("ROLE_PARTNER"))
                .map(user -> new UserSelectionDto(user.getId(), user.getUsername()))
                .collect(Collectors.toList());
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public UserDto updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        user.setRole(request.getRole());
        user.setEnabled(request.isEnabled());
        // Only update these fields if they are provided in the request
        if (request.getEponimia() != null) user.setEponimia(request.getEponimia());
        if (request.getTitle() != null) user.setTitle(request.getTitle());
        if (request.getAfm() != null) user.setAfm(request.getAfm());
        if (request.getProfession() != null) user.setProfession(request.getProfession());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getCity() != null) user.setCity(request.getCity());
        if (request.getZipCode() != null) user.setZipCode(request.getZipCode());
        if (request.getDoy() != null) user.setDoy(request.getDoy());
        if (request.getPhone1() != null) user.setPhone1(request.getPhone1());
        if (request.getPhone2() != null) user.setPhone2(request.getPhone2());
        if (request.getMobile() != null) user.setMobile(request.getMobile());
        if (request.getEmail() != null) user.setEmail(request.getEmail());

        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }

    public void resetPasswordBySupervisor(Long userId, String temporaryPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(temporaryPassword));
        user.setTemporaryPassword(true); // Mark as temporary
        user.setEnabled(true); // Enable user upon password reset by supervisor
        userRepository.save(user);
    }

    public void changePassword(Long userId, PasswordChangeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password does not match.");
        }

        // Check if new passwords match
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new IllegalArgumentException("New password and confirmation do not match.");
        }

        // Encode and set new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setTemporaryPassword(false); // Password is no longer temporary
        userRepository.save(user);
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        dto.setEnabled(user.isEnabled());
        dto.setEponimia(user.getEponimia());
        dto.setTitle(user.getTitle());
        dto.setAfm(user.getAfm());
        dto.setProfession(user.getProfession());
        dto.setAddress(user.getAddress());
        dto.setCity(user.getCity());
        dto.setZipCode(user.getZipCode());
        dto.setDoy(user.getDoy());
        dto.setPhone1(user.getPhone1());
        dto.setPhone2(user.getPhone2());
        dto.setMobile(user.getMobile());
        dto.setEmail(user.getEmail());
        return dto;
    }
}
