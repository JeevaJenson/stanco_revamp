package com.stanco.service;

import com.stanco.dto.request.DepartmentRequest;
import com.stanco.dto.response.DepartmentResponse;

import java.util.List;

public interface DepartmentService {

    DepartmentResponse create(
            DepartmentRequest request
    );

    List<DepartmentResponse> getAll();

    DepartmentResponse getById(
            Long id
    );

    DepartmentResponse getByDepId(
            String depId
    );

    DepartmentResponse update(
            Long id,
            DepartmentRequest request
    );

    void delete(
            Long id
    );
}