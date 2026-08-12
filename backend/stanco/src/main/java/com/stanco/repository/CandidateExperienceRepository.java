package com.stanco.repository;

import com.stanco.entity.CandidateExperienceDetails;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidateExperienceRepository
        extends JpaRepository<
                CandidateExperienceDetails,
                Long> {

    List<CandidateExperienceDetails> findByCdID(
            String cdID
    );

    List<CandidateExperienceDetails> findByRfhNo(
            String rfhNo
    );

    List<CandidateExperienceDetails> findByCompanyName(
            String companyName
    );
}