package com.stanco.repository;

import com.stanco.entity.CollegeDetails;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CollegeRepository
        extends JpaRepository<CollegeDetails, Integer> {

    Optional<CollegeDetails> findByCldID(
            String cldID
    );

    List<CollegeDetails> findByCollegeNameContainingIgnoreCase(
            String collegeName
    );

    boolean existsByCldID(
            String cldID
    );
}