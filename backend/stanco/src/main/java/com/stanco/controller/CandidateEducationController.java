package com.stanco.controller;

import com.stanco.dto.request.CandidateEducationRequest;
import com.stanco.dto.response.CandidateEducationResponse;

import com.stanco.service.CandidateEducationService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate-education")
@RequiredArgsConstructor
public class CandidateEducationController {

    private final CandidateEducationService service;

    @PostMapping
    public ResponseEntity<CandidateEducationResponse> create(

            @Valid @RequestBody CandidateEducationRequest request) {

        return ResponseEntity.ok(
                service.create(request));
    }

    @GetMapping
    public ResponseEntity<List<CandidateEducationResponse>> getAll() {

        return ResponseEntity.ok(
                service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CandidateEducationResponse> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getById(id));
    }

    @GetMapping("/candidate/{cdID}")
    public ResponseEntity<List<CandidateEducationResponse>> getByCdID(
            @PathVariable String cdID) {

        return ResponseEntity.ok(
                service.getByCdID(cdID));
    }

    @GetMapping("/rfh/{rfhNo}")
    public ResponseEntity<List<CandidateEducationResponse>> getByRfhNo(
            @PathVariable String rfhNo) {

        return ResponseEntity.ok(
                service.getByRfhNo(rfhNo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CandidateEducationResponse> update(

            @PathVariable Long id,

            @Valid @RequestBody CandidateEducationRequest request) {

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
                "Candidate education deleted successfully");
    }
}