package com.stanco.dto.request;

import lombok.Data;

@Data
public class AuditLogRequest {

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
}