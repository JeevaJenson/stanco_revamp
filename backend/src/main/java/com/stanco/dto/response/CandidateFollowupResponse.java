package com.stanco.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CandidateFollowupResponse {

    private Long id;

    private String cfdID;

    private String cdID;

    private String rfhNo;

    private String followUpStatus;

    private LocalDate createdOn;

    private String createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}