package com.stanco.controller;

import com.stanco.dto.request.CollegeRequest;
import com.stanco.dto.response.CollegeResponse;

import com.stanco.service.CollegeService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colleges")
@RequiredArgsConstructor
public class CollegeController {

    private final CollegeService service;



    @PostMapping
    public ResponseEntity<CollegeResponse>
    create(

            @Valid
            @RequestBody
            CollegeRequest request) {

        return ResponseEntity.ok(
                service.create(request)
        );
    }


    @GetMapping
    public ResponseEntity<List<CollegeResponse>>
    getAll() {

        return ResponseEntity.ok(
                service.getAll()
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<CollegeResponse>
    getById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                service.getById(id)
        );
    }


    @GetMapping("/cld/{cldID}")
    public ResponseEntity<CollegeResponse>
    getByCldID(
            @PathVariable String cldID) {

        return ResponseEntity.ok(
                service.getByCldID(cldID)
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<CollegeResponse>>
    searchByName(
            @RequestParam String collegeName) {

        return ResponseEntity.ok(
                service.searchByName(
                        collegeName
                )
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<CollegeResponse>
    update(

            @PathVariable Integer id,

            @Valid
            @RequestBody
            CollegeRequest request) {

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
            @PathVariable Integer id) {

        service.delete(id);

        return ResponseEntity.ok(
                "College deleted successfully"
        );
    }
}