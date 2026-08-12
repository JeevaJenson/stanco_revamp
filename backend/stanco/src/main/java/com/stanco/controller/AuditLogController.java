package com.stanco.controller;

import com.stanco.dto.request.AuditLogRequest;
import com.stanco.dto.response.AuditLogResponse;

import com.stanco.service.AuditLogService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {


    private final AuditLogService service;

    @PostMapping
    public ResponseEntity<AuditLogResponse> create(

            @Valid
            @RequestBody
            AuditLogRequest request) {


        return ResponseEntity.ok(
                service.create(request)
        );
    }

    @GetMapping
    public ResponseEntity<
            List<AuditLogResponse>>
    getAll() {


        return ResponseEntity.ok(
                service.getAll()
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<AuditLogResponse>
    getById(
            @PathVariable Long id) {


        return ResponseEntity.ok(
                service.getById(id)
        );
    }

    @GetMapping("/emp/{empId}")
    public ResponseEntity<
            List<AuditLogResponse>>
    getByEmpId(
            @PathVariable String empId) {


        return ResponseEntity.ok(
                service.getByEmpId(empId)
        );
    }


    @GetMapping("/action/{action}")
    public ResponseEntity<
            List<AuditLogResponse>>
    getByAction(
            @PathVariable String action) {


        return ResponseEntity.ok(
                service.getByAction(action)
        );
    }


    @GetMapping("/module/{module}")
    public ResponseEntity<
            List<AuditLogResponse>>
    getByModule(
            @PathVariable String module) {


        return ResponseEntity.ok(
                service.getByModule(module)
        );
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<
            List<AuditLogResponse>>
    getByUserId(
            @PathVariable Long userId) {


        return ResponseEntity.ok(
                service.getByUserId(userId)
        );
    }



    @GetMapping("/record/{recordId}")
    public ResponseEntity<
            List<AuditLogResponse>>
    getByRecordId(
            @PathVariable String recordId) {


        return ResponseEntity.ok(
                service.getByRecordId(recordId)
        );
    }




    @PutMapping("/{id}")
    public ResponseEntity<AuditLogResponse>
    update(

            @PathVariable Long id,

            @Valid
            @RequestBody
            AuditLogRequest request) {


        return ResponseEntity.ok(
                service.update(
                        id,
                        request
                )
        );
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    delete(
            @PathVariable Long id) {


        service.delete(id);


        return ResponseEntity.ok(
                "Audit log deleted successfully"
        );
    }
}