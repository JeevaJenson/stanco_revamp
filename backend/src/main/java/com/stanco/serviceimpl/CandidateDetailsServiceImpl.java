package com.stanco.serviceimpl;

import com.stanco.dto.request.CandidateDetailsRequest;
import com.stanco.dto.response.CandidateDetailsResponse;
import com.stanco.entity.CandidateDetails;
import com.stanco.enums.CandidateStatus;
import com.stanco.repository.CandidateDetailsRepository;
import com.stanco.service.CandidateDetailsService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateDetailsServiceImpl
        implements CandidateDetailsService {

    private final CandidateDetailsRepository repository;


    @Override
    public CandidateDetailsResponse create(
            CandidateDetailsRequest request,
            String createdBy) {

        if (repository.existsByCdID(
                request.getCdID())) {

            throw new RuntimeException(
                    "Candidate ID already exists: "
                            + request.getCdID()
            );
        }

        CandidateDetails candidate =
                new CandidateDetails();

        BeanUtils.copyProperties(
                request,
                candidate
        );

        if (request.getStatus() == null) {

            candidate.setStatus(
                    CandidateStatus
                            .PROFILE_SUBMITTED_TO_HIRING_MANAGER
            );
        }

        candidate.setCreatedBy(
                createdBy
        );

        candidate.setCreatedAt(
                LocalDateTime.now()
        );

        candidate.setUpdatedAt(
                LocalDateTime.now()
        );

        CandidateDetails saved =
                repository.save(candidate);

        return mapToResponse(saved);
    }


    @Override
    public List<CandidateDetailsResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public CandidateDetailsResponse getById(
            Long id) {

        CandidateDetails candidate =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidate not found: "
                                                + id
                                )
                        );

        return mapToResponse(candidate);
    }


    @Override
    public CandidateDetailsResponse getByCdID(
            String cdID) {

        CandidateDetails candidate =
                repository.findByCdID(cdID)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidate not found: "
                                                + cdID
                                )
                        );

        return mapToResponse(candidate);
    }


    @Override
    public List<CandidateDetailsResponse> getByRfhNo(
            String rfhNo) {

        return repository.findByRfhNo(rfhNo)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public List<CandidateDetailsResponse> getByStatus(
            CandidateStatus status) {

        return repository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public CandidateDetailsResponse update(
            Long id,
            CandidateDetailsRequest request) {

        CandidateDetails candidate =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidate not found: "
                                                + id
                                )
                        );

        BeanUtils.copyProperties(
                request,
                candidate
        );

        if (request.getStatus() != null) {

            candidate.setStatus(
                    request.getStatus()
            );
        }

        candidate.setUpdatedAt(
                LocalDateTime.now()
        );

        CandidateDetails updated =
                repository.save(candidate);

        return mapToResponse(updated);
    }


    @Override
    public void delete(
            Long id) {

        CandidateDetails candidate =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidate not found: "
                                                + id
                                )
                        );

        repository.delete(candidate);
    }


    private CandidateDetailsResponse mapToResponse(
            CandidateDetails candidate) {

        CandidateDetailsResponse response =
                new CandidateDetailsResponse();

        BeanUtils.copyProperties(
                candidate,
                response
        );

        return response;
    }
}