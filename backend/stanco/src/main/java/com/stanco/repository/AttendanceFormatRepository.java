package com.stanco.repository;

import com.stanco.entity.AttendanceFormat;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AttendanceFormatRepository
        extends JpaRepository<AttendanceFormat, Long> {

    boolean existsByAttendanceFormat(
            String attendanceFormat
    );

    Optional<AttendanceFormat> findByAttendanceFormat(
            String attendanceFormat
    );
}