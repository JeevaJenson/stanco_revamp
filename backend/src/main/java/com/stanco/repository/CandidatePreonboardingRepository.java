package com.stanco.repository;

import com.stanco.entity.CandidatePreonboarding;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidatePreonboardingRepository
        extends JpaRepository<
                CandidatePreonboarding,
                Long> {

    List<CandidatePreonboarding> findByEmpId(
            String empId
    );

    List<CandidatePreonboarding> findByRecruiterId(
            String recruiterId
    );

    List<CandidatePreonboarding>
    findByPreonboardingProcess(
            String preonboardingProcess
    );

    List<CandidatePreonboarding> findByType(
            Integer type
    );
}