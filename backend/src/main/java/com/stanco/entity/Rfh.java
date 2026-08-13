package com.stanco.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_rfh")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rfh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "res_id")
    private String resId;

    @Column(name = "rolls_option")
    private String rollsOption;

    @Column(name = "name")
    private String name;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "email")
    private String email;

    @Column(name = "position_reports")
    private String positionReports;

    @Column(name = "report_email")
    private String reportEmail;

    @Column(name = "cost_center")
    private String costCenter;

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "request_type", nullable = false)
    private String requestType;

    @Column(name = "replacement_of", nullable = false)
    private String replacementOf;

    @Column(name = "approval_hire")
    private String approvalHire;

    @Column(name = "ticket_number")
    private String ticketNumber;

    @Column(name = "position_title")
    private String positionTitle;

    @Column(name = "location")
    private String location;

    @Column(name = "location_preferred", columnDefinition = "TEXT")
    private String locationPreferred;

    @Column(name = "business")
    private String business;

    @Column(name = "band")
    private String band;

    @Column(name = "division")
    private String division;

    @Column(name = "`function`")
    private String function;

    @Column(name = "no_of_positions")
    private String noOfPositions;

    @Column(name = "jd_roles", columnDefinition = "TEXT")
    private String jdRoles;

    @Column(name = "qualification")
    private String qualification;

    @Column(name = "essential_skill", columnDefinition = "TEXT")
    private String essentialSkill;

    @Column(name = "good_skill", columnDefinition = "TEXT")
    private String goodSkill;

    @Column(name = "experience")
    private String experience;

    @Column(name = "salary_range")
    private String salaryRange;

    @Column(name = "salary_range_annual")
    private String salaryRangeAnnual;

    @Column(name = "any_specific", columnDefinition = "TEXT")
    private String anySpecific;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "delete_status", nullable = false)
    private Integer deleteStatus;

    @Column(name = "delete_remark", nullable = false, columnDefinition = "TEXT")
    private String deleteRemark;

    @Column(name = "approval_hire_path", nullable = false)
    private Integer approvalHirePath;

    @Column(name = "request_date")
    private String requestDate;

    @Column(name = "request_by", nullable = false)
    private String requestBy;

    @Column(name = "approve_date")
    private String approveDate;

    @Column(name = "department")
    private String department;

    @Column(name = "designation")
    private String designation;

    @Column(name = "vertical")
    private String vertical;

    @Column(name = "ten_doj")
    private String tenDoj;

    @Column(name = "emp_category")
    private String empCategory;

    @Column(name = "type")
    private String type;

    @Column(name = "attendance_format")
    private String attendanceFormat;

    @Column(name = "week_off")
    private String weekOff;

    @Column(name = "ck_supervisior")
    private String ckSupervisior;

    @Column(name = "ck_mail")
    private String ckMail;

    @Column(name = "approver_id")
    private String approverId;

    @Column(name = "reporter_id")
    private String reporterId;

    @Column(name = "client_name", nullable = false)
    private String clientName;
}