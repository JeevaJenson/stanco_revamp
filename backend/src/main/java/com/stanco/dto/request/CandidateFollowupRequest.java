package com.stanco.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class CandidateFollowupRequest {

    @NotBlank
    private String cfdID;

    @NotBlank
    private String cdID;

    @NotBlank
    private String rfhNo;

    @NotBlank
    private String followUpStatus;
}