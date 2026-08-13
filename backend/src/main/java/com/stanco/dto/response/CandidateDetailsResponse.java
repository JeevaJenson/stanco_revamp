package com.stanco.dto.response;

import com.stanco.enums.CandidateStatus;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CandidateDetailsResponse {

    private Long id;

    private String cdID;

    private String rfhNo;

    private CandidateStatus status;

    private String heplRecruitmentRefNumber;

    private String candidateName;

    private String candidateCv;

    private Integer redFlagStatus;

    private String createdOn;

    private String createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String candidateSource;

    private String gender;

    private Integer candidateStatus;

    private String candidateEmail;

    private LocalDate candidateOnbordedDate;

    private String invoiceDetails;

    private String candidateExpStatus;

    private String candidateType;

    private String candidateMobile;

    private String proofOfIdentity;

    private String poiFilename;

    private String proofOfAddress;

    private String poaFilename;

    private String taxEntityProof;

    private String proofOfRelieving;

    private String proofOfVaccination;

    private String proofOfDob;

    private String proofOfBg;

    private String proofOfBankacc;

    private Integer docStatus;

    private Integer offerRelStatus;

    private String cDocStatus;

    private Integer payrollStatus;

    private String payrollRemark;

    private String poLetterFilename;

    private Integer leaderStatus;

    private String ldRejectType;

    private String ldRejectRemark;

    private Integer poFinanceStatus;

    private String fnPoRemark;

    private String fnPoAttach;

    private String payrollVerifyType;

    private String welcomeBuddy;

    private String offerLetterFilename;

    private String orCcMailid;

    private String orBcMailid;

    private LocalDate orDoj;

    private Integer closedSalaryPa;

    private Integer lastDrawnCtc;

    private String registerType;

    private String registerTypePer;

    private String getEmpMode;

    private String orDepartment;

    private String poType;

    private Integer poFileStatus;

    private String clientPoAttach;

    private String clientPoNumber;

    private String orRecruiterName;

    private String orRecruiterEmail;

    private String orRecruiterMobileNo;

    private String approver;

    private Integer cDocUploadStatus;

    private String proofOfAttach;

    private String clientPoUpdateDate;

    private String clientPoValue;

    private String clientPoValidity;

    private String esiType;

    private String middleName;

    private String lastName;

    private String dob;

    private String age;

    private String maritalStatus;

    private String bloodGroup;

    private String attendanceFormat;

    private String weakOff;

    private String payrollStatusCtc;

    private String vertical;

    private String onboarder;

    private String reviewer;

    private String primaryReporter;

    private String additionalReporter;

    private Integer onboardStatus;

    private String clientType;

    private Integer payrollStatusHeadApprove;

    private String offerReleaseRemarks;

    private Integer directorStatus;

    private String preferredLocation;

    private String companyName;

    private String designation;

    private String totalExperience;

    private String relevantExperience;

    private String currentCtc;

    private String expectedCtc;

    private String noticePeriod;

    private String offersInHand;

    private String screeningComments;

    private String remarks;

    private String availability;

    private LocalDate l1InterviewDate;

    private LocalDate l2InterviewDate;

    private LocalDate l3InterviewDate;

    private LocalDate hrDiscussionDate;

    private LocalDate followUpDate;

    private BigDecimal margin;

    private BigDecimal billingValue;

    private String feedbackNotes;
}