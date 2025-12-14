package com.server.controller;

import com.server.dto.WatchProgressRequest;
import com.server.dto.WatchProgressResponse;
import com.server.service.WatchProgressService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/watch-progress")
public class WatchProgressController {

    private final WatchProgressService service;

    public WatchProgressController(WatchProgressService service) {
        this.service = service;
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
}
