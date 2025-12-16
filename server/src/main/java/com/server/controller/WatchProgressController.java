package com.server.controller;

import com.server.dto.WatchProgressRequest;
import com.server.dto.WatchProgressResponse;
import com.server.dto.WatchedEpisodeResponse;
import com.server.repository.WatchProgressRepository;
import com.server.service.WatchProgressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/watch-progress")
public class WatchProgressController {

    private final WatchProgressService service;
    private final WatchProgressRepository watchProgressRepository;


    public WatchProgressController(WatchProgressService service,WatchProgressRepository watchProgressRepository) {
        this.service = service;
        this.watchProgressRepository = watchProgressRepository;
    }

    // create or update progress
    @PostMapping
    public WatchProgressResponse save(@RequestBody WatchProgressRequest req) {
        return service.createOrUpdate(req);
    }

    // get one
    @GetMapping("/{id}")
    public WatchProgressResponse getOne(@PathVariable Long id) {
        return service.getOne(id);
    }

    // get all
    @GetMapping
    public List<WatchProgressResponse> getAll() {
        return service.getAll();
    }

    // get all progress for user
    @GetMapping("/by-user/{userId}")
    public List<WatchProgressResponse> getByUser(@PathVariable Long userId) {
        return service.getByUser(userId);
    }

    // delete
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PostMapping("/{userId}/watched-episodes/{episodeId}")
    public ResponseEntity<Void> markWatched(@PathVariable Long userId, @PathVariable Long episodeId) {
        service.markWatched(userId, episodeId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{userId}/watched-episodes/{episodeId}")
    public ResponseEntity<Void> unmarkWatched(@PathVariable Long userId, @PathVariable Long episodeId) {
        service.unmarkWatched(userId, episodeId);
        return ResponseEntity.noContent().build();
    }

    // optional (handy for your UI to know initial state)
    @GetMapping("/{userId}/watched-episodes/{episodeId}")
    public ResponseEntity<Map<String, Boolean>> isWatched(@PathVariable Long userId, @PathVariable Long episodeId) {
        return ResponseEntity.ok(Map.of("isWatched", service.isWatched(userId, episodeId)));
    }

    // you already asked for this earlier: returns episode IDs watched by the user
    @GetMapping("/{userId}/watched-episodes")
    public ResponseEntity<List<Long>> getWatchedEpisodeIds(@PathVariable Long userId) {
        List<Long> ids = watchProgressRepository.findAllByUser_Id(userId).stream()
                .map(wp -> wp.getEpisode().getId())
                .distinct()
                .toList();
        return ResponseEntity.ok(ids);
    }


}
