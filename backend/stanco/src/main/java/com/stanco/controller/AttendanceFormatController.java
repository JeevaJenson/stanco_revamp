package com.stanco.controller;

import com.stanco.dto.request.AttendanceFormatRequest;
import com.stanco.dto.response.AttendanceFormatResponse;

import com.stanco.service.AttendanceFormatService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance-formats")
@RequiredArgsConstructor
public class AttendanceFormatController {

    private final AttendanceFormatService service;


    @PostMapping
    public ResponseEntity<AttendanceFormatResponse> create(

            @Valid
            @RequestBody
            AttendanceFormatRequest request) {

        return ResponseEntity.ok(
                service.create(request)
        );
    }



    @GetMapping
    public ResponseEntity<
            List<AttendanceFormatResponse>>
    getAll() {

        return ResponseEntity.ok(
                service.getAll()
        );
    }



    @GetMapping("/{id}")
    public ResponseEntity<AttendanceFormatResponse>
    getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getById(id)
        );
    }


    @GetMapping("/name")
    public ResponseEntity<AttendanceFormatResponse>
    getByName(
            @RequestParam String attendanceFormat) {

        return ResponseEntity.ok(
                service.getByName(
                        attendanceFormat
                )
        );
    }



    @PutMapping("/{id}")
    public ResponseEntity<AttendanceFormatResponse>
    update(

            @PathVariable Long id,

            @Valid
            @RequestBody
            AttendanceFormatRequest request) {

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
                "Attendance format deleted successfully"
        );
    }
}