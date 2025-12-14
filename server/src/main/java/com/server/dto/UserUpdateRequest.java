package com.server.dto;

import java.time.LocalDate;

public record UserUpdateRequest(
        String username,
        String email,
        String gender,
        LocalDate birthdate,
        Boolean isAdmin,
        String newPassword // optional: if provided, we re-hash and replace passwordHash
) {}
