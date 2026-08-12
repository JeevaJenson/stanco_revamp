package com.stanco.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CandidateBenefitsResponse {

    private Long id;

    private String cdID;

    private String rfhNo;

    private String heplRecruitmentRefNumber;

    private String docType;

    private String docFilename;

    private LocalDate createdOn;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}