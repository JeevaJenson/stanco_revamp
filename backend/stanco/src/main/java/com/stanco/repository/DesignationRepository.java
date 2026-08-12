package com.stanco.repository;

import com.stanco.entity.Designation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DesignationRepository
        extends JpaRepository<Designation, Long> {

    Optional<Designation> findByDesId(
            String desId
    );

    boolean existsByDesId(
            String desId
    );
}