package com.stanco.service;

import com.stanco.dto.request.ApprovedByRequest;
import com.stanco.dto.response.ApprovedByResponse;

import java.util.List;

public interface ApprovedByService {

    ApprovedByResponse create(
            ApprovedByRequest request
    );

    List<ApprovedByResponse> getAll();

    ApprovedByResponse getById(
            Long id
    );

    ApprovedByResponse getByEmpId(
            String empId
    );

    List<ApprovedByResponse> getByVertical(
            String vertical
    );

    ApprovedByResponse update(
            Long id,
            ApprovedByRequest request
    );

    void delete(
            Long id
    );
}