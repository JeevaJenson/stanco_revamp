package com.stanco.service;

import com.stanco.dto.request.RecruitmentRequestRequest;
import com.stanco.dto.response.RecruitmentRequestResponse;

import java.util.List;

public interface RecruitmentRequestService {

    RecruitmentRequestResponse create(
            RecruitmentRequestRequest request,
            String createdBy
    );

    List<RecruitmentRequestResponse> getAll();

    RecruitmentRequestResponse getById(
            Long id
    );

    RecruitmentRequestResponse getByRecReqID(
            String recReqID
    );

    List<RecruitmentRequestResponse> getMyRequests(
            String empID
    );

    RecruitmentRequestResponse update(
            Long id,
            RecruitmentRequestRequest request,
            String modifiedBy
    );

    void delete(
            Long id,
            String modifiedBy
    );
}