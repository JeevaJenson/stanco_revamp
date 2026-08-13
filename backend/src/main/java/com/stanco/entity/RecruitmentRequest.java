package com.stanco.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "recruitment_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecruitmentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "`recReqID`", nullable = false)
    private String recReqID;

    @Column(name = "rfh_no")
    private String rfhNo;

    @Column(name = "position_title")
    private String positionTitle;

    @Column(name = "no_of_position")
    private String noOfPosition;

    @Column(name = "band")
    private String band;

    @Column(name = "open_date")
    private LocalDate openDate;

    @Column(name = "critical_position")
    private String criticalPosition;

    @Column(name = "business")
    private String business;

    @Column(name = "division")
    private String division;

    @Column(name = "`function`")
    private String function;

    @Column(name = "location")
    private String location;

    @Column(name = "billing_status")
    private String billingStatus;

    @Column(name = "interviewer")
    private String interviewer;

    @Column(name = "salary_range")
    private String salaryRange;

    @Column(name = "salary_range_annual")
    private String salaryRangeAnnual;

    @Column(name = "request_status")
    private String requestStatus;

    @Column(name = "close_date")
    private LocalDate closeDate;

    @Column(name = "assigned_status")
    private String assignedStatus;

    @Column(name = "assigned_to")
    private String assignedTo;

    @Column(name = "assigned_date")
    private String assignedDate;

    @Column(name = "hepl_recruitment_ref_number")
    private String heplRecruitmentRefNumber;

    @Column(name = "action_for_the_day_status")
    private String actionForTheDayStatus;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "modified_by")
    private String modifiedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "delete_status", nullable = false)
    private Integer deleteStatus;

    @Column(
            name = "sub_position_title",
            columnDefinition = "TEXT"
    )
    private String subPositionTitle;

    @Column(name = "closed_by", nullable = false)
    private String closedBy;
}