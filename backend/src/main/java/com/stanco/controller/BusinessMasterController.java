package com.stanco.controller;

import com.stanco.dto.request.BusinessMasterRequest;
import com.stanco.dto.response.BusinessMasterResponse;

import com.stanco.service.BusinessMasterService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/business-masters")
@RequiredArgsConstructor
public class BusinessMasterController {

    private final BusinessMasterService service;


    @PostMapping
    public ResponseEntity<BusinessMasterResponse> create(

            @Valid
            @RequestBody
            BusinessMasterRequest request,

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
            List<BusinessMasterResponse>>
    getAll() {

        return ResponseEntity.ok(
                service.getAll()
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<BusinessMasterResponse>
    getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getById(id)
        );
    }


    @GetMapping("/bu/{buId}")
    public ResponseEntity<BusinessMasterResponse>
    getByBuId(
            @PathVariable String buId) {

        return ResponseEntity.ok(
                service.getByBuId(buId)
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<BusinessMasterResponse>
    update(

            @PathVariable Long id,

            @Valid
            @RequestBody
            BusinessMasterRequest request,

            Authentication authentication) {

        String empID =
                authentication.getName();

        return ResponseEntity.ok(
                service.update(
                        id,
                        request,
                        empID
                )
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.ok(
                "Business deleted successfully"
        );
    }
}