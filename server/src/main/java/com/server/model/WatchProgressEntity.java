package com.server.model;

import jakarta.persistence.*;

@Entity
@Table(
        name = "watch_progress"
)
public class WatchProgressEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "tv_show_id")
    private TVShowEntity tvShow;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "season_id")
    private SeasonEntity season;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "episode_id")
    private EpisodeEntity episode;

    // getters/setters
    public Long getId() { return id; }

    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }

    public TVShowEntity getTvShow() { return tvShow; }
    public void setTvShow(TVShowEntity tvShow) { this.tvShow = tvShow; }

    public SeasonEntity getSeason() { return season; }
    public void setSeason(SeasonEntity season) { this.season = season; }

    public EpisodeEntity getEpisode() { return episode; }
    public void setEpisode(EpisodeEntity episode) { this.episode = episode; }
}

