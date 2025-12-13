package com.server.controller;

import com.server.model.UserEntity;
import com.server.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserEntity register(@RequestBody RegisterRequest req) {
        LocalDate birthdate = (req.birthdate() == null || req.birthdate().isBlank())
                ? null
                : LocalDate.parse(req.birthdate()); // expects yyyy-MM-dd

        return userService.register(
                req.username(),
                req.email(),
                req.password(),
                req.gender(),
                birthdate,
                Boolean.TRUE.equals(req.isAdmin())
        );
    }

    public record RegisterRequest(
            String username,
            String email,
            String password,
            String gender,
            String birthdate,
            Boolean isAdmin
    ) {}
    @PostMapping("/login")
    public Object login(@RequestBody LoginRequest req) {
        return userService.login(req.email(), req.password());
    }

    public record LoginRequest(
            String email,
            String password
    ) {}
    @PostMapping("/logout")
    public void logout(@RequestHeader("Authorization") String authHeader) {

        if (!authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid Authorization header");
        }

        String token = authHeader.substring(7);
        userService.logout(token);
    }


}
