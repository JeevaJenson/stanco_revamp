package com.stanco.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_benefits_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CandidateBenefitsDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cdID", nullable = false)
    private String cdID;

    @Column(name = "rfh_no", nullable = false)
    private String rfhNo;

    @Column(name = "hepl_recruitment_ref_number")
    private String heplRecruitmentRefNumber;

    @Column(name = "doc_type", nullable = false)
    private String docType;

    @Column(name = "doc_filename", nullable = false)
    private String docFilename;

    @Column(name = "created_on", nullable = false)
    private LocalDate createdOn;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}