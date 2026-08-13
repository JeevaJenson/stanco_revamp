package com.stanco.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class AttendanceFormatRequest {

    @NotBlank(message = "Attendance format is required")
    private String attendanceFormat;
}