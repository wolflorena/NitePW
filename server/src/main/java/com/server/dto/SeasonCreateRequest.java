package com.server.dto;

public record SeasonCreateRequest(
        Long tvShowId,
        String name,
        Integer numberOfEpisodes,
        Integer durationEpisode
) {}