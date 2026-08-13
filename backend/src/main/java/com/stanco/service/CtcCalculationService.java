package com.stanco.service;

import com.stanco.dto.request.CtcCalculationRequest;
import com.stanco.dto.response.CtcCalculationResponse;

import java.util.List;

public interface CtcCalculationService {

    CtcCalculationResponse create(
            CtcCalculationRequest request,
            String createdBy
    );

    List<CtcCalculationResponse> getAll();

    CtcCalculationResponse getById(Long id);

    CtcCalculationResponse getByCtcID(
            String ctcID
    );

    List<CtcCalculationResponse> getByCdID(
            String cdID
    );

    List<CtcCalculationResponse> getByRfhNo(
            String rfhNo
    );

    CtcCalculationResponse update(
            Long id,
            CtcCalculationRequest request,
            String modifiedBy
    );

    void delete(Long id);
}