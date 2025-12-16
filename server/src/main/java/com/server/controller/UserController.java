package com.server.controller;

import com.server.dto.TVShowResponse;
import com.server.dto.UserResponse;
import com.server.dto.UserUpdateRequest;
import com.server.dto.WatchedEpisodeResponse;
import com.server.mapper.TVShowMapper;
import com.server.model.TVShowEntity;
import com.server.model.UserEntity;
import com.server.repository.UserRepository;
import com.server.repository.WatchProgressRepository;
import com.server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final WatchProgressRepository watchProgressRepository;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder, UserService userService, WatchProgressRepository watchProgressRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
        this.watchProgressRepository = watchProgressRepository;
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
    // FAVORITES
    @GetMapping("/{userId}/favorites")
    public List<TVShowResponse> getFavorites(@PathVariable Long userId) {
        return userService.getFavorites(userId);
    }

    @PostMapping("/{userId}/favorites/{tvShowId}")
    public ResponseEntity<Void> addFavorite(@PathVariable Long userId, @PathVariable Long tvShowId) {
        userService.addFavorite(userId, tvShowId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{userId}/favorites/{tvShowId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable Long userId, @PathVariable Long tvShowId) {
        userService.removeFavorite(userId, tvShowId);
        return ResponseEntity.noContent().build();
    }

    // WATCHLIST
    @GetMapping("/{userId}/watchlist")
    public List<TVShowResponse> getWatchlist(@PathVariable Long userId) {
        return userService.getWatchlist(userId);
    }

    @PostMapping("/{userId}/watchlist/{tvShowId}")
    public ResponseEntity<Void> addToWatchlist(@PathVariable Long userId, @PathVariable Long tvShowId) {
        userService.addToWatchlist(userId, tvShowId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{userId}/watchlist/{tvShowId}")
    public ResponseEntity<Void> removeFromWatchlist(@PathVariable Long userId, @PathVariable Long tvShowId) {
        userService.removeFromWatchlist(userId, tvShowId);
        return ResponseEntity.noContent().build();
    }
    // GET /users/{userId}/favorites/{showId}
    @GetMapping("/{userId}/favorites/{showId}")
    public ResponseEntity<Map<String, Boolean>> isFavorite(
            @PathVariable Long userId,
            @PathVariable Long showId
    ) {
        boolean isFavorite = userRepository.isFavorite(userId, showId);
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }

    // GET /users/{userId}/added/{showId}
    @GetMapping("/{userId}/added/{showId}")
    public ResponseEntity<Map<String, Boolean>> isAdded(
            @PathVariable Long userId,
            @PathVariable Long showId
    ) {
        boolean isAdded = userRepository.isInWatchlist(userId, showId);
        return ResponseEntity.ok(Map.of("isAdded", isAdded));
    }
    @GetMapping("/{userId}/watched-episodes")
    public ResponseEntity<List<WatchedEpisodeResponse>> getWatchedEpisodes(
            @PathVariable Long userId
    ) {
        var result = watchProgressRepository.findAllByUserIdWithDetails(userId)
                .stream()
                .map(wp -> {
                    WatchedEpisodeResponse dto = new WatchedEpisodeResponse();
                    dto.tvShowId = wp.getTvShow().getId();
                    dto.seasonId = wp.getSeason().getId();
                    dto.episodeId = wp.getEpisode().getId();
                    dto.episodeName = wp.getEpisode().getName();
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(result);
    }
    @PostMapping("/{userId}/added/{showId}")
    public ResponseEntity<Void> add(@PathVariable Long userId, @PathVariable Long showId) {
        userService.add(userId, showId);
        return ResponseEntity.noContent().build(); // 204 (frontend doesn't need body)
    }

    @DeleteMapping("/{userId}/added/{showId}")
    public ResponseEntity<Void> remove(@PathVariable Long userId, @PathVariable Long showId) {
        userService.remove(userId, showId);
        return ResponseEntity.noContent().build();
    }


}
