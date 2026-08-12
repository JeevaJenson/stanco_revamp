package com.stanco.repository;

import com.stanco.entity.AuditLog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository
        extends JpaRepository<AuditLog, Long> {


    List<AuditLog> findByEmpId(
            String empId
    );


    List<AuditLog> findByAction(
            String action
    );


    List<AuditLog> findByModule(
            String module
    );


    List<AuditLog> findByRoleType(
            String roleType
    );


    List<AuditLog> findByUserId(
            Long userId
    );


    List<AuditLog> findByRecordId(
            String recordId
    );
}