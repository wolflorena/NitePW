package com.server.repository;

import com.server.model.WatchProgressEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WatchProgressRepository extends JpaRepository<WatchProgressEntity, Long> {

    Optional<WatchProgressEntity> findByUserIdAndTvShowId(Long userId, Long tvShowId);

    List<WatchProgressEntity> findByUserId(Long userId);

    List<WatchProgressEntity> findByTvShowId(Long tvShowId);
    @Query("""
        SELECT wp
        FROM WatchProgressEntity wp
        WHERE wp.user.id = :userId
    """)
    List<WatchProgressEntity> findAllByUserId(Long userId);
    boolean existsByUser_IdAndEpisode_Id(Long userId, Long episodeId);

    Optional<WatchProgressEntity> findByUser_IdAndEpisode_Id(Long userId, Long episodeId);

    List<WatchProgressEntity> findAllByUser_Id(Long userId);
    Optional<WatchProgressEntity> findByUser_IdAndTvShow_Id(Long userId, Long tvShowId);
    @Query("""
    select wp
    from WatchProgressEntity wp
    join fetch wp.episode e
    join fetch wp.season s
    join fetch wp.tvShow t
    where wp.user.id = :userId
""")
    List<WatchProgressEntity> findAllByUserIdWithDetails(@Param("userId") Long userId);
}
