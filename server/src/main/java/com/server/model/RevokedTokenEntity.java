package com.server.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "revoked_tokens")
public class RevokedTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 512)
    private String token;

    @Column(nullable = false)
    private Instant revokedAt = Instant.now();

    public RevokedTokenEntity() {}

    public RevokedTokenEntity(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}
