package com.stanco.dto.request;

import com.stanco.enums.Status;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class DepartmentRequest {

    @NotBlank
    private String depId;

    @NotBlank
    private String name;

    private Status status;

    private String createdBy;

    private String updatedBy;
}