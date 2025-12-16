package com.server.repository;

import com.server.model.EpisodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface EpisodeRepository extends JpaRepository<EpisodeEntity, Long> {
    List<EpisodeEntity> findByTvShowIdOrderByIdAsc(Long tvShowId);
    List<EpisodeEntity> findBySeasonIdOrderByIdAsc(Long seasonId);
    boolean existsByIdAndTvShowId(Long id, Long tvShowId);
    @Query("select max(e.id) from EpisodeEntity e where e.season.id = :seasonId")
    Long findLastEpisodeId(@Param("seasonId") Long seasonId);
}
