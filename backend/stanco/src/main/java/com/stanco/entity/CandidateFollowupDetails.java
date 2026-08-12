package com.stanco.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_followup_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CandidateFollowupDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cfdID", nullable = false)
    private String cfdID;

    @Column(name = "cdID", nullable = false)
    private String cdID;

    @Column(name = "rfh_no", nullable = false)
    private String rfhNo;

    @Column(name = "follow_up_status", nullable = false)
    private String followUpStatus;

    @Column(name = "created_on", nullable = false)
    private LocalDate createdOn;

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}