package com.server.service;

import com.server.dto.WatchProgressRequest;
import com.server.dto.WatchProgressResponse;
import com.server.model.*;
import com.server.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class WatchProgressService {

    private final WatchProgressRepository repo;
    private final UserRepository userRepo;
    private final TVShowRepository tvShowRepo;
    private final SeasonRepository seasonRepo;
    private final EpisodeRepository episodeRepo;

    public WatchProgressService(
            WatchProgressRepository repo,
            UserRepository userRepo,
            TVShowRepository tvShowRepo,
            SeasonRepository seasonRepo,
            EpisodeRepository episodeRepo
    ) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.tvShowRepo = tvShowRepo;
        this.seasonRepo = seasonRepo;
        this.episodeRepo = episodeRepo;
    }

    @Transactional
    public WatchProgressResponse createOrUpdate(WatchProgressRequest req) {

        UserEntity user = userRepo.findById(req.userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        TVShowEntity show = tvShowRepo.findById(req.tvShowId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "TV show not found"));

        SeasonEntity season = seasonRepo.findById(req.seasonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Season not found"));

        EpisodeEntity episode = episodeRepo.findById(req.episodeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Episode not found"));

        WatchProgressEntity progress = repo
                .findByUserIdAndTvShowId(user.getId(), show.getId())
                .orElse(new WatchProgressEntity());

        progress.setUser(user);
        progress.setTvShow(show);
        progress.setSeason(season);
        progress.setEpisode(episode);

        return toResponse(repo.save(progress));
    }

    @Transactional(readOnly = true)
    public WatchProgressResponse getOne(Long id) {
        return repo.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Progress not found"));
    }

    @Transactional(readOnly = true)
    public List<WatchProgressResponse> getAll() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<WatchProgressResponse> getByUser(Long userId) {
        return repo.findByUserId(userId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Progress not found");
        }
        repo.deleteById(id);
    }

    private WatchProgressResponse toResponse(WatchProgressEntity wp) {
        WatchProgressResponse r = new WatchProgressResponse();
        r.id = wp.getId();
        r.userId = wp.getUser().getId();
        r.tvShowId = wp.getTvShow().getId();
        r.seasonId = wp.getSeason().getId();
        r.episodeId = wp.getEpisode().getId();
        return r;
    }
}
