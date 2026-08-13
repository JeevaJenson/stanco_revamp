package com.stanco.service;

import com.stanco.dto.request.AttendanceFormatRequest;
import com.stanco.dto.response.AttendanceFormatResponse;

import java.util.List;

public interface AttendanceFormatService {

    AttendanceFormatResponse create(
            AttendanceFormatRequest request
    );

    List<AttendanceFormatResponse> getAll();

    AttendanceFormatResponse getById(
            Long id
    );

    AttendanceFormatResponse getByName(
            String attendanceFormat
    );

    AttendanceFormatResponse update(
            Long id,
            AttendanceFormatRequest request
    );

    void delete(
            Long id
    );
}