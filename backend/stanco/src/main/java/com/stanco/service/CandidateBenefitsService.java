package com.stanco.service;

import com.stanco.dto.request.CandidateBenefitsRequest;
import com.stanco.dto.response.CandidateBenefitsResponse;

import java.util.List;

public interface CandidateBenefitsService {

    CandidateBenefitsResponse create(
            CandidateBenefitsRequest request
    );

    List<CandidateBenefitsResponse> getAll();

    CandidateBenefitsResponse getById(
            Long id
    );

    List<CandidateBenefitsResponse> getByCdID(
            String cdID
    );

    List<CandidateBenefitsResponse> getByRfhNo(
            String rfhNo
    );

    List<CandidateBenefitsResponse> getByDocType(
            String docType
    );

    CandidateBenefitsResponse update(
            Long id,
            CandidateBenefitsRequest request
    );

    void delete(
            Long id
    );
}