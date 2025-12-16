package com.server.service;

import com.server.dto.TVShowResponse;
import com.server.model.RevokedTokenEntity;
import com.server.model.TVShowEntity;
import com.server.model.UserEntity;
import com.server.repository.RevokedTokenRepository;
import com.server.repository.TVShowRepository;
import com.server.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.server.config.JwtService;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Map;



import java.time.LocalDate;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RevokedTokenRepository revokedTokenRepository;
    private final TVShowRepository tvShowRepository;


    public UserService(UserRepository userRepository,JwtService jwtService,
                       PasswordEncoder passwordEncoder,RevokedTokenRepository revokedTokenRepository, TVShowRepository tvShowRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService =  jwtService;
        this.revokedTokenRepository = revokedTokenRepository;
        this.tvShowRepository = tvShowRepository;
    }

    public UserEntity register(String username,
                               String email,
                               String rawPassword,
                               String gender,
                               LocalDate birthdate,
                               boolean isAdmin) {

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already in use");
        }

        UserEntity user = new UserEntity();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(rawPassword)); // ✅ store hash
        user.setGender(gender);
        user.setBirthdate(birthdate);
        user.setAdmin(isAdmin);

        return userRepository.save(user);
    }
    public Map<String, Object> login(String email, String rawPassword) {

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtService.generateToken(
                user.getId(),
                user.getUsername(),
                user.isAdmin()
        );

        return Map.of(
                "token", token,
                "userId", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "isAdmin", user.isAdmin()
        );

    }
    public void logout(String token) {
        revokedTokenRepository.save(new RevokedTokenEntity(token));
    }
    @Transactional(readOnly = true)
    public List<TVShowResponse> getFavorites(Long userId) {
        UserEntity user = userRepository.findWithFavoritesById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFavorites().stream()
                .map(tv -> new TVShowResponse(
                        tv.getId(),
                        tv.getName(),
                        tv.getYear(),
                        tv.getAudience(),
                        tv.getSeasons(),
                        tv.getGenre(),
                        tv.getStatus(),
                        tv.getDescription(),
                        tv.getStreaming(),
                        tv.getLikes(),
                        tv.getNewSeason(),
                        tv.getPoster(),
                        tv.getBanner(),
                        tv.getLogo()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TVShowResponse> getWatchlist(Long userId) {
        UserEntity user = userRepository.findWithWatchlistById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getWatchlist().stream()
                .map(tv -> new TVShowResponse(
                        tv.getId(),
                        tv.getName(),
                        tv.getYear(),
                        tv.getAudience(),
                        tv.getSeasons(),
                        tv.getGenre(),
                        tv.getStatus(),
                        tv.getDescription(),
                        tv.getStreaming(),
                        tv.getLikes(),
                        tv.getNewSeason(),
                        tv.getPoster(),
                        tv.getBanner(),
                        tv.getLogo()
                ))
                .toList();
    }

    @Transactional
    public void addFavorite(Long userId, Long tvShowId) {
        UserEntity user = userRepository.findWithFavoritesById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        TVShowEntity show = tvShowRepository.findById(tvShowId)
                .orElseThrow(() -> new RuntimeException("TV show not found"));

        user.getFavorites().add(show);
        userRepository.save(user);
    }

    @Transactional
    public void removeFavorite(Long userId, Long tvShowId) {
        UserEntity user = userRepository.findWithFavoritesById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.getFavorites().removeIf(tv -> tv.getId().equals(tvShowId));
        userRepository.save(user);
    }

    @Transactional
    public void addToWatchlist(Long userId, Long tvShowId) {
        UserEntity user = userRepository.findWithWatchlistById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        TVShowEntity show = tvShowRepository.findById(tvShowId)
                .orElseThrow(() -> new RuntimeException("TV show not found"));

        user.getWatchlist().add(show);
        userRepository.save(user);
    }

    @Transactional
    public void removeFromWatchlist(Long userId, Long tvShowId) {
        UserEntity user = userRepository.findWithWatchlistById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.getWatchlist().removeIf(tv -> tv.getId().equals(tvShowId));
        userRepository.save(user);
    }
    @Transactional
    public void add(Long userId, Long showId) {
        UserEntity user = userRepository.findWithWatchlistById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TVShowEntity show = tvShowRepository.findById(showId)
                .orElseThrow(() -> new RuntimeException("TV show not found"));

        user.getWatchlist().add(show); // ManyToMany owning side => this persists via join table
        userRepository.save(user);
    }

    @Transactional
    public void remove(Long userId, Long showId) {
        UserEntity user = userRepository.findWithWatchlistById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.getWatchlist().removeIf(tv -> tv.getId().equals(showId));
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public boolean isAdded(Long userId, Long showId) {
        UserEntity user = userRepository.findWithWatchlistById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getWatchlist().stream().anyMatch(tv -> tv.getId().equals(showId));
    }
}
