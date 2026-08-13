package com.stanco.controller;

import com.stanco.dto.request.RfhRevenueDetailRequest;
import com.stanco.dto.response.RfhRevenueDetailResponse;

import com.stanco.service.RfhRevenueDetailService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rfh-revenue-details")
@RequiredArgsConstructor
public class RfhRevenueDetailController {


    private final RfhRevenueDetailService service;


    @PostMapping
    public ResponseEntity<RfhRevenueDetailResponse> create(

            @Valid
            @RequestBody
            RfhRevenueDetailRequest request,

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
            List<RfhRevenueDetailResponse>>
    getAll() {

        return ResponseEntity.ok(
                service.getAll()
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<RfhRevenueDetailResponse>
    getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getById(id)
        );
    }


    @GetMapping("/rfh/{rfhNo}")
    public ResponseEntity<
            List<RfhRevenueDetailResponse>>
    getByRfhNo(
            @PathVariable String rfhNo) {

        return ResponseEntity.ok(
                service.getByRfhNo(rfhNo)
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<RfhRevenueDetailResponse>
    update(

            @PathVariable Long id,

            @Valid
            @RequestBody
            RfhRevenueDetailRequest request,

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
                "RFH Revenue Detail deleted successfully"
        );
    }
}