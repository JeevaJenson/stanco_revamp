package com.stanco.service;

import com.stanco.dto.request.RfhRevenueDetailRequest;
import com.stanco.dto.response.RfhRevenueDetailResponse;

import java.util.List;

public interface RfhRevenueDetailService {

    RfhRevenueDetailResponse create(
            RfhRevenueDetailRequest request,
            String createdBy
    );

    List<RfhRevenueDetailResponse> getAll();

    RfhRevenueDetailResponse getById(
            Long id
    );

    List<RfhRevenueDetailResponse> getByRfhNo(
            String rfhNo
    );

    RfhRevenueDetailResponse update(
            Long id,
            RfhRevenueDetailRequest request,
            String updatedBy
    );

    void delete(Long id);
}