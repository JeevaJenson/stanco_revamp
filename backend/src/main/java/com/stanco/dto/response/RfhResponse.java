package com.stanco.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RfhResponse {

    private Long id;

    private String resId;

    private String rollsOption;

    private String name;

    private String mobile;

    private String email;

    private String positionReports;

    private String reportEmail;

    private String costCenter;

    private String approvedBy;

    private String requestType;

    private String replacementOf;

    private String approvalHire;

    private String ticketNumber;

    private String positionTitle;

    private String location;

    private String locationPreferred;

    private String business;

    private String band;

    private String division;

    private String function;

    private String noOfPositions;

    private String jdRoles;

    private String qualification;

    private String essentialSkill;

    private String goodSkill;

    private String experience;

    private String salaryRange;

    private String salaryRangeAnnual;

    private String anySpecific;

    private LocalDateTime createdDate;

    private Integer deleteStatus;

    private String deleteRemark;

    private Integer approvalHirePath;

    private String requestDate;

    private String requestBy;

    private String approveDate;

    private String department;

    private String designation;

    private String vertical;

    private String tenDoj;

    private String empCategory;

    private String type;

    private String attendanceFormat;

    private String weekOff;

    private String ckSupervisior;

    private String ckMail;

    private String approverId;

    private String reporterId;

    private String clientName;
}