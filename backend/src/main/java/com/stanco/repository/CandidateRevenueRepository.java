package com.stanco.repository;

import com.stanco.entity.CandidateRevenueTracking;
import com.stanco.entity.CandidateRevenueTracking.RevenueType;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CandidateRevenueRepository
        extends JpaRepository<
                CandidateRevenueTracking,
                Long> {

    Optional<CandidateRevenueTracking>
    findByCandidateIdAndRfhNo(
            String candidateId,
            String rfhNo
    );

    List<CandidateRevenueTracking>
    findByCandidateId(
            String candidateId
    );

    List<CandidateRevenueTracking>
    findByRfhNo(
            String rfhNo
    );

    List<CandidateRevenueTracking>
    findByRevenueType(
            RevenueType revenueType
    );

    boolean existsByCandidateIdAndRfhNo(
            String candidateId,
            String rfhNo
    );
}