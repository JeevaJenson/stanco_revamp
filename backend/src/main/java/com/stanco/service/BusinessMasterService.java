package com.stanco.service;

import com.stanco.dto.request.BusinessMasterRequest;
import com.stanco.dto.response.BusinessMasterResponse;

import java.util.List;

public interface BusinessMasterService {

    BusinessMasterResponse create(
            BusinessMasterRequest request,
            String createdBy
    );

    List<BusinessMasterResponse> getAll();

    BusinessMasterResponse getById(Long id);

    BusinessMasterResponse getByBuId(String buId);

    BusinessMasterResponse update(
            Long id,
            BusinessMasterRequest request,
            String updatedBy
    );

    void delete(Long id);
}