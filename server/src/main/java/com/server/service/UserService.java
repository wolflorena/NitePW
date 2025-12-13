package com.server.service;

import com.server.model.RevokedTokenEntity;
import com.server.model.UserEntity;
import com.server.repository.RevokedTokenRepository;
import com.server.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.server.config.JwtService;
import java.util.Map;



import java.time.LocalDate;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RevokedTokenRepository revokedTokenRepository;


    public UserService(UserRepository userRepository,JwtService jwtService,
                       PasswordEncoder passwordEncoder,RevokedTokenRepository revokedTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService =  jwtService;
        this.revokedTokenRepository = revokedTokenRepository;
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

}
