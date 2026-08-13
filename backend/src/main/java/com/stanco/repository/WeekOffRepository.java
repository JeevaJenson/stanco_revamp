package com.stanco.repository;

import com.stanco.entity.WeekOff;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WeekOffRepository
        extends JpaRepository<WeekOff, Long> {

    boolean existsByWeekOff(
            String weekOff
    );

    Optional<WeekOff> findByWeekOff(
            String weekOff
    );
}