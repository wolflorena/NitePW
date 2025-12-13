package com.server.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tv_shows")
public class TVShowEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 256)
    private String name;

    private Integer year;

    @Column(length = 64)
    private String audience;

    private Integer seasons;

    @Column(length = 64)
    private String genre;

    @Column(length = 64)
    private String status;

    @Column(columnDefinition = "text")
    private String description;

    @Column(length = 128)
    private String streaming;

    private Integer likes;

    // Store your "newSeason" as a date instead of string
    private LocalDate newSeason;

    // store URLs/paths (files themselves usually stored in S3/disk)
    private String poster;
    private String banner;
    private String logo;

    @OneToMany(mappedBy = "tvShow", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SeasonEntity> tvShowSeasons = new ArrayList<>();

    // getters/setters
    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getAudience() { return audience; }
    public void setAudience(String audience) { this.audience = audience; }

    public Integer getSeasons() { return seasons; }
    public void setSeasons(Integer seasons) { this.seasons = seasons; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStreaming() { return streaming; }
    public void setStreaming(String streaming) { this.streaming = streaming; }

    public Integer getLikes() { return likes; }
    public void setLikes(Integer likes) { this.likes = likes; }

    public LocalDate getNewSeason() { return newSeason; }
    public void setNewSeason(LocalDate newSeason) { this.newSeason = newSeason; }

    public String getPoster() { return poster; }
    public void setPoster(String poster) { this.poster = poster; }

    public String getBanner() { return banner; }
    public void setBanner(String banner) { this.banner = banner; }

    public String getLogo() { return logo; }
    public void setLogo(String logo) { this.logo = logo; }

    public List<SeasonEntity> getTvShowSeasons() { return tvShowSeasons; }
}
