package com.stanco.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class CandidateExperienceRequest {

    @NotBlank
    private String cdID;

    @NotBlank
    private String rfhNo;

    @NotBlank
    private String heplRecruitmentRefNumber;

    @NotBlank
    private String jobTitle;

    @NotBlank
    private String companyName;

    @NotBlank
    private String expStartMonth;

    @NotBlank
    private String expStartYear;

    @NotBlank
    private String expEndMonth;

    @NotBlank
    private String expEndYear;

    @NotBlank
    private String certificate;
}