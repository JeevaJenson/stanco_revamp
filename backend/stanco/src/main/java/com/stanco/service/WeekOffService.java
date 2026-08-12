package com.stanco.service;

import com.stanco.dto.request.WeekOffRequest;
import com.stanco.dto.response.WeekOffResponse;

import java.util.List;

public interface WeekOffService {

    WeekOffResponse create(
            WeekOffRequest request
    );

    List<WeekOffResponse> getAll();

    WeekOffResponse getById(
            Long id
    );

    WeekOffResponse getByWeekOff(
            String weekOff
    );

    WeekOffResponse update(
            Long id,
            WeekOffRequest request
    );

    void delete(
            Long id
    );
}