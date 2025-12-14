package com.server.dto;

import java.time.LocalDate;
import java.util.Set;

public record UserResponse(
        Long id,
        String username,
        String email,
        String gender,
        LocalDate birthdate,
        boolean isAdmin,
        Set<Long> favorites,
        Set<Long> watchlist
) {}
