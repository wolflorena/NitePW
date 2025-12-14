package com.server.controller;

import com.server.dto.UserResponse;
import com.server.dto.UserUpdateRequest;
import com.server.model.TVShowEntity;
import com.server.model.UserEntity;
import com.server.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // GET /users
    @GetMapping
    @Transactional(readOnly = true)
    public List<UserResponse> getAll() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    // GET /users/{id}
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<UserResponse> getOne(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(u -> ResponseEntity.ok(toResponse(u)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // PUT /users/{id}  (full or partial update via nullable fields)
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<UserResponse> update(@PathVariable Long id,
                                               @RequestBody UserUpdateRequest req) {

        UserEntity user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        // username uniqueness if changed
        if (req.username() != null && !req.username().equals(user.getUsername())) {
            if (userRepository.existsByUsername(req.username())) {
                return ResponseEntity.badRequest().build();
            }
            user.setUsername(req.username());
        }

        // email uniqueness if changed
        if (req.email() != null && !req.email().equals(user.getEmail())) {
            if (userRepository.existsByEmail(req.email())) {
                return ResponseEntity.badRequest().build();
            }
            user.setEmail(req.email());
        }

        if (req.gender() != null) user.setGender(req.gender());
        if (req.birthdate() != null) user.setBirthdate(req.birthdate());
        if (req.isAdmin() != null) user.setAdmin(req.isAdmin());

        // password update (optional)
        if (req.newPassword() != null && !req.newPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(req.newPassword()));
        }

        UserEntity saved = userRepository.save(user);
        return ResponseEntity.ok(toResponse(saved));
    }

    // DELETE /users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private UserResponse toResponse(UserEntity u) {
        return new UserResponse(
                u.getId(),
                u.getUsername(),
                u.getEmail(),
                u.getGender(),
                u.getBirthdate(),
                u.isAdmin(),
                u.getFavorites().stream().map(TVShowEntity::getId).collect(Collectors.toSet()),
                u.getWatchlist().stream().map(TVShowEntity::getId).collect(Collectors.toSet())
        );
    }
}
