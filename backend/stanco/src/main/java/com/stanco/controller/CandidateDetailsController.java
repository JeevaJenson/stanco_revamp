package com.stanco.controller;

import com.stanco.dto.request.CandidateDetailsRequest;
import com.stanco.dto.response.CandidateDetailsResponse;

import com.stanco.enums.CandidateStatus;

import com.stanco.service.CandidateDetailsService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
public class CandidateDetailsController {

    private final CandidateDetailsService service;


    @PostMapping
    public ResponseEntity<CandidateDetailsResponse> create(

            @Valid
            @RequestBody
            CandidateDetailsRequest request,

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
    public ResponseEntity<List<CandidateDetailsResponse>>
    getAll() {

        return ResponseEntity.ok(
                service.getAll()
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<CandidateDetailsResponse>
    getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getById(id)
        );
    }


    @GetMapping("/cd/{cdID}")
    public ResponseEntity<CandidateDetailsResponse>
    getByCdID(
            @PathVariable String cdID) {

        return ResponseEntity.ok(
                service.getByCdID(cdID)
        );
    }



    @GetMapping("/rfh/{rfhNo}")
    public ResponseEntity<List<CandidateDetailsResponse>>
    getByRfhNo(
            @PathVariable String rfhNo) {

        return ResponseEntity.ok(
                service.getByRfhNo(rfhNo)
        );
    }




    @GetMapping("/status/{status}")
    public ResponseEntity<List<CandidateDetailsResponse>>
    getByStatus(
            @PathVariable CandidateStatus status) {

        return ResponseEntity.ok(
                service.getByStatus(status)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<CandidateDetailsResponse>
    update(

            @PathVariable Long id,

            @Valid
            @RequestBody
            CandidateDetailsRequest request) {

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
                "Candidate deleted successfully"
        );
    }
}