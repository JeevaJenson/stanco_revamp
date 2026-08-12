package com.stanco.service;

import com.stanco.dto.request.CandidateExperienceRequest;
import com.stanco.dto.response.CandidateExperienceResponse;

import java.util.List;

public interface CandidateExperienceService {

    CandidateExperienceResponse create(
            CandidateExperienceRequest request
    );

    List<CandidateExperienceResponse> getAll();

    CandidateExperienceResponse getById(
            Long id
    );

    List<CandidateExperienceResponse> getByCdID(
            String cdID
    );

    List<CandidateExperienceResponse> getByRfhNo(
            String rfhNo
    );

    List<CandidateExperienceResponse> getByCompanyName(
            String companyName
    );

    CandidateExperienceResponse update(
            Long id,
            CandidateExperienceRequest request
    );

    void delete(
            Long id
    );
}