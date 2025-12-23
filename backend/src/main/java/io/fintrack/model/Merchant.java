package io.fintrack.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "merchant")
public class Merchant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // BIGSERIAL
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String name;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public Merchant() {
        // required by JPA
    }

    public Merchant(String name) {
        this.name = name;
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
