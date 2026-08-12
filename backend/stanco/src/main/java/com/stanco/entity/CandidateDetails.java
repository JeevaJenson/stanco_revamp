package com.stanco.entity;

import com.stanco.enums.CandidateStatus;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidateDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "cdID",
            nullable = false
    )
    private String cdID;


    @Column(
            name = "rfh_no",
            nullable = false
    )
    private String rfhNo;


    @Enumerated(EnumType.STRING)
    @Column(
            name = "status",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private CandidateStatus status;


    @Column(name = "hepl_recruitment_ref_number")
    private String heplRecruitmentRefNumber;


    @Column(
            name = "candidate_name",
            nullable = false
    )
    private String candidateName;


    @Column(
            name = "candidate_cv",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String candidateCv;


    @Column(name = "red_flag_status")
    private Integer redFlagStatus;


    @Column(name = "created_on")
    private String createdOn;


    @Column(
            name = "created_by",
            nullable = false
    )
    private String createdBy;


    @Column(name = "created_at")
    private LocalDateTime createdAt;


    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @Column(name = "candidate_source")
    private String candidateSource;


    @Column(name = "gender")
    private String gender;


    @Column(name = "candidate_email")
    private String candidateEmail;


    @Column(name = "candidate_onborded_date")
    private LocalDate candidateOnbordedDate;


    @Column(
            name = "invoice_details",
            columnDefinition = "TEXT"
    )
    private String invoiceDetails;


    @Column(name = "candidate_exp_status")
    private String candidateExpStatus;


    @Column(name = "candidate_type")
    private String candidateType;


    @Column(name = "candidate_mobile")
    private String candidateMobile;



    @Column(
            name = "proof_of_identity",
            columnDefinition = "TEXT"
    )
    private String proofOfIdentity;


    @Column(
            name = "poi_filename",
            columnDefinition = "TEXT"
    )
    private String poiFilename;


    @Column(
            name = "proof_of_address",
            columnDefinition = "TEXT"
    )
    private String proofOfAddress;


    @Column(
            name = "poa_filename",
            columnDefinition = "TEXT"
    )
    private String poaFilename;


    @Column(
            name = "tax_entity_proof",
            columnDefinition = "TEXT"
    )
    private String taxEntityProof;


    @Column(
            name = "proof_of_relieving",
            columnDefinition = "TEXT"
    )
    private String proofOfRelieving;


    @Column(
            name = "proof_of_vaccination",
            columnDefinition = "TEXT"
    )
    private String proofOfVaccination;


    @Column(
            name = "proof_of_dob",
            columnDefinition = "TEXT"
    )
    private String proofOfDob;


    @Column(
            name = "proof_of_bg",
            columnDefinition = "TEXT"
    )
    private String proofOfBg;


    @Column(
            name = "proof_of_bankacc",
            columnDefinition = "TEXT"
    )
    private String proofOfBankacc;


    @Column(name = "doc_status")
    private Integer docStatus;



    @Column(name = "offer_rel_status")
    private Integer offerRelStatus;


    @Column(name = "c_doc_status")
    private String cDocStatus;


    @Column(name = "payroll_status")
    private Integer payrollStatus;


    @Column(
            name = "payroll_remark",
            columnDefinition = "TEXT"
    )
    private String payrollRemark;


    @Column(
            name = "po_letter_filename",
            columnDefinition = "TEXT"
    )
    private String poLetterFilename;


    @Column(name = "leader_status")
    private Integer leaderStatus;


    @Column(name = "ld_reject_type")
    private String ldRejectType;


    @Column(
            name = "ld_reject_remark",
            columnDefinition = "TEXT"
    )
    private String ldRejectRemark;

    @Column(name = "po_finance_status")
    private Integer poFinanceStatus;


    @Column(
            name = "fn_po_remark",
            columnDefinition = "TEXT"
    )
    private String fnPoRemark;


    @Column(
            name = "fn_po_attach",
            columnDefinition = "TEXT"
    )
    private String fnPoAttach;


    @Column(name = "payroll_verify_type")
    private String payrollVerifyType;


    @Column(name = "welcome_buddy")
    private String welcomeBuddy;


    @Column(
            name = "offer_letter_filename",
            columnDefinition = "TEXT"
    )
    private String offerLetterFilename;


    @Column(name = "or_cc_mailid")
    private String orCcMailid;


    @Column(name = "or_bc_mailid")
    private String orBcMailid;


    @Column(name = "or_doj")
    private LocalDate orDoj;


    @Column(name = "closed_salary_pa")
    private Integer closedSalaryPa;


    @Column(name = "last_drawn_ctc")
    private Integer lastDrawnCtc;


    @Column(name = "register_type")
    private String registerType;


    @Column(name = "register_type_per")
    private String registerTypePer;


    @Column(name = "get_emp_mode")
    private String getEmpMode;


    @Column(name = "or_department")
    private String orDepartment;


    @Column(name = "po_type")
    private String poType;


    @Column(name = "po_file_status")
    private Integer poFileStatus;


    @Column(
            name = "client_po_attach",
            columnDefinition = "TEXT"
    )
    private String clientPoAttach;


    @Column(name = "client_po_number")
    private String clientPoNumber;


    @Column(name = "or_recruiter_name")
    private String orRecruiterName;


    @Column(name = "or_recruiter_email")
    private String orRecruiterEmail;


    @Column(name = "or_recruiter_mobile_no")
    private String orRecruiterMobileNo;


    @Column(name = "approver")
    private String approver;


    @Column(name = "c_doc_upload_status")
    private Integer cDocUploadStatus;


    @Column(
            name = "proof_of_attach",
            columnDefinition = "TEXT"
    )
    private String proofOfAttach;


    @Column(name = "client_po_update_date")
    private String clientPoUpdateDate;


    @Column(name = "client_po_value")
    private String clientPoValue;


    @Column(name = "client_po_validity")
    private String clientPoValidity;


    @Column(name = "esi_type")
    private String esiType;


    @Column(name = "middle_name")
    private String middleName;


    @Column(name = "last_name")
    private String lastName;


    @Column(name = "dob")
    private String dob;


    @Column(name = "age")
    private String age;


    @Column(name = "marital_status")
    private String maritalStatus;


    @Column(name = "blood_group")
    private String bloodGroup;


    @Column(name = "attendance_format")
    private String attendanceFormat;


    @Column(name = "weak_off")
    private String weakOff;


    @Column(name = "payroll_status_ctc")
    private String payrollStatusCtc;


    @Column(name = "vertical")
    private String vertical;


    @Column(name = "onboarder")
    private String onboarder;


    @Column(name = "reviewer")
    private String reviewer;


    @Column(name = "primary_reporter")
    private String primaryReporter;


    @Column(name = "additional_reporter")
    private String additionalReporter;


    @Column(name = "onboard_status")
    private Integer onboardStatus;


    @Column(name = "client_type")
    private String clientType;


    @Column(name = "payroll_status_head_approve")
    private Integer payrollStatusHeadApprove;


    @Column(
            name = "offer_release_remarks",
            columnDefinition = "TEXT"
    )
    private String offerReleaseRemarks;


    @Column(name = "director_status")
    private Integer directorStatus;


    @Column(name = "preferred_location")
    private String preferredLocation;


    @Column(name = "company_name")
    private String companyName;


    @Column(name = "designation")
    private String designation;


    @Column(name = "total_experience")
    private String totalExperience;


    @Column(name = "relevant_experience")
    private String relevantExperience;


    @Column(name = "current_ctc")
    private String currentCtc;


    @Column(name = "expected_ctc")
    private String expectedCtc;


    @Column(name = "notice_period")
    private String noticePeriod;


    @Column(name = "offers_in_hand")
    private String offersInHand;



    @Column(
            name = "screening_comments",
            columnDefinition = "TEXT"
    )
    private String screeningComments;


    @Column(
            name = "remarks",
            columnDefinition = "TEXT"
    )
    private String remarks;


    @Column(name = "availability")
    private String availability;


    @Column(name = "l1_interview_date")
    private LocalDate l1InterviewDate;


    @Column(name = "l2_interview_date")
    private LocalDate l2InterviewDate;


    @Column(name = "l3_interview_date")
    private LocalDate l3InterviewDate;


    @Column(name = "hr_discussion_date")
    private LocalDate hrDiscussionDate;


    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @Column(name = "margin")
    private BigDecimal margin;


    @Column(name = "billing_value")
    private BigDecimal billingValue;


    @Column(
            name = "feedback_notes",
            columnDefinition = "TEXT"
    )
    private String feedbackNotes;
}