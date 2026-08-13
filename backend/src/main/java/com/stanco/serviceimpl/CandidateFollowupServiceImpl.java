package com.stanco.serviceimpl;

import com.stanco.dto.request.CandidateFollowupRequest;
import com.stanco.dto.response.CandidateFollowupResponse;

import com.stanco.entity.CandidateFollowupDetails;

import com.stanco.repository.CandidateFollowupRepository;

import com.stanco.service.CandidateFollowupService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateFollowupServiceImpl
        implements CandidateFollowupService {

    private final CandidateFollowupRepository repository;



    @Override
    public CandidateFollowupResponse create(
            CandidateFollowupRequest request,
            String createdBy) {

        if (repository.existsByCfdID(
                request.getCfdID())) {

            throw new RuntimeException(
                    "Followup ID already exists: "
                            + request.getCfdID()
            );
        }

        CandidateFollowupDetails followup =
                new CandidateFollowupDetails();

        followup.setCfdID(
                request.getCfdID()
        );

        followup.setCdID(
                request.getCdID()
        );

        followup.setRfhNo(
                request.getRfhNo()
        );

        followup.setFollowUpStatus(
                request.getFollowUpStatus()
        );

        followup.setCreatedOn(
                LocalDate.now()
        );

        followup.setCreatedBy(
                createdBy
        );

        followup.setCreatedAt(
                LocalDateTime.now()
        );

        followup.setUpdatedAt(
                LocalDateTime.now()
        );

        CandidateFollowupDetails saved =
                repository.save(followup);

        return mapToResponse(saved);
    }


    @Override
    public List<CandidateFollowupResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public CandidateFollowupResponse getById(
            Long id) {

        CandidateFollowupDetails followup =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Followup not found: "
                                                + id
                                )
                        );

        return mapToResponse(followup);
    }


    // ==========================================
    // GET BY CFD ID
    // ==========================================

    @Override
    public CandidateFollowupResponse getByCfdID(
            String cfdID) {

        CandidateFollowupDetails followup =
                repository.findByCfdID(cfdID)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Followup not found: "
                                                + cfdID
                                )
                        );

        return mapToResponse(followup);
    }



    @Override
    public List<CandidateFollowupResponse> getByCdID(
            String cdID) {

        return repository.findByCdID(cdID)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }




    @Override
    public List<CandidateFollowupResponse> getByRfhNo(
            String rfhNo) {

        return repository.findByRfhNo(rfhNo)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }



    @Override
    public List<CandidateFollowupResponse> getByStatus(
            String status) {

        return repository
                .findByFollowUpStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public CandidateFollowupResponse update(
            Long id,
            CandidateFollowupRequest request) {

        CandidateFollowupDetails followup =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Followup not found: "
                                                + id
                                )
                        );

        followup.setCfdID(
                request.getCfdID()
        );

        followup.setCdID(
                request.getCdID()
        );

        followup.setRfhNo(
                request.getRfhNo()
        );

        followup.setFollowUpStatus(
                request.getFollowUpStatus()
        );

        followup.setUpdatedAt(
                LocalDateTime.now()
        );

        CandidateFollowupDetails updated =
                repository.save(followup);

        return mapToResponse(updated);
    }



    @Override
    public void delete(Long id) {

        CandidateFollowupDetails followup =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Followup not found: "
                                                + id
                                )
                        );

        repository.delete(followup);
    }


    private CandidateFollowupResponse mapToResponse(
            CandidateFollowupDetails followup) {

        return new CandidateFollowupResponse(

                followup.getId(),

                followup.getCfdID(),

                followup.getCdID(),

                followup.getRfhNo(),

                followup.getFollowUpStatus(),

                followup.getCreatedOn(),

                followup.getCreatedBy(),

                followup.getCreatedAt(),

                followup.getUpdatedAt()
        );
    }
}