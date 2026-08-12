package com.stanco.controller;

import com.stanco.dto.request.RecruitmentRequestRequest;
import com.stanco.dto.response.RecruitmentRequestResponse;

import com.stanco.service.RecruitmentRequestService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruitment-requests")
@RequiredArgsConstructor
public class RecruitmentRequestController {

    private final RecruitmentRequestService service;

    @PostMapping
    public ResponseEntity<RecruitmentRequestResponse> create(
            @RequestBody RecruitmentRequestRequest request) {

        return ResponseEntity.ok(
                service.create(request));
    }

    @GetMapping
    public ResponseEntity<List<RecruitmentRequestResponse>> getAll() {

        return ResponseEntity.ok(
                service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecruitmentRequestResponse> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getById(id));
    }

    @GetMapping("/request/{recReqID}")
    public ResponseEntity<RecruitmentRequestResponse> getByRecReqID(
            @PathVariable String recReqID) {

        return ResponseEntity.ok(
                service.getByRecReqID(recReqID));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecruitmentRequestResponse> update(
            @PathVariable Long id,
            @RequestBody RecruitmentRequestRequest request) {

        return ResponseEntity.ok(
                service.update(
                        id,
                        request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.ok(
                "Recruitment request deleted successfully");
    }
}