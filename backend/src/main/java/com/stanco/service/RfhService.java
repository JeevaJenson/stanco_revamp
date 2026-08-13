package com.stanco.service;

import com.stanco.dto.request.RfhRequest;
import com.stanco.dto.response.RfhResponse;

import java.util.List;

public interface RfhService {

    RfhResponse create(
            RfhRequest request,
            String requestBy
    );

    List<RfhResponse> getAll();

    RfhResponse getById(
            Long id
    );

    RfhResponse getByResId(
            String resId
    );

    List<RfhResponse> getMyRfh(
            String requestBy
    );

    RfhResponse update(
            Long id,
            RfhRequest request
    );

    void delete(
            Long id,
            String remark
    );
}