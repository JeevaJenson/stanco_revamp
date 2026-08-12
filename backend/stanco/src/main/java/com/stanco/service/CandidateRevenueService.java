package com.stanco.service;

import com.stanco.dto.request.CandidateRevenueRequest;
import com.stanco.dto.response.CandidateRevenueResponse;

import java.util.List;

public interface CandidateRevenueService {

    CandidateRevenueResponse create(
            CandidateRevenueRequest request,
            String createdBy
    );

    List<CandidateRevenueResponse> getAll();

    CandidateRevenueResponse getById(
            Long id
    );

    CandidateRevenueResponse getByCandidateAndRfh(
            String candidateId,
            String rfhNo
    );

    List<CandidateRevenueResponse> getByCandidate(
            String candidateId
    );

    List<CandidateRevenueResponse> getByRfh(
            String rfhNo
    );

    List<CandidateRevenueResponse> getByRevenueType(
            String revenueType
    );

    CandidateRevenueResponse update(
            Long id,
            CandidateRevenueRequest request
    );

    void delete(
            Long id
    );
}