package com.stanco.repository;

import com.stanco.entity.RecruitmentRequest;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecruitmentRequestRepository
        extends JpaRepository<RecruitmentRequest, Long> {

    Optional<RecruitmentRequest>
    findByRecReqID(String recReqID);

    boolean existsByRecReqID(String recReqID);

    List<RecruitmentRequest>
    findByDeleteStatus(Integer deleteStatus);

    List<RecruitmentRequest>
    findByCreatedBy(String createdBy);

    List<RecruitmentRequest>
    findByAssignedTo(String assignedTo);
}