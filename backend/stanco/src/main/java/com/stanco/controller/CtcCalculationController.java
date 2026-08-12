package com.stanco.controller;

import com.stanco.dto.request.CtcCalculationRequest;
import com.stanco.dto.response.CtcCalculationResponse;
import com.stanco.service.CtcCalculationService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ctc-calculations")
@RequiredArgsConstructor
public class CtcCalculationController {

    private final CtcCalculationService service;


    @PostMapping
    public ResponseEntity<CtcCalculationResponse> create(
            @Valid @RequestBody
            CtcCalculationRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                service.create(
                        request,
                        authentication.getName()
                )
        );
    }


    @GetMapping
    public ResponseEntity<List<CtcCalculationResponse>>
    getAll() {

        return ResponseEntity.ok(
                service.getAll()
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<CtcCalculationResponse>
    getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getById(id)
        );
    }


    @GetMapping("/ctc/{ctcID}")
    public ResponseEntity<CtcCalculationResponse>
    getByCtcID(
            @PathVariable String ctcID) {

        return ResponseEntity.ok(
                service.getByCtcID(ctcID)
        );
    }


    @GetMapping("/candidate/{cdID}")
    public ResponseEntity<List<CtcCalculationResponse>>
    getByCdID(
            @PathVariable String cdID) {

        return ResponseEntity.ok(
                service.getByCdID(cdID)
        );
    }


    @GetMapping("/rfh/{rfhNo}")
    public ResponseEntity<List<CtcCalculationResponse>>
    getByRfhNo(
            @PathVariable String rfhNo) {

        return ResponseEntity.ok(
                service.getByRfhNo(rfhNo)
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<CtcCalculationResponse>
    update(
            @PathVariable Long id,

            @Valid @RequestBody
            CtcCalculationRequest request,

            Authentication authentication) {

        return ResponseEntity.ok(
                service.update(
                        id,
                        request,
                        authentication.getName()
                )
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.ok(
                "CTC calculation deleted successfully"
        );
    }
}