package com.server.controller;

import com.server.dto.EpisodeCreateRequest;
import com.server.dto.EpisodeResponse;
import com.server.dto.EpisodeUpdateRequest;
import com.server.service.EpisodeService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/episodes")
public class EpisodeController {

    private final EpisodeService service;

    public EpisodeController(EpisodeService service) {
        this.service = service;
    }

    // create episode
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EpisodeResponse create(@RequestBody EpisodeCreateRequest req) {
        return service.create(req);
    }

    // update episode
    @PutMapping("/{id}")
    public EpisodeResponse update(@PathVariable Long id, @RequestBody EpisodeUpdateRequest req) {
        return service.update(id, req);
    }

    // get one episode
    @GetMapping("/{id}")
    public EpisodeResponse getOne(@PathVariable Long id) {
        return service.getOne(id);
    }

    // get all episodes (global)
    @GetMapping
    public List<EpisodeResponse> getAll() {
        return service.getAll();
    }

    // get all episodes of a season
    @GetMapping("/by-season/{seasonId}")
    public List<EpisodeResponse> getBySeason(@PathVariable Long seasonId) {
        return service.getAllBySeason(seasonId);
    }

    // get all episodes for a tv show
    @GetMapping("/by-tvshow/{tvShowId}")
    public List<EpisodeResponse> getByTvShow(@PathVariable Long tvShowId) {
        return service.getAllByTvShow(tvShowId);
    }

    // delete episode
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
