package com.server.repository;

import com.server.model.UserEntity;
import com.server.model.WatchProgressEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface UserRepository extends JpaRepository<UserEntity, Long> {

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByEmail(String email);
    @EntityGraph(attributePaths = {"favorites"})
    Optional<UserEntity> findWithFavoritesById(Long id);

    @EntityGraph(attributePaths = {"watchlist"})
    Optional<UserEntity> findWithWatchlistById(Long id);
    @Query("""
        SELECT COUNT(u) > 0
        FROM UserEntity u
        JOIN u.favorites f
        WHERE u.id = :userId AND f.id = :tvShowId
    """)
    boolean isFavorite(Long userId, Long tvShowId);

    @Query("""
        SELECT COUNT(u) > 0
        FROM UserEntity u
        JOIN u.watchlist w
        WHERE u.id = :userId AND w.id = :tvShowId
    """)
    boolean isInWatchlist(Long userId, Long tvShowId);
    @Query("""
    select u
    from UserEntity u
    left join fetch u.watchlist
    where u.id = :userId
""")
    Optional<UserEntity> findByIdWithWatchlist(@Param("userId") Long userId);

}
