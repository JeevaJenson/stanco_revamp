package com.stanco.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_preonboarding")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CandidatePreonboarding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "emp_id", nullable = false)
    private String empId;

    @Column(name = "recruiter_id", nullable = false)
    private String recruiterId;

    @Column(
            name = "preonboarding_process",
            nullable = false
    )
    private String preonboardingProcess;

    @Column(name = "type", nullable = false)
    private Integer type;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}