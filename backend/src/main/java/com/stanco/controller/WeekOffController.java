package com.stanco.controller;

import com.stanco.dto.request.WeekOffRequest;
import com.stanco.dto.response.WeekOffResponse;

import com.stanco.service.WeekOffService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/week-offs")
@RequiredArgsConstructor
public class WeekOffController {

    private final WeekOffService weekOffService;



    @PostMapping
    public ResponseEntity<WeekOffResponse> create(

            @Valid
            @RequestBody
            WeekOffRequest request) {

        return ResponseEntity.ok(
                weekOffService.create(
                        request
                )
        );
    }


    @GetMapping
    public ResponseEntity<
            List<WeekOffResponse>>
    getAll() {

        return ResponseEntity.ok(
                weekOffService.getAll()
        );
    }



    @GetMapping("/{id}")
    public ResponseEntity<WeekOffResponse>
    getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                weekOffService.getById(
                        id
                )
        );
    }




    @GetMapping("/name/{weekOff}")
    public ResponseEntity<WeekOffResponse>
    getByWeekOff(
            @PathVariable String weekOff) {

        return ResponseEntity.ok(
                weekOffService.getByWeekOff(
                        weekOff
                )
        );
    }



    @PutMapping("/{id}")
    public ResponseEntity<WeekOffResponse>
    update(

            @PathVariable Long id,

            @Valid
            @RequestBody
            WeekOffRequest request) {

        return ResponseEntity.ok(
                weekOffService.update(
                        id,
                        request
                )
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    delete(
            @PathVariable Long id) {

        weekOffService.delete(id);

        return ResponseEntity.ok(
                "Week off deleted successfully"
        );
    }
}