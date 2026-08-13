package com.stanco.repository;

import com.stanco.entity.Designation;

import com.stanco.enums.Status;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DesignationRepository
        extends JpaRepository<Designation, Long> {

    Optional<Designation> findByDesId(
            String desId
    );


    boolean existsByDesId(
            String desId
    );


    List<Designation> findByStatus(
            Status status
    );
}