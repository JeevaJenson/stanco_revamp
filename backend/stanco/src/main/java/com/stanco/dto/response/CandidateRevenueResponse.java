package com.stanco.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CandidateRevenueResponse {

    private Long id;

    private String candidateId;

    private String rfhNo;

    private String revenueType;

    private BigDecimal revenueAmount;

    private String createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}