package com.stanco.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class ApprovedByRequest {

    @NotBlank(message = "Vertical is required")
    private String vertical;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Employee ID is required")
    private String empId;

    private String status;
}