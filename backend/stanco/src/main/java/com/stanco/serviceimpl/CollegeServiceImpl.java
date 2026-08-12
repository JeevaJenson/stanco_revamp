package com.stanco.serviceimpl;

import com.stanco.dto.request.CollegeRequest;
import com.stanco.dto.response.CollegeResponse;

import com.stanco.entity.CollegeDetails;

import com.stanco.repository.CollegeRepository;

import com.stanco.service.CollegeService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CollegeServiceImpl
        implements CollegeService {

    private final CollegeRepository repository;


    @Override
    public CollegeResponse create(
            CollegeRequest request) {

        if (repository.existsByCldID(
                request.getCldID())) {

            throw new RuntimeException(
                    "College ID already exists: "
                            + request.getCldID()
            );
        }

        CollegeDetails college =
                new CollegeDetails();

        college.setCldID(
                request.getCldID()
        );

        college.setCollegeName(
                request.getCollegeName()
        );

        college.setCreatedAt(
                LocalDateTime.now()
        );

        college.setUpdatedAt(
                LocalDateTime.now()
        );

        CollegeDetails saved =
                repository.save(college);

        return mapToResponse(saved);
    }



    @Override
    public List<CollegeResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }



    @Override
    public CollegeResponse getById(
            Integer id) {

        CollegeDetails college =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "College not found: "
                                                + id
                                )
                        );

        return mapToResponse(college);
    }



    @Override
    public CollegeResponse getByCldID(
            String cldID) {

        CollegeDetails college =
                repository.findByCldID(cldID)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "College not found: "
                                                + cldID
                                )
                        );

        return mapToResponse(college);
    }



    @Override
    public List<CollegeResponse> searchByName(
            String collegeName) {

        return repository
                .findByCollegeNameContainingIgnoreCase(
                        collegeName
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
            }

    @Override
    public CollegeResponse update(
            Integer id,
            CollegeRequest request) {

        CollegeDetails college =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "College not found: "
                                                + id
                                )
                        );

        college.setCldID(
                request.getCldID()
        );

        college.setCollegeName(
                request.getCollegeName()
        );

        college.setUpdatedAt(
                LocalDateTime.now()
        );

        CollegeDetails updated =
                repository.save(college);

        return mapToResponse(updated);
    }


    @Override
    public void delete(
            Integer id) {

        CollegeDetails college =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "College not found: "
                                                + id
                                )
                        );

        repository.delete(college);
    }


    private CollegeResponse mapToResponse(
            CollegeDetails college) {

        return new CollegeResponse(

                college.getId(),

                college.getCldID(),

                college.getCollegeName(),

                college.getCreatedAt(),

                college.getUpdatedAt()
        );
    }
}