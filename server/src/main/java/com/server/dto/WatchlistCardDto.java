package com.server.dto;

public class WatchlistCardDto {
    public Long tvShowId;
    public String name;
    public String poster;
    public String banner;
    public String status;
    public ProgressDto progress;
    private int progressPercent;

    public WatchlistCardDto(Long tvShowId, String name, String poster, String banner, String status, int progressPercent) {
        this.tvShowId = tvShowId;
        this.name = name;
        this.poster = poster;
        this.banner = banner;
        this.status = status;
        this.progressPercent = progressPercent;
    }

    public WatchlistCardDto() {
    }

    public int getProgressPercent() {
        return progressPercent;
    }

    public void setProgressPercent(int progressPercent) {
        this.progressPercent = progressPercent;
    }

    public static class ProgressDto {
        public Long seasonId;
        public String seasonName;
        public Long episodeId;
        public String episodeName;
    }

    public void setTvShowId(Long tvShowId) {
        this.tvShowId = tvShowId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }

    public void setBanner(String banner) {
        this.banner = banner;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setProgress(ProgressDto progress) {
        this.progress = progress;
    }

    public Long getTvShowId() {
        return tvShowId;
    }

    public String getName() {
        return name;
    }

    public String getPoster() {
        return poster;
    }

    public String getBanner() {
        return banner;
    }

    public String getStatus() {
        return status;
    }

    public ProgressDto getProgress() {
        return progress;
    }
}
