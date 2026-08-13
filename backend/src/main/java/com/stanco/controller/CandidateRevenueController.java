package com.stanco.controller;

import com.stanco.dto.request.CandidateRevenueRequest;
import com.stanco.dto.response.CandidateRevenueResponse;

import com.stanco.service.CandidateRevenueService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate-revenue")
@RequiredArgsConstructor
public class CandidateRevenueController {

    private final CandidateRevenueService service;


    @PostMapping
    public ResponseEntity<CandidateRevenueResponse>
    create(

            @Valid
            @RequestBody
            CandidateRevenueRequest request,

            Authentication authentication) {

        String empID =
                authentication.getName();

        return ResponseEntity.ok(
                service.create(
                        request,
                        empID
                )
        );
    }


    @GetMapping
    public ResponseEntity<
            List<CandidateRevenueResponse>>
    getAll() {

        return ResponseEntity.ok(
                service.getAll()
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<CandidateRevenueResponse>
    getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getById(id)
        );
    }


    @GetMapping("/candidate/{candidateId}/rfh/{rfhNo}")
    public ResponseEntity<CandidateRevenueResponse>
    getByCandidateAndRfh(

            @PathVariable String candidateId,

            @PathVariable String rfhNo) {

        return ResponseEntity.ok(
                service.getByCandidateAndRfh(
                        candidateId,
                        rfhNo
                )
        );
    }


    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<
            List<CandidateRevenueResponse>>
    getByCandidate(
            @PathVariable String candidateId) {

        return ResponseEntity.ok(
                service.getByCandidate(
                        candidateId
                )
        );
    }


    @GetMapping("/rfh/{rfhNo}")
    public ResponseEntity<
            List<CandidateRevenueResponse>>
    getByRfh(
            @PathVariable String rfhNo) {

        return ResponseEntity.ok(
                service.getByRfh(rfhNo)
        );
    }


    @GetMapping("/type/{revenueType}")
    public ResponseEntity<
            List<CandidateRevenueResponse>>
    getByRevenueType(
            @PathVariable String revenueType) {

        return ResponseEntity.ok(
                service.getByRevenueType(
                        revenueType
                )
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<CandidateRevenueResponse>
    update(

            @PathVariable Long id,

            @Valid
            @RequestBody
            CandidateRevenueRequest request) {

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
                "Candidate revenue deleted successfully"
        );
    }
}