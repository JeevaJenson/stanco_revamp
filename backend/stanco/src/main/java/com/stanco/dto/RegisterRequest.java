package com.stanco.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Employee ID is required")
    private String empID;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email")
    private String email;

    @NotBlank(message = "Mobile number is required")
    @Size(
        min = 10,
        max = 10,
        message = "Mobile number must contain 10 digits"
    )
    private String mobileNo;

    @NotBlank(message = "Password is required")
    @Size(
        min = 6,
        message = "Password must contain at least 6 characters"
    )
    private String password;
}