package com.stanco.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_education_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CandidateEducationDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cdID", nullable = false)
    private String cdID;

    @Column(name = "rfh_no", nullable = false)
    private String rfhNo;

    @Column(name = "hepl_recruitment_ref_number")
    private String heplRecruitmentRefNumber;

    @Column(name = "degree", nullable = false)
    private String degree;

    @Column(name = "university", nullable = false)
    private String university;

    @Column(name = "edu_start_month", nullable = false)
    private String eduStartMonth;

    @Column(name = "edu_start_year", nullable = false)
    private String eduStartYear;

    @Column(name = "edu_end_month", nullable = false)
    private String eduEndMonth;

    @Column(name = "edu_end_year", nullable = false)
    private String eduEndYear;

    @Column(name = "edu_certificate", nullable = false)
    private String eduCertificate;

    @Column(name = "created_on", nullable = false)
    private LocalDate createdOn;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}