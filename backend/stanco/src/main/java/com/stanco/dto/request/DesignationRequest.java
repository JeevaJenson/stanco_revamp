package com.stanco.dto.request;

import com.stanco.enums.Status;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class DesignationRequest {

    @NotBlank(message = "Designation ID is required")
    private String desId;


    @NotBlank(message = "Designation name is required")
    private String name;


    private Status status;


    private String createdBy;


    private String updatedBy;
}