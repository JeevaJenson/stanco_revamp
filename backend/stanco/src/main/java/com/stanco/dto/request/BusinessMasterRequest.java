package com.stanco.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class BusinessMasterRequest {

    private String buId;

    @NotBlank
    private String businessName;

    private String status;
}