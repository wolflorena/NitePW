package com.server.repository;

import com.server.model.WatchProgressEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WatchProgressRepository extends JpaRepository<WatchProgressEntity, Long> {

    Optional<WatchProgressEntity> findByUserIdAndTvShowId(Long userId, Long tvShowId);

    List<WatchProgressEntity> findByUserId(Long userId);

    List<WatchProgressEntity> findByTvShowId(Long tvShowId);
}
