package com.server.repository;

import com.server.model.SeasonEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeasonRepository extends JpaRepository<SeasonEntity, Long> {

    // get all seasons for a tv show
    List<SeasonEntity> findByTvShow_Id(Long tvShowId);

    // when returning a season, load tvShow (and optionally episodes) to avoid LazyInitializationException
    @EntityGraph(attributePaths = {"tvShow"})
    Optional<SeasonEntity> findWithTvShowById(Long id);

    @EntityGraph(attributePaths = {"tvShow"})
    List<SeasonEntity> findAll();
}
