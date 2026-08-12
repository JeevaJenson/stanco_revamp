package com.stanco.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AttendanceFormatResponse {

    private Long id;

    private String attendanceFormat;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}