package com.stanco.dto.request;

import com.stanco.enums.Status;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
public class CreateUserRequest {

    @NotBlank(message = "Employee ID is required")
    private String empID;


    @NotBlank(message = "Name is required")
    private String name;


    @NotBlank(message = "Designation is required")
    private String designation;


    private String business;

    private String department;

    private String lobDivision;


    @NotBlank(message = "Email is required")
    private String email;


    @NotBlank(message = "Mobile number is required")
    private String mobileNo;


    @NotBlank(message = "Role type is required")
    private String roleType;


    private Status profileStatus;


    @NotBlank(message = "Password is required")
    @Size(
            min = 6,
            message = "Password must contain at least 6 characters"
    )
    private String password;


    private String team;

    private String colorCode;
}