package com.stanco.service;

import com.stanco.dto.request.RecruitmentRequestRequest;
import com.stanco.dto.response.RecruitmentRequestResponse;

import java.util.List;

public interface RecruitmentRequestService {

    RecruitmentRequestResponse create(
            RecruitmentRequestRequest request
    );

    List<RecruitmentRequestResponse> getAll();

    RecruitmentRequestResponse getById(
            Long id
    );

    RecruitmentRequestResponse getByRecReqID(
            String recReqID
    );

    RecruitmentRequestResponse update(
            Long id,
            RecruitmentRequestRequest request
    );

    void delete(Long id);
}