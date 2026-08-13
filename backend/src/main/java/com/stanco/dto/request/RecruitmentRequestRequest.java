package com.stanco.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RecruitmentRequestRequest {

    @NotBlank
    private String recReqID;

    private String rfhNo;

    private String positionTitle;

    private String noOfPosition;

    private String band;

    private LocalDate openDate;

    private String criticalPosition;

    private String business;

    private String division;

    private String function;

    private String location;

    private String billingStatus;

    private String interviewer;

    private String salaryRange;

    private String salaryRangeAnnual;

    private String requestStatus;

    private LocalDate closeDate;

    private String assignedStatus;

    private String assignedTo;

    private String assignedDate;

    private String heplRecruitmentRefNumber;

    private String actionForTheDayStatus;

    private String subPositionTitle;

    private String closedBy;
}