package com.stanco.controller;

import com.stanco.dto.CreateUserRequest;
import com.stanco.dto.UserResponse;

import com.stanco.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @GetMapping
    public ResponseEntity<List<UserResponse>>
    getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<UserResponse>
    getUserById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.getUserById(id)
        );
    }


    @GetMapping("/emp/{empID}")
    public ResponseEntity<UserResponse>
    getUserByEmpID(
            @PathVariable String empID) {

        return ResponseEntity.ok(
                userService.getUserByEmpID(empID)
        );
    }

    @PostMapping
public ResponseEntity<UserResponse> createUser(
        @Valid @RequestBody CreateUserRequest request) {

    return ResponseEntity.ok(
            userService.createUser(request)
    );
}


    @GetMapping("/me")
    public ResponseEntity<UserResponse>
    getMyDetails(
            Authentication authentication) {

        String empID =
                authentication.getName();

        return ResponseEntity.ok(
                userService.getMyDetails(empID)
        );
    }
}