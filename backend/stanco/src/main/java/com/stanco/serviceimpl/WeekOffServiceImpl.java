package com.stanco.serviceimpl;

import com.stanco.dto.request.WeekOffRequest;
import com.stanco.dto.response.WeekOffResponse;

import com.stanco.entity.WeekOff;

import com.stanco.repository.WeekOffRepository;

import com.stanco.service.WeekOffService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WeekOffServiceImpl
        implements WeekOffService {

    private final WeekOffRepository repository;

    // CREATE
    // ==========================================

    @Override
    public WeekOffResponse create(
            WeekOffRequest request) {

        if (repository.existsByWeekOff(
                request.getWeekOff())) {

            throw new RuntimeException(
                    "Week off already exists: "
                            + request.getWeekOff()
            );
        }

        WeekOff weekOff =
                new WeekOff();

        weekOff.setWeekOff(
                request.getWeekOff()
        );

        weekOff.setCreatedAt(
                LocalDateTime.now()
        );

        weekOff.setUpdatedAt(
                LocalDateTime.now()
        );

        WeekOff saved =
                repository.save(weekOff);

        return mapToResponse(saved);
    }



    @Override
    public List<WeekOffResponse> getAll() {

        return repository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public WeekOffResponse getById(
            Long id) {

        WeekOff weekOff =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Week off not found: "
                                                + id
                                )
                        );

        return mapToResponse(weekOff);
    }


    @Override
    public WeekOffResponse getByWeekOff(
            String weekOff) {

        WeekOff result =
                repository
                        .findByWeekOff(weekOff)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Week off not found: "
                                                + weekOff
                                )
                        );

        return mapToResponse(result);
    }


    @Override
    public WeekOffResponse update(
            Long id,
            WeekOffRequest request) {

        WeekOff weekOff =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Week off not found: "
                                                + id
                                )
                        );

        if (!weekOff.getWeekOff()
                .equals(request.getWeekOff())
                &&
                repository.existsByWeekOff(
                        request.getWeekOff())) {

            throw new RuntimeException(
                    "Week off already exists: "
                            + request.getWeekOff()
            );
        }

        weekOff.setWeekOff(
                request.getWeekOff()
        );

        weekOff.setUpdatedAt(
                LocalDateTime.now()
        );

        WeekOff updated =
                repository.save(weekOff);

        return mapToResponse(updated);
    }



    @Override
    public void delete(
            Long id) {

        WeekOff weekOff =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Week off not found: "
                                                + id
                                )
                        );

        repository.delete(weekOff);
    }
   

    private WeekOffResponse mapToResponse(
            WeekOff weekOff) {

        return new WeekOffResponse(

                weekOff.getId(),

                weekOff.getWeekOff(),

                weekOff.getCreatedAt(),

                weekOff.getUpdatedAt()
        );
    }
}