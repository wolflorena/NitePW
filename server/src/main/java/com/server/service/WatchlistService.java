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
    private final TVShowRepository tvShowRepository;

    public WatchlistService(
            UserRepository userRepo,
            WatchProgressRepository progressRepo,
            SeasonRepository seasonRepo,
            EpisodeRepository episodeRepo,
            TVShowRepository tvShowRepository
    ) {
        this.userRepo = userRepo;
        this.progressRepo = progressRepo;
        this.seasonRepo = seasonRepo;
        this.episodeRepo = episodeRepo;
        this.tvShowRepository = tvShowRepository;
    }


    public Page<WatchlistCardDto> getUpToDate(Long userId, Pageable pageable) {
        UserEntity user = userRepo.findByIdWithWatchlist(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        List<TVShowEntity> watchlistShows = new ArrayList<>(user.getWatchlist());
        if (watchlistShows.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, 0);
        }

        List<WatchProgressEntity> progress = progressRepo.findByUserId(userId);

        Map<Long, Long> watchedCountByShow = new HashMap<>();
        for (WatchProgressEntity wp : progress) {
            Long showId = wp.getTvShow().getId();
            watchedCountByShow.put(showId, watchedCountByShow.getOrDefault(showId, 0L) + 1L);
        }

        List<WatchlistCardDto> upToDate = watchlistShows.stream()
                .filter(show -> !isShowFinished(show)) // ongoing
                .filter(show -> {
                    long watched = watchedCountByShow.getOrDefault(show.getId(), 0L);
                    long total = episodeRepo.countByTvShow_Id(show.getId());
                    return total > 0 && watched == total;
                })
                .map(show -> new WatchlistCardDto(
                        show.getId(),
                        show.getName(),
                        show.getPoster(),
                        show.getBanner(),
                        show.getStatus(),
                        100
                ))
                .sorted(Comparator.comparing(WatchlistCardDto::getName, String.CASE_INSENSITIVE_ORDER))
                .toList();

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), upToDate.size());
        List<WatchlistCardDto> slice = start >= end ? List.of() : upToDate.subList(start, end);

        return new PageImpl<>(slice, pageable, upToDate.size());
    }

    public Page<WatchlistCardDto> getFinished(Long userId, Pageable pageable) {
        UserEntity user = userRepo.findByIdWithWatchlist(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        List<TVShowEntity> watchlistShows = new ArrayList<>(user.getWatchlist());
        if (watchlistShows.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, 0);
        }

        List<WatchProgressEntity> progress = progressRepo.findByUserId(userId);

        Map<Long, Long> watchedCountByShow = new HashMap<>();
        for (WatchProgressEntity wp : progress) {
            Long showId = wp.getTvShow().getId();
            watchedCountByShow.put(showId, watchedCountByShow.getOrDefault(showId, 0L) + 1L);
        }

        List<WatchlistCardDto> finished = watchlistShows.stream()
                .filter(this::isShowFinished)
                .filter(show -> {
                    long watched = watchedCountByShow.getOrDefault(show.getId(), 0L);
                    long total = episodeRepo.countByTvShow_Id(show.getId());
                    return total > 0 && watched == total;
                })
                .map(show -> new WatchlistCardDto(
                        show.getId(),
                        show.getName(),
                        show.getPoster(),
                        show.getBanner(),
                        show.getStatus(),
                        100
                ))
                .sorted(Comparator.comparing(WatchlistCardDto::getName, String.CASE_INSENSITIVE_ORDER))
                .toList();

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), finished.size());
        List<WatchlistCardDto> slice = start >= end ? List.of() : finished.subList(start, end);

        return new PageImpl<>(slice, pageable, finished.size());
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

    public Page<WatchlistCardDto> getCurrentlyWatching(Long userId, Pageable pageable) {

        List<WatchProgressEntity> progress = progressRepo.findByUserId(userId);

        Map<Long, Long> watchedCountByShow = new HashMap<>();
        for (WatchProgressEntity wp : progress) {
            Long showId = wp.getTvShow().getId();
            watchedCountByShow.put(showId, watchedCountByShow.getOrDefault(showId, 0L) + 1L);
        }

        List<Long> currentShowIds = new ArrayList<>();
        Map<Long, Integer> percentByShow = new HashMap<>();

        for (Map.Entry<Long, Long> entry : watchedCountByShow.entrySet()) {
            Long showId = entry.getKey();
            long watched = entry.getValue();

            long total = episodeRepo.countByTvShow_Id(showId);
            if (total <= 0) continue;

            if (watched >= 1 && watched < total) {
                currentShowIds.add(showId);

                int percent = (int) Math.ceil((watched * 100.0) / total);
                percentByShow.put(showId, percent);
            }
        }

        currentShowIds.sort((a, b) -> percentByShow.get(b) - percentByShow.get(a));

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), currentShowIds.size());
        List<Long> pageIds = (start >= end) ? List.of() : currentShowIds.subList(start, end);

        List<TVShowEntity> shows = pageIds.isEmpty() ? List.of() : tvShowRepository.findAllByIdIn(pageIds);

        Map<Long, TVShowEntity> byId = shows.stream().collect(Collectors.toMap(TVShowEntity::getId, s -> s));
        List<WatchlistCardDto> content = pageIds.stream()
                .map(id -> {
                    TVShowEntity s = byId.get(id);
                    if (s == null) return null;
                    WatchlistCardDto dto = new WatchlistCardDto();
                    dto.setTvShowId(s.getId());
                    dto.setName(s.getName());
                    dto.setPoster(s.getPoster());
                    dto.setProgressPercent(percentByShow.getOrDefault(s.getId(), 0));
                    return dto;
                })
                .filter(Objects::nonNull)
                .toList();

        return new PageImpl<>(content, pageable, currentShowIds.size());
    }

    public Page<WatchlistCardDto> getNotStarted(Long userId, Pageable pageable) {
        UserEntity user = userRepo.findByIdWithWatchlist(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<TVShowEntity> watchlistShows = new ArrayList<>(user.getWatchlist());

        if (watchlistShows.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, 0);
        }

        List<WatchProgressEntity> progress = progressRepo.findByUserId(userId);

        Set<Long> startedShowIds = progress.stream()
                .map(p -> p.getTvShow().getId())
                .collect(Collectors.toSet());

        List<WatchlistCardDto> notStarted = watchlistShows.stream()
                .filter(show -> !startedShowIds.contains(show.getId()))

                .map(show -> new WatchlistCardDto(
                        show.getId(),
                        show.getName(),
                        show.getPoster(),
                        show.getBanner(),
                        show.getStatus(),
                        0
                ))
                .toList();

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), notStarted.size());
        List<WatchlistCardDto> slice = start >= end ? List.of() : notStarted.subList(start, end);

        return new PageImpl<>(slice, pageable, notStarted.size());
    }
}
