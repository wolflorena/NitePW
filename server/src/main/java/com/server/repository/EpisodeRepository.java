package com.server.repository;

import com.server.model.EpisodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EpisodeRepository extends JpaRepository<EpisodeEntity, Long> {
    List<EpisodeEntity> findByTvShowIdOrderByIdAsc(Long tvShowId);
    List<EpisodeEntity> findBySeasonIdOrderByIdAsc(Long seasonId);
    boolean existsByIdAndTvShowId(Long id, Long tvShowId);
}
