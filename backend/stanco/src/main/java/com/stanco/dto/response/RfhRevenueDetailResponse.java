package com.stanco.dto.response;

import com.stanco.enums.RevenueType;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RfhRevenueDetailResponse {

    private Long id;

    private String rfhNo;

    private RevenueType revenueType;

    private BigDecimal revenuePercentage;

    private Integer revenueCount;

    private BigDecimal calculatedRevenue;

    private String createdBy;

    private String updatedBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}