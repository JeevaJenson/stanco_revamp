package com.stanco.repository;

import com.stanco.entity.Rfh;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import java.util.Optional;

public interface RfhRepository
        extends JpaRepository<Rfh, Long> {

    Optional<Rfh> findByResId(
            String resId
    );

    List<Rfh> findByDeleteStatus(
            Integer deleteStatus
    );

    List<Rfh> findByRequestBy(
            String requestBy
    );

    boolean existsByResId(
            String resId
    );
}