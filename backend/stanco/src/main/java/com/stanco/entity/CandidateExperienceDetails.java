package com.stanco.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_experience_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CandidateExperienceDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cdID", nullable = false)
    private String cdID;

    @Column(name = "rfh_no", nullable = false)
    private String rfhNo;

    @Column(
            name = "hepl_recruitment_ref_number",
            nullable = false
    )
    private String heplRecruitmentRefNumber;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "exp_start_month", nullable = false)
    private String expStartMonth;

    @Column(name = "exp_start_year", nullable = false)
    private String expStartYear;

    @Column(name = "exp_end_month", nullable = false)
    private String expEndMonth;

    @Column(name = "exp_end_year", nullable = false)
    private String expEndYear;

    @Column(name = "certificate", nullable = false)
    private String certificate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}