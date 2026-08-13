package com.stanco.repository;

import com.stanco.entity.CandidateEducationDetails;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CandidateEducationRepository
        extends JpaRepository<CandidateEducationDetails, Long> {

    List<CandidateEducationDetails> findByCdID(
            String cdID
    );

    List<CandidateEducationDetails> findByRfhNo(
            String rfhNo
    );

    Optional<CandidateEducationDetails> findByIdAndCdID(
            Long id,
            String cdID
    );
}