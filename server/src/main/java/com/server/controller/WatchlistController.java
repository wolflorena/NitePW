package com.server.controller;

import com.server.dto.WatchlistCardDto;
import com.server.service.WatchlistService;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/watchlist")
public class WatchlistController {

    private final WatchlistService service;

    public WatchlistController(WatchlistService service) {
        this.service = service;
    }

    @GetMapping("/{userId}/currently-watching")
    public Page<WatchlistCardDto> currentlyWatching(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return service.getCurrentlyWatching(userId, PageRequest.of(page, size));
    }

    @GetMapping("/{userId}/not-started")
    public Page<WatchlistCardDto> notStarted(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return service.getNotStarted(userId, PageRequest.of(page, size));
    }

    @GetMapping("/{userId}/up-to-date")
    public Page<WatchlistCardDto> upToDate(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return service.getUpToDate(userId, PageRequest.of(page, size));
    }

    @GetMapping("/{userId}/finished")
    public Page<WatchlistCardDto> finished(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return service.getFinished(userId, PageRequest.of(page, size));
    }
}
