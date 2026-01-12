package com.server.controller;

import com.server.dto.CreateTVShowRequest;
import com.server.dto.TVShowResponse;
import com.server.dto.TVShowUpdateRequest;
import com.server.mapper.TVShowMapper;
import com.server.model.TVShowEntity;
import com.server.repository.TVShowRepository;
import com.server.service.TVShowService;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.server.service.StorageService;


import java.util.List;

@RestController
@RequestMapping("/tvshows")
public class TVShowController {

    private final TVShowRepository repository;
    private final TVShowService service;
    private final StorageService storageService;

    public TVShowController(TVShowRepository repository, TVShowService service, StorageService storageService) {
        this.repository = repository;
        this.service = service;
        this.storageService = storageService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<TVShowResponse> create(@RequestBody CreateTVShowRequest req) {
        TVShowEntity tv = TVShowMapper.toEntity(req);

        // Upload base64 -> URL and overwrite
        String posterUrl = storageService.uploadDataUrlImage(req.poster, "posters");
        String bannerUrl = storageService.uploadDataUrlImage(req.banner, "banners");
        String logoUrl   = storageService.uploadDataUrlImage(req.logo, "logos");

        tv.setPoster(posterUrl);
        tv.setBanner(bannerUrl);
        tv.setLogo(logoUrl);

        repository.save(tv);
        return ResponseEntity.ok(TVShowMapper.toResponse(tv));
    }

    // READ ALL
    @GetMapping
    public List<TVShowResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(TVShowMapper::toResponse)
                .toList();
    }

    @GetMapping("/popular")
    public List<TVShowResponse> getPopular() {
        return repository.findAll(
                        Sort.by(Sort.Direction.DESC, "likes")
                )
                .stream()
                .map(TVShowMapper::toResponse)
                .toList();
    }

    // READ ONE
    @GetMapping("/{id}")
    public TVShowResponse getOne(@PathVariable Long id) {
        return repository.findById(id)
                .map(TVShowMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("TV show not found"));
    }
    @PutMapping("/{id}")
    public ResponseEntity<TVShowResponse> update(@PathVariable Long id, @RequestBody TVShowUpdateRequest req) {
        TVShowEntity tv = repository.findById(id).orElseThrow(() -> new RuntimeException("TV show not found"));

        // update normal fields
        tv.setName(req.name);
        tv.setYear(req.year);
        tv.setAudience(req.audience);
        tv.setSeasons(req.seasons);
        tv.setGenre(req.genre);
        tv.setStatus(req.status);
        tv.setDescription(req.description);
        tv.setStreaming(req.streaming);
        tv.setLikes(req.likes);
        tv.setNewSeason(req.newSeason);

        // upload only if a new image is provided
        if (req.poster != null && !req.poster.isBlank()) {
            tv.setPoster(storageService.uploadDataUrlImage(req.poster, "posters"));
        }
        if (req.banner != null && !req.banner.isBlank()) {
            tv.setBanner(storageService.uploadDataUrlImage(req.banner, "banners"));
        }
        if (req.logo != null && !req.logo.isBlank()) {
            tv.setLogo(storageService.uploadDataUrlImage(req.logo, "logos"));
        }

        repository.save(tv);
        return ResponseEntity.ok(TVShowMapper.toResponse(tv));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build(); // 204
    }
    // GET /tv-shows/not-started/{userId}
    @GetMapping("/not-started/{userId}")
    public List<TVShowEntity> getNotStartedShows(@PathVariable Long userId) {
        return service.getShowsUserHasNotStarted(userId);
    }
    @GetMapping("/upcoming")
    public List<TVShowResponse> getUpcomingTVShows() {
        return service.getUpcomingSeasons().stream()
                .map(TVShowMapper::toResponse)
                .toList();
    }

}
