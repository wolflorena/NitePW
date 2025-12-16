package com.server.service;

import com.server.dto.WatchlistCardDto;
import com.server.model.*;
import com.server.repository.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
public class WatchlistService {

    private final UserRepository userRepo;
    private final WatchProgressRepository progressRepo;
    private final SeasonRepository seasonRepo;
    private final EpisodeRepository episodeRepo;

    public WatchlistService(
            UserRepository userRepo,
            WatchProgressRepository progressRepo,
            SeasonRepository seasonRepo,
            EpisodeRepository episodeRepo
    ) {
        this.userRepo = userRepo;
        this.progressRepo = progressRepo;
        this.seasonRepo = seasonRepo;
        this.episodeRepo = episodeRepo;
    }

    public Page<WatchlistCardDto> getNotStarted(Long userId, Pageable pageable) {
        return filterWatchlist(userId, pageable, this::isNotStarted);
    }

    public Page<WatchlistCardDto> getCurrentlyWatching(Long userId, Pageable pageable) {
        return filterWatchlist(userId, pageable, this::isCurrentlyWatching);
    }

    public Page<WatchlistCardDto> getUpToDate(Long userId, Pageable pageable) {
        return filterWatchlist(userId, pageable, this::isUpToDate);
    }

    public Page<WatchlistCardDto> getFinished(Long userId, Pageable pageable) {
        return filterWatchlist(userId, pageable, this::isFinished);
    }

    private Page<WatchlistCardDto> filterWatchlist(Long userId, Pageable pageable, Predicate<Row> predicate) {
        UserEntity user = userRepo.findByIdWithWatchlist(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Map<Long, WatchProgressEntity> progressByShowId = progressRepo.findAllByUser_Id(userId)
                .stream()
                .collect(Collectors.toMap(wp -> wp.getTvShow().getId(), wp -> wp));

        List<Row> rows = user.getWatchlist().stream()
                .map(show -> new Row(show, progressByShowId.get(show.getId())))
                .filter(predicate)
                .toList();

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), rows.size());
        List<Row> pageRows = (start >= end) ? List.of() : rows.subList(start, end);

        List<WatchlistCardDto> dto = pageRows.stream().map(this::toDto).toList();
        return new PageImpl<>(dto, pageable, rows.size());
    }

    private boolean isNotStarted(Row r) {
        return r.progress == null;
    }

    private boolean isCurrentlyWatching(Row r) {
        if (r.progress == null) return false;
        return !isCaughtUp(r.show, r.progress) && !isShowFinished(r.show);
    }

    private boolean isUpToDate(Row r) {
        if (r.progress == null) return false;
        return isCaughtUp(r.show, r.progress) && !isShowFinished(r.show);
    }

    private boolean isFinished(Row r) {
        if (r.progress == null) return false;
        return isCaughtUp(r.show, r.progress) && isShowFinished(r.show);
    }

    private boolean isCaughtUp(TVShowEntity show, WatchProgressEntity wp) {
        Long lastSeasonId = seasonRepo.findLastSeasonId(show.getId());
        if (lastSeasonId == null) return false;

        Long lastEpisodeId = episodeRepo.findLastEpisodeId(lastSeasonId);
        if (lastEpisodeId == null) return false;

        Long curSeasonId = wp.getSeason() != null ? wp.getSeason().getId() : null;
        Long curEpisodeId = wp.getEpisode() != null ? wp.getEpisode().getId() : null;

        return Objects.equals(curSeasonId, lastSeasonId) && Objects.equals(curEpisodeId, lastEpisodeId);
    }

    private boolean isShowFinished(TVShowEntity show) {
        String s = show.getStatus();
        if (s == null) return false;
        s = s.trim().toLowerCase();
        return s.equals("finished") || s.equals("ended") || s.equals("complete") || s.equals("canceled");
    }

    private WatchlistCardDto toDto(Row r) {
        WatchlistCardDto dto = new WatchlistCardDto();
        dto.tvShowId = r.show.getId();
        dto.name = r.show.getName();
        dto.poster = r.show.getPoster();
        dto.banner = r.show.getBanner();
        dto.status = r.show.getStatus();

        if (r.progress != null) {
            WatchlistCardDto.ProgressDto p = new WatchlistCardDto.ProgressDto();
            if (r.progress.getSeason() != null) {
                p.seasonId = r.progress.getSeason().getId();
                p.seasonName = r.progress.getSeason().getName();
            }
            if (r.progress.getEpisode() != null) {
                p.episodeId = r.progress.getEpisode().getId();
                p.episodeName = r.progress.getEpisode().getName();
            }
            dto.progress = p;
        }
        return dto;
    }

    private static class Row {
        TVShowEntity show;
        WatchProgressEntity progress;
        Row(TVShowEntity show, WatchProgressEntity progress) {
            this.show = show;
            this.progress = progress;
        }
    }
}
