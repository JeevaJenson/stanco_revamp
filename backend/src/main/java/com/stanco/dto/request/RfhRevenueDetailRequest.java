package com.stanco.dto.request;

import com.stanco.enums.RevenueType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RfhRevenueDetailRequest {

    @NotBlank
    private String rfhNo;

    @NotNull
    private RevenueType revenueType;

    private BigDecimal revenuePercentage;

    private Integer revenueCount;

    private BigDecimal calculatedRevenue;
}