package com.stanco.controller;

import com.stanco.dto.request.CandidatePreonboardingRequest;
import com.stanco.dto.response.CandidatePreonboardingResponse;

import com.stanco.service.CandidatePreonboardingService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate-preonboarding")
@RequiredArgsConstructor
public class CandidatePreonboardingController {

    private final CandidatePreonboardingService service;


    @PostMapping
    public ResponseEntity<CandidatePreonboardingResponse>
    create(

            @Valid
            @RequestBody
            CandidatePreonboardingRequest request) {

        return ResponseEntity.ok(
                service.create(request)
        );
    }



    @GetMapping
    public ResponseEntity<
            List<CandidatePreonboardingResponse>>
    getAll() {

        return ResponseEntity.ok(
                service.getAll()
        );
    }



    @GetMapping("/{id}")
    public ResponseEntity<CandidatePreonboardingResponse>
    getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getById(id)
        );
    }


    @GetMapping("/employee/{empId}")
    public ResponseEntity<
            List<CandidatePreonboardingResponse>>
    getByEmpId(
            @PathVariable String empId) {

        return ResponseEntity.ok(
                service.getByEmpId(empId)
        );
    }



    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<
            List<CandidatePreonboardingResponse>>
    getByRecruiterId(
            @PathVariable String recruiterId) {

        return ResponseEntity.ok(
                service.getByRecruiterId(
                        recruiterId
                )
        );
    }


    @GetMapping("/process/{process}")
    public ResponseEntity<
            List<CandidatePreonboardingResponse>>
    getByProcess(
            @PathVariable String process) {

        return ResponseEntity.ok(
                service.getByPreonboardingProcess(
                        process
                )
        );
    }


    @GetMapping("/type/{type}")
    public ResponseEntity<
            List<CandidatePreonboardingResponse>>
    getByType(
            @PathVariable Integer type) {

        return ResponseEntity.ok(
                service.getByType(type)
        );
    }



    @PutMapping("/{id}")
    public ResponseEntity<CandidatePreonboardingResponse>
    update(

            @PathVariable Long id,

            @Valid
            @RequestBody
            CandidatePreonboardingRequest request) {

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
                "Pre-onboarding record deleted successfully"
        );
    }
}