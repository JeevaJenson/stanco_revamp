package com.stanco.dto.response;

import com.stanco.enums.Status;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class DepartmentResponse {

    private Long id;

    private String depId;

    private String name;

    private Status status;

    private String createdBy;

    private String updatedBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;
}