package com.stanco.service;

import com.stanco.dto.request.CandidateEducationRequest;
import com.stanco.dto.response.CandidateEducationResponse;

import java.util.List;

public interface CandidateEducationService {

    CandidateEducationResponse create(
            CandidateEducationRequest request
    );

    List<CandidateEducationResponse> getAll();

    CandidateEducationResponse getById(
            Long id
    );

    List<CandidateEducationResponse> getByCdID(
            String cdID
    );

    List<CandidateEducationResponse> getByRfhNo(
            String rfhNo
    );

    CandidateEducationResponse update(
            Long id,
            CandidateEducationRequest request
    );

    void delete(
            Long id
    );
}