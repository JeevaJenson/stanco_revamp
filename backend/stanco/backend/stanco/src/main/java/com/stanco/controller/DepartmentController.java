package com.stanco.controller;

import com.stanco.dto.request.DepartmentRequest;
import com.stanco.dto.response.DepartmentResponse;
import com.stanco.service.DepartmentService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService service;

    @PostMapping
    public ResponseEntity<DepartmentResponse> create(
            @RequestBody DepartmentRequest request) {

        return ResponseEntity.ok(
                service.create(request));
    }

    @GetMapping
    public ResponseEntity<List<DepartmentResponse>> getAll() {

        return ResponseEntity.ok(
                service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentResponse> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getById(id));
    }

    @GetMapping("/dep/{depId}")
    public ResponseEntity<DepartmentResponse> getByDepId(
            @PathVariable String depId) {

        return ResponseEntity.ok(
                service.getByDepId(depId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentResponse> update(
            @PathVariable Long id,
            @RequestBody DepartmentRequest request) {

        return ResponseEntity.ok(
                service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.ok(
                "Department deleted successfully");
    }
}