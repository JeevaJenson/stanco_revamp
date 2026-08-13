package com.stanco.service;

import com.stanco.dto.request.CandidateFollowupRequest;
import com.stanco.dto.response.CandidateFollowupResponse;

import java.util.List;

public interface CandidateFollowupService {

    CandidateFollowupResponse create(
            CandidateFollowupRequest request,
            String createdBy
    );

    List<CandidateFollowupResponse> getAll();

    CandidateFollowupResponse getById(
            Long id
    );

    CandidateFollowupResponse getByCfdID(
            String cfdID
    );

    List<CandidateFollowupResponse> getByCdID(
            String cdID
    );

    List<CandidateFollowupResponse> getByRfhNo(
            String rfhNo
    );

    List<CandidateFollowupResponse> getByStatus(
            String status
    );

    CandidateFollowupResponse update(
            Long id,
            CandidateFollowupRequest request
    );

    void delete(
            Long id
    );
}