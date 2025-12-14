package com.server.dto;

public class EpisodeUpdateRequest {
    public String name;       // optional
    public Long seasonId;     // optional (move episode to another season)
}
