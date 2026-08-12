package com.stanco.service;

import com.stanco.dto.request.AuditLogRequest;
import com.stanco.dto.response.AuditLogResponse;

import java.util.List;

public interface AuditLogService {


    AuditLogResponse create(
            AuditLogRequest request
    );


    List<AuditLogResponse> getAll();


    AuditLogResponse getById(
            Long id
    );


    List<AuditLogResponse> getByEmpId(
            String empId
    );


    List<AuditLogResponse> getByAction(
            String action
    );


    List<AuditLogResponse> getByModule(
            String module
    );


    List<AuditLogResponse> getByUserId(
            Long userId
    );


    List<AuditLogResponse> getByRecordId(
            String recordId
    );


    AuditLogResponse update(
            Long id,
            AuditLogRequest request
    );


    void delete(
            Long id
    );
}