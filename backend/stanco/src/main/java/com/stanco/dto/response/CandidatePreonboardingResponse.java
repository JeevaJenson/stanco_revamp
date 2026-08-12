package com.stanco.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CandidatePreonboardingResponse {

    private Long id;

    private String empId;

    private String recruiterId;

    private String preonboardingProcess;

    private Integer type;

    private LocalDate date;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}