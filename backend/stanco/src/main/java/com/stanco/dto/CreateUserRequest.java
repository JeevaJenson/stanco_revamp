package com.stanco.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
public class CreateUserRequest {

    @NotBlank
    private String empID;

    @NotBlank
    private String name;

    @NotBlank
    private String designation;

    private String business;

    private String department;

    private String lobDivision;

    private String supervisor;

    @NotBlank
    @Email
    private String email;

    private String mobileNo;

    @NotBlank
    private String roleType;

    private String profileStatus;

    @NotBlank
    @Size(min = 6)
    private String password;

    private String team;

    private String colorCode;
}