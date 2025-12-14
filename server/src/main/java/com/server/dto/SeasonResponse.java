package com.server.dto;

public record SeasonResponse(
        Long id,
        Long tvShowId,
        String name,
        Integer numberOfEpisodes,
        Integer durationEpisode
) {}