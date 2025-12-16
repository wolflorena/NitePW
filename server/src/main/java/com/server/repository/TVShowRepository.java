package com.server.repository;

import com.server.model.TVShowEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.time.LocalDate;


public interface TVShowRepository extends JpaRepository<TVShowEntity, Long> {
    @Query("""
        SELECT tv
        FROM TVShowEntity tv
        WHERE tv.id NOT IN (
            SELECT wp.tvShow.id
            FROM WatchProgressEntity wp
            WHERE wp.user.id = :userId
        )
    """)
    List<TVShowEntity> findAllNotStartedByUser(@Param("userId") Long userId);

    List<TVShowEntity> findByNewSeasonAfter(LocalDate date);
    List<TVShowEntity> findAllByIdIn(List<Long> ids);
}
