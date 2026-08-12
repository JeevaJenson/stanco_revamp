package com.stanco.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CandidateEducationResponse {

    private Long id;

    private String cdID;

    private String rfhNo;

    private String heplRecruitmentRefNumber;

    private String degree;

    private String university;

    private String eduStartMonth;

    private String eduStartYear;

    private String eduEndMonth;

    private String eduEndYear;

    private String eduCertificate;

    private LocalDate createdOn;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}