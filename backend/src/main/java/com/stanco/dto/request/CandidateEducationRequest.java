package com.stanco.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class CandidateEducationRequest {

    @NotBlank
    private String cdID;

    @NotBlank
    private String rfhNo;

    private String heplRecruitmentRefNumber;

    @NotBlank
    private String degree;

    @NotBlank
    private String university;

    @NotBlank
    private String eduStartMonth;

    @NotBlank
    private String eduStartYear;

    @NotBlank
    private String eduEndMonth;

    @NotBlank
    private String eduEndYear;

    @NotBlank
    private String eduCertificate;
}