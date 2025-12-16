package com.server.model;

import jakarta.persistence.*;

@Entity
@Table(name = "episodes")
public class EpisodeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "season_id")
    private SeasonEntity season;

    // Optional but handy: fast access to show
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "tv_show_id")
    private TVShowEntity tvShow;

    @Column(nullable = false, length = 256)
    private String name;

    // getters/setters
    public Long getId() { return id; }

    public SeasonEntity getSeason() { return season; }
    public void setSeason(SeasonEntity season) { this.season = season; }

    public TVShowEntity getTvShow() { return tvShow; }
    public void setTvShow(TVShowEntity tvShow) { this.tvShow = tvShow; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}

