package com.server.dto;

import java.time.LocalDate;

public record TVShowResponse(
        Long id,
        String name,
        Integer year,
        String audience,
        Integer seasons,
        String genre,
        String status,
        String description,
        String streaming,
        Integer likes,
        LocalDate newSeason,
        String poster,
        String banner,
        String logo
) {}
