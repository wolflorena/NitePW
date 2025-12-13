package com.server.repository;

import com.server.model.RevokedTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RevokedTokenRepository extends JpaRepository<RevokedTokenEntity, Long> {

    boolean existsByToken(String token);
}
