package com.stanco.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AuditLogResponse {

    private Long id;

    private Long userId;

    private String empId;

    private String userName;

    private String roleType;

    private String action;

    private String module;

    private String recordId;

    private String description;

    private String oldValues;

    private String newValues;

    private String ipAddress;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}