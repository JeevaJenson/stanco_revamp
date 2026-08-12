package com.stanco.serviceimpl;

import com.stanco.dto.request.AttendanceFormatRequest;
import com.stanco.dto.response.AttendanceFormatResponse;

import com.stanco.entity.AttendanceFormat;

import com.stanco.repository.AttendanceFormatRepository;

import com.stanco.service.AttendanceFormatService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceFormatServiceImpl
        implements AttendanceFormatService {

    private final AttendanceFormatRepository repository;

    @Override
    public AttendanceFormatResponse create(
            AttendanceFormatRequest request) {

        if (repository.existsByAttendanceFormat(
                request.getAttendanceFormat())) {

            throw new RuntimeException(
                    "Attendance format already exists: "
                            + request.getAttendanceFormat());
        }

        AttendanceFormat format = new AttendanceFormat();

        format.setAttendanceFormat(
                request.getAttendanceFormat());

        format.setCreatedAt(
                LocalDateTime.now());

        format.setUpdatedAt(
                LocalDateTime.now());

        AttendanceFormat saved = repository.save(format);

        return mapToResponse(saved);
    }

    @Override
    public List<AttendanceFormatResponse> getAll() {

        return repository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AttendanceFormatResponse getById(
            Long id) {

        AttendanceFormat format = repository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Attendance format not found: "
                                + id));

        return mapToResponse(format);
    }

    @Override
    public AttendanceFormatResponse getByName(
            String attendanceFormat) {

        AttendanceFormat format = repository
                .findByAttendanceFormat(
                        attendanceFormat)
                .orElseThrow(() -> new RuntimeException(
                        "Attendance format not found: "
                                + attendanceFormat));

        return mapToResponse(format);
    }

    @Override
    public AttendanceFormatResponse update(
            Long id,
            AttendanceFormatRequest request) {

        AttendanceFormat format = repository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Attendance format not found: "
                                + id));

        if (!format.getAttendanceFormat()
                .equals(request.getAttendanceFormat())
                &&
                repository.existsByAttendanceFormat(
                        request.getAttendanceFormat())) {

            throw new RuntimeException(
                    "Attendance format already exists: "
                            + request.getAttendanceFormat());
        }

        format.setAttendanceFormat(
                request.getAttendanceFormat());

        format.setUpdatedAt(
                LocalDateTime.now());

        AttendanceFormat updated = repository.save(format);

        return mapToResponse(updated);
    }

    @Override
    public void delete(Long id) {

        AttendanceFormat format = repository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Attendance format not found: "
                                + id));

        repository.delete(format);
    }

    private AttendanceFormatResponse mapToResponse(
            AttendanceFormat format) {

        return new AttendanceFormatResponse(

                format.getId(),

                format.getAttendanceFormat(),

                format.getCreatedAt(),

                format.getUpdatedAt());
    }
}