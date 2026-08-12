package com.stanco.repository;

import com.stanco.entity.CandidateBenefitsDetails;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidateBenefitsRepository
        extends JpaRepository<
                CandidateBenefitsDetails,
                Long> {

    List<CandidateBenefitsDetails> findByCdID(
            String cdID
    );

    List<CandidateBenefitsDetails> findByRfhNo(
            String rfhNo
    );

    List<CandidateBenefitsDetails> findByDocType(
            String docType
    );
}