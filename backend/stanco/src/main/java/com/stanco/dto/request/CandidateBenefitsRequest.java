package com.stanco.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class CandidateBenefitsRequest {

    @NotBlank
    private String cdID;

    @NotBlank
    private String rfhNo;

    private String heplRecruitmentRefNumber;

    @NotBlank
    private String docType;

    @NotBlank
    private String docFilename;
}