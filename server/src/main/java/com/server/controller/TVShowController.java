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

import java.util.List;

@RestController
@RequestMapping("/tvshows")
public class TVShowController {

    private final TVShowRepository repository;
    private final TVShowService service;

    public TVShowController(TVShowRepository repository, TVShowService service) {
        this.repository = repository;
        this.service = service;

    }

    // CREATE
    @PostMapping
    public TVShowResponse create(@RequestBody CreateTVShowRequest request) {
        TVShowEntity saved = repository.save(
                TVShowMapper.toEntity(request)
        );
        return TVShowMapper.toResponse(saved);
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
    //update
    @PutMapping("/{id}")
    public TVShowEntity update(
            @PathVariable Long id,
            @RequestBody TVShowUpdateRequest request
    ) {
        return service.update(id, request);
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
}
