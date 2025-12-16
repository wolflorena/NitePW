package com.server.dto;

public class WatchlistCardDto {
    public Long tvShowId;
    public String name;
    public String poster;
    public String banner;
    public String status;
    public ProgressDto progress; // null for "not started"

    public static class ProgressDto {
        public Long seasonId;
        public String seasonName;
        public Long episodeId;
        public String episodeName;
    }
}
