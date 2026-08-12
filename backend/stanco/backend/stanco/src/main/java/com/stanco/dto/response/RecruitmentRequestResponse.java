package com.stanco.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RecruitmentRequestResponse {

    private Long id;

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

    private String createdBy;

    private String modifiedBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Integer deleteStatus;

    private String subPositionTitle;

    private String closedBy;
}