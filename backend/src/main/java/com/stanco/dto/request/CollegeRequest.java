package com.stanco.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class CollegeRequest {

    @NotBlank
    private String cldID;

    @NotBlank
    private String collegeName;
}