package com.stanco.repository;

import com.stanco.entity.Vertical;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerticalRepository
        extends JpaRepository<Vertical, Long> {

    boolean existsByVerticalName(
            String verticalName
    );

    Optional<Vertical> findByVerticalName(
            String verticalName
    );
}