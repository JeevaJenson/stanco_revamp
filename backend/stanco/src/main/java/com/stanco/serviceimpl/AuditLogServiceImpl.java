package com.stanco.serviceimpl;

import com.stanco.dto.request.AuditLogRequest;
import com.stanco.dto.response.AuditLogResponse;

import com.stanco.entity.AuditLog;

import com.stanco.repository.AuditLogRepository;

import com.stanco.service.AuditLogService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl
        implements AuditLogService {

    private final AuditLogRepository repository;

    @Override
    public AuditLogResponse create(
            AuditLogRequest request) {

        AuditLog auditLog = new AuditLog();

        auditLog.setUserId(
                request.getUserId());

        auditLog.setEmpId(
                request.getEmpId());

        auditLog.setUserName(
                request.getUserName());

        auditLog.setRoleType(
                request.getRoleType());

        auditLog.setAction(
                request.getAction());

        auditLog.setModule(
                request.getModule());

        auditLog.setRecordId(
                request.getRecordId());

        auditLog.setDescription(
                request.getDescription());

        auditLog.setOldValues(
                request.getOldValues());

        auditLog.setNewValues(
                request.getNewValues());

        auditLog.setIpAddress(
                request.getIpAddress());

        auditLog.setCreatedAt(
                LocalDateTime.now());

        auditLog.setUpdatedAt(
                LocalDateTime.now());

        AuditLog saved = repository.save(
                auditLog);

        return mapToResponse(
                saved);
    }

    @Override
    public List<AuditLogResponse> getAll() {

        return repository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AuditLogResponse getById(
            Long id) {

        AuditLog auditLog = repository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Audit log not found: "
                                + id));

        return mapToResponse(
                auditLog);
    }

    @Override
    public List<AuditLogResponse> getByEmpId(
            String empId) {

        return repository
                .findByEmpId(empId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<AuditLogResponse> getByAction(
            String action) {

        return repository
                .findByAction(action)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<AuditLogResponse> getByModule(
            String module) {

        return repository
                .findByModule(module)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<AuditLogResponse> getByUserId(
            Long userId) {

        return repository
                .findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<AuditLogResponse> getByRecordId(
            String recordId) {

        return repository
                .findByRecordId(recordId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AuditLogResponse update(
            Long id,
            AuditLogRequest request) {

        AuditLog auditLog = repository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Audit log not found: "
                                + id));

        auditLog.setUserId(
                request.getUserId());

        auditLog.setEmpId(
                request.getEmpId());

        auditLog.setUserName(
                request.getUserName());

        auditLog.setRoleType(
                request.getRoleType());

        auditLog.setAction(
                request.getAction());

        auditLog.setModule(
                request.getModule());

        auditLog.setRecordId(
                request.getRecordId());

        auditLog.setDescription(
                request.getDescription());

        auditLog.setOldValues(
                request.getOldValues());

        auditLog.setNewValues(
                request.getNewValues());

        auditLog.setIpAddress(
                request.getIpAddress());

        auditLog.setUpdatedAt(
                LocalDateTime.now());

        AuditLog updated = repository.save(
                auditLog);

        return mapToResponse(
                updated);
    }

    @Override
    public void delete(
            Long id) {

        AuditLog auditLog = repository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Audit log not found: "
                                + id));

        repository.delete(
                auditLog);
    }

    private AuditLogResponse mapToResponse(
            AuditLog auditLog) {

        return new AuditLogResponse(

                auditLog.getId(),

                auditLog.getUserId(),

                auditLog.getEmpId(),

                auditLog.getUserName(),

                auditLog.getRoleType(),

                auditLog.getAction(),

                auditLog.getModule(),

                auditLog.getRecordId(),

                auditLog.getDescription(),

                auditLog.getOldValues(),

                auditLog.getNewValues(),

                auditLog.getIpAddress(),

                auditLog.getCreatedAt(),

                auditLog.getUpdatedAt());
    }
}