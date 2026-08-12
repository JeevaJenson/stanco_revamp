package com.stanco.service;

import com.stanco.dto.request.DesignationRequest;
import com.stanco.dto.response.DesignationResponse;

import java.util.List;

public interface DesignationService {

    DesignationResponse create(
            DesignationRequest request
    );


    List<DesignationResponse> getAll();


    DesignationResponse getById(
            Long id
    );


    DesignationResponse getByDesId(
            String desId
    );


    DesignationResponse update(
            Long id,
            DesignationRequest request
    );


    void delete(
            Long id
    );
}