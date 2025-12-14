package com.server.controller;

import com.server.dto.*;
import com.server.model.SeasonEntity;
import com.server.model.TVShowEntity;
import com.server.repository.SeasonRepository;
import com.server.repository.TVShowRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/seasons")
public class SeasonController {

    private final SeasonRepository seasonRepository;
    private final TVShowRepository tvShowRepository;

    public SeasonController(SeasonRepository seasonRepository, TVShowRepository tvShowRepository) {
        this.seasonRepository = seasonRepository;
        this.tvShowRepository = tvShowRepository;
    }

    // CREATE season
    @PostMapping
    public ResponseEntity<SeasonResponse> create(@RequestBody SeasonCreateRequest req) {
        if (req.tvShowId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "tvShowId is required");
        }
        if (req.name() == null || req.name().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name is required");
        }

        TVShowEntity tvShow = tvShowRepository.findById(req.tvShowId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "TV show not found"));

        SeasonEntity season = new SeasonEntity();
        season.setTvShow(tvShow);
        season.setName(req.name());
        season.setNumberOfEpisodes(req.numberOfEpisodes());
        season.setDurationEpisode(req.durationEpisode());

        season = seasonRepository.save(season);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(season));
    }

    // GET one season
    @GetMapping("/{id}")
    public SeasonResponse getOne(@PathVariable Long id) {
        SeasonEntity season = seasonRepository.findWithTvShowById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Season not found"));
        return toResponse(season);
    }

    // GET all seasons (global)
    @GetMapping
    public List<SeasonResponse> getAll() {
        // if you want tvShow always initialized, keep EntityGraph on findAll()
        return seasonRepository.findAll().stream().map(this::toResponse).toList();
    }

    // GET all seasons of a TV show
    // example: /api/seasons/by-tvshow/123
    @GetMapping("/by-tvshow/{tvShowId}")
    public List<SeasonResponse> getAllByTvShow(@PathVariable Long tvShowId) {
        // seasons have tvShow LAZY; response only needs tvShowId, so safe.
        return seasonRepository.findByTvShow_Id(tvShowId).stream().map(this::toResponse).toList();
    }

    // UPDATE a season
    @PutMapping("/{id}")
    public SeasonResponse update(@PathVariable Long id, @RequestBody SeasonUpdateRequest req) {
        SeasonEntity season = seasonRepository.findWithTvShowById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Season not found"));

        if (req.name() != null) season.setName(req.name());
        if (req.numberOfEpisodes() != null) season.setNumberOfEpisodes(req.numberOfEpisodes());
        if (req.durationEpisode() != null) season.setDurationEpisode(req.durationEpisode());

        season = seasonRepository.save(season);
        return toResponse(season);
    }

    // DELETE a season
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!seasonRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Season not found");
        }
        // orphanRemoval=true on episodes => deleting season deletes its episodes too
        seasonRepository.deleteById(id);
    }

    private SeasonResponse toResponse(SeasonEntity s) {
        // Avoid LazyInitializationException by using findWithTvShowById for endpoints that need tvShowId.
        Long tvShowId = (s.getTvShow() != null ? s.getTvShow().getId() : null);

        return new SeasonResponse(
                s.getId(),
                tvShowId,
                s.getName(),
                s.getNumberOfEpisodes(),
                s.getDurationEpisode()
        );
    }
}
