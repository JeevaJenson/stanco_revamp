package com.stanco.controller;

import com.stanco.dto.request.CandidateBenefitsRequest;
import com.stanco.dto.response.CandidateBenefitsResponse;

import com.stanco.service.CandidateBenefitsService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate-benefits")
@RequiredArgsConstructor
public class CandidateBenefitsController {

    private final CandidateBenefitsService service;



    @PostMapping
    public ResponseEntity<CandidateBenefitsResponse>
    create(

            @Valid
            @RequestBody
            CandidateBenefitsRequest request) {

        return ResponseEntity.ok(
                service.create(request)
        );
    }


    @GetMapping
    public ResponseEntity<
            List<CandidateBenefitsResponse>>
    getAll() {

        return ResponseEntity.ok(
                service.getAll()
        );
    }



    @GetMapping("/{id}")
    public ResponseEntity<CandidateBenefitsResponse>
    getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getById(id)
        );
    }


    @GetMapping("/candidate/{cdID}")
    public ResponseEntity<
            List<CandidateBenefitsResponse>>
    getByCdID(
            @PathVariable String cdID) {

        return ResponseEntity.ok(
                service.getByCdID(cdID)
        );
    }


    @GetMapping("/rfh/{rfhNo}")
    public ResponseEntity<
            List<CandidateBenefitsResponse>>
    getByRfhNo(
            @PathVariable String rfhNo) {

        return ResponseEntity.ok(
                service.getByRfhNo(rfhNo)
        );
    }


    @GetMapping("/type/{docType}")
    public ResponseEntity<
            List<CandidateBenefitsResponse>>
    getByDocType(
            @PathVariable String docType) {

        return ResponseEntity.ok(
                service.getByDocType(docType)
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<CandidateBenefitsResponse>
    update(

            @PathVariable Long id,

            @Valid
            @RequestBody
            CandidateBenefitsRequest request) {

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
                "Candidate benefits deleted successfully"
        );
    }
}