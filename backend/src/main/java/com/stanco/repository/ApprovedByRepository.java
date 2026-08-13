package com.stanco.repository;

import com.stanco.entity.ApprovedBy;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApprovedByRepository
        extends JpaRepository<ApprovedBy, Long> {

    Optional<ApprovedBy> findByEmpId(
            String empId
    );

    List<ApprovedBy> findByVertical(
            String vertical
    );

    List<ApprovedBy> findByStatus(
            String status
    );

    boolean existsByEmpId(
            String empId
    );
}