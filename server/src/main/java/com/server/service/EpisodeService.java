package com.server.service;

import com.server.dto.EpisodeCreateRequest;
import com.server.dto.EpisodeResponse;
import com.server.dto.EpisodeUpdateRequest;
import com.server.model.EpisodeEntity;
import com.server.model.SeasonEntity;
import com.server.model.TVShowEntity;
import com.server.repository.EpisodeRepository;
import com.server.repository.SeasonRepository;
import com.server.repository.TVShowRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EpisodeService {

    private final EpisodeRepository episodeRepo;
    private final TVShowRepository tvShowRepo;
    private final SeasonRepository seasonRepo;

    public EpisodeService(EpisodeRepository episodeRepo, TVShowRepository tvShowRepo, SeasonRepository seasonRepo) {
        this.episodeRepo = episodeRepo;
        this.tvShowRepo = tvShowRepo;
        this.seasonRepo = seasonRepo;
    }

    @Transactional
    public EpisodeResponse create(EpisodeCreateRequest req) {
        if (req.tvShowId == null || req.seasonId == null || req.name == null || req.name.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "tvShowId, seasonId and name are required");
        }

        TVShowEntity show = tvShowRepo.findById(req.tvShowId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "TV show not found"));

        SeasonEntity season = seasonRepo.findById(req.seasonId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Season not found"));

        // Ensure season belongs to the given tv show
        if (!season.getTvShow().getId().equals(show.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Season does not belong to this TV show");
        }

        EpisodeEntity ep = new EpisodeEntity();
        ep.setTvShow(show);
        ep.setSeason(season);
        ep.setName(req.name.trim());

        return toResponse(episodeRepo.save(ep));
    }

    @Transactional(readOnly = true)
    public EpisodeResponse getOne(Long id) {
        EpisodeEntity ep = episodeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Episode not found"));
        return toResponse(ep);
    }

    @Transactional(readOnly = true)
    public List<EpisodeResponse> getAll() {
        return episodeRepo.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<EpisodeResponse> getAllBySeason(Long seasonId) {
        return episodeRepo.findBySeasonIdOrderByIdAsc(seasonId).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<EpisodeResponse> getAllByTvShow(Long tvShowId) {
        return episodeRepo.findByTvShowIdOrderByIdAsc(tvShowId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public EpisodeResponse update(Long id, EpisodeUpdateRequest req) {
        EpisodeEntity ep = episodeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Episode not found"));

        if (req.name != null && !req.name.isBlank()) {
            ep.setName(req.name.trim());
        }

        if (req.seasonId != null) {
            SeasonEntity newSeason = seasonRepo.findById(req.seasonId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Season not found"));

            // must belong to same tv show as episode
            if (!newSeason.getTvShow().getId().equals(ep.getTvShow().getId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New season must belong to same TV show");
            }

            ep.setSeason(newSeason);
        }

        return toResponse(episodeRepo.save(ep));
    }

    @Transactional
    public void delete(Long id) {
        if (!episodeRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Episode not found");
        }
        episodeRepo.deleteById(id);
    }

    private EpisodeResponse toResponse(EpisodeEntity ep) {
        EpisodeResponse r = new EpisodeResponse();
        r.id = ep.getId();
        r.name = ep.getName();
        r.seasonId = ep.getSeason().getId();
        r.tvShowId = ep.getTvShow().getId();
        return r;
    }
}
