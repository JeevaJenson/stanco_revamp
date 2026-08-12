package com.stanco.controller;

import com.stanco.dto.request.VerticalRequest;
import com.stanco.dto.response.VerticalResponse;

import com.stanco.service.VerticalService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/verticals")
@RequiredArgsConstructor
public class VerticalController {

    private final VerticalService verticalService;



    @PostMapping
    public ResponseEntity<VerticalResponse> create(

            @Valid
            @RequestBody
            VerticalRequest request) {

        return ResponseEntity.ok(
                verticalService.create(
                        request
                )
        );
    }


    @GetMapping
    public ResponseEntity<
            List<VerticalResponse>>
    getAll() {

        return ResponseEntity.ok(
                verticalService.getAll()
        );
    }



    @GetMapping("/{id}")
    public ResponseEntity<VerticalResponse>
    getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                verticalService.getById(
                        id
                )
        );
    }


    @GetMapping("/name/{verticalName}")
    public ResponseEntity<VerticalResponse>
    getByName(
            @PathVariable String verticalName) {

        return ResponseEntity.ok(
                verticalService.getByName(
                        verticalName
                )
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<VerticalResponse>
    update(

            @PathVariable Long id,

            @Valid
            @RequestBody
            VerticalRequest request) {

        return ResponseEntity.ok(
                verticalService.update(
                        id,
                        request
                )
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    delete(
            @PathVariable Long id) {

        verticalService.delete(id);

        return ResponseEntity.ok(
                "Vertical deleted successfully"
        );
    }
}