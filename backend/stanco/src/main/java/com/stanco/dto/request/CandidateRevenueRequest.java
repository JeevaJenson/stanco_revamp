package com.stanco.dto.request;

import com.stanco.entity.CandidateRevenueTracking.RevenueType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CandidateRevenueRequest {

    @NotBlank
    private String candidateId;

    @NotBlank
    private String rfhNo;

    @NotNull
    private RevenueType revenueType;

    @NotNull
    private BigDecimal revenueAmount;
}