package com.stanco.repository;

import com.stanco.entity.CandidateFollowupDetails;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CandidateFollowupRepository
        extends JpaRepository<
                CandidateFollowupDetails,
                Long> {

    Optional<CandidateFollowupDetails> findByCfdID(
            String cfdID
    );

    List<CandidateFollowupDetails> findByCdID(
            String cdID
    );

    List<CandidateFollowupDetails> findByRfhNo(
            String rfhNo
    );

    List<CandidateFollowupDetails> findByFollowUpStatus(
            String followUpStatus
    );

    boolean existsByCfdID(
            String cfdID
    );
}