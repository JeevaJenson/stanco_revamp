package com.stanco.service;

import com.stanco.dto.request.CandidateDetailsRequest;
import com.stanco.dto.response.CandidateDetailsResponse;

import java.util.List;

public interface CandidateDetailsService {

    CandidateDetailsResponse create(
            CandidateDetailsRequest request,
            String createdBy
    );

    List<CandidateDetailsResponse> getAll();

    CandidateDetailsResponse getById(
            Long id
    );

    CandidateDetailsResponse getByCdID(
            String cdID
    );

    List<CandidateDetailsResponse> getByRfhNo(
            String rfhNo
    );

    List<CandidateDetailsResponse> getByStatus(
            String status
    );

    CandidateDetailsResponse update(
            Long id,
            CandidateDetailsRequest request
    );

    void delete(
            Long id
    );
}