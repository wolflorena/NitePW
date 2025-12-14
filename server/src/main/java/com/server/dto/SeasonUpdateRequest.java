package com.server.dto;

public record SeasonUpdateRequest(
        String name,
        Integer numberOfEpisodes,
        Integer durationEpisode
) {}
