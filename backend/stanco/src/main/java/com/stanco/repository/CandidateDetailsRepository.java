package com.stanco.repository;

import com.stanco.entity.CandidateDetails;
import com.stanco.enums.CandidateStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CandidateDetailsRepository
        extends JpaRepository<CandidateDetails, Long> {

    Optional<CandidateDetails> findByCdID(
            String cdID
    );

    List<CandidateDetails> findByRfhNo(
            String rfhNo
    );

    List<CandidateDetails> findByStatus(
            CandidateStatus status
    );

    List<CandidateDetails> findByCandidateEmail(
            String candidateEmail
    );

    boolean existsByCdID(
            String cdID
    );
}