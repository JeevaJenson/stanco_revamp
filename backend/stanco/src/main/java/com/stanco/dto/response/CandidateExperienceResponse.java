package com.stanco.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CandidateExperienceResponse {

    private Long id;

    private String cdID;

    private String rfhNo;

    private String heplRecruitmentRefNumber;

    private String jobTitle;

    private String companyName;

    private String expStartMonth;

    private String expStartYear;

    private String expEndMonth;

    private String expEndYear;

    private String certificate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}