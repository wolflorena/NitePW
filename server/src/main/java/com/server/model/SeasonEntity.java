package com.server.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "seasons")
public class SeasonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "tv_show_id")
    private TVShowEntity tvShow;

    @Column(nullable = false, length = 256)
    private String name;

    private Integer numberOfEpisodes;
    private Integer durationEpisode;

    @OneToMany(mappedBy = "season", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EpisodeEntity> episodes = new ArrayList<>();

    // getters/setters
    public Long getId() { return id; }

    public TVShowEntity getTvShow() { return tvShow; }
    public void setTvShow(TVShowEntity tvShow) { this.tvShow = tvShow; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getNumberOfEpisodes() { return numberOfEpisodes; }
    public void setNumberOfEpisodes(Integer numberOfEpisodes) { this.numberOfEpisodes = numberOfEpisodes; }

    public Integer getDurationEpisode() { return durationEpisode; }
    public void setDurationEpisode(Integer durationEpisode) { this.durationEpisode = durationEpisode; }

    public List<EpisodeEntity> getEpisodes() { return episodes; }
}
