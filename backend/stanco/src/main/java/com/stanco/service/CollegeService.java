package com.stanco.service;

import com.stanco.dto.request.CollegeRequest;
import com.stanco.dto.response.CollegeResponse;

import java.util.List;

public interface CollegeService {

    CollegeResponse create(
            CollegeRequest request
    );

    List<CollegeResponse> getAll();

    CollegeResponse getById(
            Integer id
    );

    CollegeResponse getByCldID(
            String cldID
    );

    List<CollegeResponse> searchByName(
            String collegeName
    );

    CollegeResponse update(
            Integer id,
            CollegeRequest request
    );

    void delete(
            Integer id
    );
}