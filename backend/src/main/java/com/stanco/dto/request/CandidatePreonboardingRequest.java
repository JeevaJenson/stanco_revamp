package com.stanco.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CandidatePreonboardingRequest {

    @NotBlank
    private String empId;

    @NotBlank
    private String recruiterId;

    @NotBlank
    private String preonboardingProcess;

    @NotNull
    private Integer type;

    private LocalDate date;
}