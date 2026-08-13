package com.stanco.service;

import com.stanco.dto.request.CandidatePreonboardingRequest;
import com.stanco.dto.response.CandidatePreonboardingResponse;

import java.util.List;

public interface CandidatePreonboardingService {

    CandidatePreonboardingResponse create(
            CandidatePreonboardingRequest request
    );

    List<CandidatePreonboardingResponse> getAll();

    CandidatePreonboardingResponse getById(
            Long id
    );

    List<CandidatePreonboardingResponse> getByEmpId(
            String empId
    );

    List<CandidatePreonboardingResponse> getByRecruiterId(
            String recruiterId
    );

    List<CandidatePreonboardingResponse>
    getByPreonboardingProcess(
            String process
    );

    List<CandidatePreonboardingResponse> getByType(
            Integer type
    );

    CandidatePreonboardingResponse update(
            Long id,
            CandidatePreonboardingRequest request
    );

    void delete(
            Long id
    );
}