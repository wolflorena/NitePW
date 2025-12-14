package com.server.repository;

import com.server.model.TVShowEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TVShowRepository extends JpaRepository<TVShowEntity, Long> {
}
