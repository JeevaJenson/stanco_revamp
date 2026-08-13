package com.stanco.controller;

import com.stanco.dto.request.CandidateExperienceRequest;
import com.stanco.dto.response.CandidateExperienceResponse;

import com.stanco.service.CandidateExperienceService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate-experience")
@RequiredArgsConstructor
public class CandidateExperienceController {

    private final CandidateExperienceService service;


    @PostMapping
    public ResponseEntity<CandidateExperienceResponse>
    create(

            @Valid
            @RequestBody
            CandidateExperienceRequest request) {

        return ResponseEntity.ok(
                service.create(request)
        );
    }




    @GetMapping
    public ResponseEntity<
            List<CandidateExperienceResponse>>
    getAll() {

        return ResponseEntity.ok(
                service.getAll()
        );
    }




    @GetMapping("/{id}")
    public ResponseEntity<CandidateExperienceResponse>
    getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getById(id)
        );
    }




    @GetMapping("/candidate/{cdID}")
    public ResponseEntity<
            List<CandidateExperienceResponse>>
    getByCdID(
            @PathVariable String cdID) {

        return ResponseEntity.ok(
                service.getByCdID(cdID)
        );
    }




    @GetMapping("/rfh/{rfhNo}")
    public ResponseEntity<
            List<CandidateExperienceResponse>>
    getByRfhNo(
            @PathVariable String rfhNo) {

        return ResponseEntity.ok(
                service.getByRfhNo(rfhNo)
        );
    }



    @GetMapping("/company")
    public ResponseEntity<
            List<CandidateExperienceResponse>>
    getByCompanyName(
            @RequestParam String companyName) {

        return ResponseEntity.ok(
                service.getByCompanyName(
                        companyName
                )
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<CandidateExperienceResponse>
    update(

            @PathVariable Long id,

            @Valid
            @RequestBody
            CandidateExperienceRequest request) {

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
                "Candidate experience deleted successfully"
        );
    }
}