package com.stanco.controller;

import com.stanco.dto.request.CandidateFollowupRequest;
import com.stanco.dto.response.CandidateFollowupResponse;

import com.stanco.service.CandidateFollowupService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate-followup")
@RequiredArgsConstructor
public class CandidateFollowupController {

    private final CandidateFollowupService service;

    @PostMapping
    public ResponseEntity<CandidateFollowupResponse> create(

            @Valid @RequestBody CandidateFollowupRequest request,

            Authentication authentication) {

        String empID = authentication.getName();

        return ResponseEntity.ok(
                service.create(
                        request,
                        empID));
    }

    @GetMapping
    public ResponseEntity<List<CandidateFollowupResponse>> getAll() {

        return ResponseEntity.ok(
                service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CandidateFollowupResponse> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getById(id));
    }

    @GetMapping("/cfd/{cfdID}")
    public ResponseEntity<CandidateFollowupResponse> getByCfdID(
            @PathVariable String cfdID) {

        return ResponseEntity.ok(
                service.getByCfdID(cfdID));
    }

    @GetMapping("/candidate/{cdID}")
    public ResponseEntity<List<CandidateFollowupResponse>> getByCdID(
            @PathVariable String cdID) {

        return ResponseEntity.ok(
                service.getByCdID(cdID));
    }

    @GetMapping("/rfh/{rfhNo}")
    public ResponseEntity<List<CandidateFollowupResponse>> getByRfhNo(
            @PathVariable String rfhNo) {

        return ResponseEntity.ok(
                service.getByRfhNo(rfhNo));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CandidateFollowupResponse>> getByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                service.getByStatus(status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CandidateFollowupResponse> update(

            @PathVariable Long id,

            @Valid @RequestBody CandidateFollowupRequest request) {

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
                "Candidate followup deleted successfully");
    }
}