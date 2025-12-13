package com.server.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String username;

    @Column(nullable = false, unique = true, length = 256)
    private String email;

    @Column(nullable = false, length = 255)
    private String passwordHash;

    @Column(length = 32)
    private String gender;

    // store as text if you want; better is LocalDate (shown below)
    // private String birthdate;
    private java.time.LocalDate birthdate;

    @Column(nullable = false)
    private boolean isAdmin = false;

    @ManyToMany
    @JoinTable(
            name = "favorites",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "tv_show_id")
    )
    private Set<TVShowEntity> favorites = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "watchlist",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "tv_show_id")
    )
    private Set<TVShowEntity> watchlist = new HashSet<>();

    // getters/setters
    public Long getId() { return id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public java.time.LocalDate getBirthdate() { return birthdate; }
    public void setBirthdate(java.time.LocalDate birthdate) { this.birthdate = birthdate; }

    public boolean isAdmin() { return isAdmin; }
    public void setAdmin(boolean admin) { isAdmin = admin; }

    public Set<TVShowEntity> getFavorites() { return favorites; }
    public Set<TVShowEntity> getWatchlist() { return watchlist; }
}
