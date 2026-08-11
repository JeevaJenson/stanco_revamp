package com.stanco.dto;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Employee ID is required")
    private String empID;

    @NotBlank(message = "Password is required")
    private String password;
}