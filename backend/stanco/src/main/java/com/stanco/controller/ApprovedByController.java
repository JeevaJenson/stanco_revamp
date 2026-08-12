package com.stanco.controller;

import com.stanco.dto.request.ApprovedByRequest;
import com.stanco.dto.response.ApprovedByResponse;

import com.stanco.service.ApprovedByService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/approved-by")
@RequiredArgsConstructor
public class ApprovedByController {

    private final ApprovedByService service;


    @PostMapping
    public ResponseEntity<ApprovedByResponse> create(

            @Valid
            @RequestBody
            ApprovedByRequest request) {

        return ResponseEntity.ok(
                service.create(request)
        );
    }



    @GetMapping
    public ResponseEntity<
            List<ApprovedByResponse>>
    getAll() {

        return ResponseEntity.ok(
                service.getAll()
        );
    }



    @GetMapping("/{id}")
    public ResponseEntity<ApprovedByResponse>
    getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getById(id)
        );
    }



    @GetMapping("/emp/{empId}")
    public ResponseEntity<ApprovedByResponse>
    getByEmpId(
            @PathVariable String empId) {

        return ResponseEntity.ok(
                service.getByEmpId(empId)
        );
    }


    @GetMapping("/vertical/{vertical}")
    public ResponseEntity<
            List<ApprovedByResponse>>
    getByVertical(
            @PathVariable String vertical) {

        return ResponseEntity.ok(
                service.getByVertical(
                        vertical
                )
        );
    }



    @PutMapping("/{id}")
    public ResponseEntity<ApprovedByResponse>
    update(

            @PathVariable Long id,

            @Valid
            @RequestBody
            ApprovedByRequest request) {

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
                "Approved By deleted successfully"
        );
    }
}