package com.server.service;

import com.server.dto.TVShowUpdateRequest;
import com.server.model.TVShowEntity;
import com.server.repository.TVShowRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TVShowService {

    private final TVShowRepository repository;

    public TVShowService(TVShowRepository repository) {
        this.repository = repository;
    }

    public TVShowEntity update(Long id, TVShowUpdateRequest req) {
        TVShowEntity show = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("TV Show not found"));

        if (req.name != null) show.setName(req.name);
        if (req.year != null) show.setYear(req.year);
        if (req.audience != null) show.setAudience(req.audience);
        if (req.seasons != null) show.setSeasons(req.seasons);
        if (req.genre != null) show.setGenre(req.genre);
        if (req.status != null) show.setStatus(req.status);
        if (req.description != null) show.setDescription(req.description);
        if (req.streaming != null) show.setStreaming(req.streaming);
        if (req.likes != null) show.setLikes(req.likes);
        if (req.newSeason != null) show.setNewSeason(req.newSeason);

        // base64 fields
        if (req.poster != null) show.setPoster(req.poster);
        if (req.banner != null) show.setBanner(req.banner);
        if (req.logo != null) show.setLogo(req.logo);

        return repository.save(show);
    }
    public List<TVShowEntity> getShowsUserHasNotStarted(Long userId) {
        return repository.findAllNotStartedByUser(userId);
    }
}
