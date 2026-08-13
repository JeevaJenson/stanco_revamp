package com.stanco.controller;

import com.stanco.dto.request.DesignationRequest;
import com.stanco.dto.response.DesignationResponse;

import com.stanco.service.DesignationService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/designations")
@RequiredArgsConstructor
public class DesignationController {

    private final DesignationService service;



    @PostMapping
    public ResponseEntity<DesignationResponse> create(
            @RequestBody DesignationRequest request) {

        return ResponseEntity.ok(
                service.create(request)
        );
    }


    // ==========================================
    // GET ALL
    // ==========================================

    @GetMapping
    public ResponseEntity<List<DesignationResponse>>
    getAll() {

        return ResponseEntity.ok(
                service.getAll()
        );
    }



    @GetMapping("/{id}")
    public ResponseEntity<DesignationResponse>
    getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getById(id)
        );
    }




    @GetMapping("/des/{desId}")
    public ResponseEntity<DesignationResponse>
    getByDesId(
            @PathVariable String desId) {

        return ResponseEntity.ok(
                service.getByDesId(desId)
        );
    }



    @PutMapping("/{id}")
    public ResponseEntity<DesignationResponse>
    update(
            @PathVariable Long id,
            @RequestBody DesignationRequest request) {

        return ResponseEntity.ok(
                service.update(
                        id,
                        request
                )
        );
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.ok(
                "Designation deleted successfully"
        );
    }
}