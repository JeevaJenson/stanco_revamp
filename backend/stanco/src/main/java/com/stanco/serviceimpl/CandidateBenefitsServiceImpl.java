package com.stanco.serviceimpl;

import com.stanco.dto.request.CandidateBenefitsRequest;
import com.stanco.dto.response.CandidateBenefitsResponse;

import com.stanco.entity.CandidateBenefitsDetails;

import com.stanco.repository.CandidateBenefitsRepository;

import com.stanco.service.CandidateBenefitsService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateBenefitsServiceImpl
        implements CandidateBenefitsService {

    private final CandidateBenefitsRepository repository;


    @Override
    public CandidateBenefitsResponse create(
            CandidateBenefitsRequest request) {

        CandidateBenefitsDetails benefits =
                new CandidateBenefitsDetails();

        benefits.setCdID(
                request.getCdID()
        );

        benefits.setRfhNo(
                request.getRfhNo()
        );

        benefits.setHeplRecruitmentRefNumber(
                request.getHeplRecruitmentRefNumber()
        );

        benefits.setDocType(
                request.getDocType()
        );

        benefits.setDocFilename(
                request.getDocFilename()
        );

        benefits.setCreatedOn(
                LocalDate.now()
        );

        benefits.setCreatedAt(
                LocalDateTime.now()
        );

        benefits.setUpdatedAt(
                LocalDateTime.now()
        );

        CandidateBenefitsDetails saved =
                repository.save(benefits);

        return mapToResponse(saved);
    }


    @Override
    public List<CandidateBenefitsResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public CandidateBenefitsResponse getById(
            Long id) {

        CandidateBenefitsDetails benefits =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidate benefit not found: "
                                                + id
                                )
                        );

        return mapToResponse(benefits);
    }


    @Override
    public List<CandidateBenefitsResponse> getByCdID(
            String cdID) {

        return repository.findByCdID(cdID)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public List<CandidateBenefitsResponse> getByRfhNo(
            String rfhNo) {

        return repository.findByRfhNo(rfhNo)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }



    @Override
    public List<CandidateBenefitsResponse> getByDocType(
            String docType) {

        return repository.findByDocType(docType)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public CandidateBenefitsResponse update(
            Long id,
            CandidateBenefitsRequest request) {

        CandidateBenefitsDetails benefits =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidate benefit not found: "
                                                + id
                                )
                        );

        benefits.setCdID(
                request.getCdID()
        );

        benefits.setRfhNo(
                request.getRfhNo()
        );

        benefits.setHeplRecruitmentRefNumber(
                request.getHeplRecruitmentRefNumber()
        );

        benefits.setDocType(
                request.getDocType()
        );

        benefits.setDocFilename(
                request.getDocFilename()
        );

        benefits.setUpdatedAt(
                LocalDateTime.now()
        );

        CandidateBenefitsDetails updated =
                repository.save(benefits);

        return mapToResponse(updated);
    }


    @Override
    public void delete(Long id) {

        CandidateBenefitsDetails benefits =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidate benefit not found: "
                                                + id
                                )
                        );

        repository.delete(benefits);
    }


    private CandidateBenefitsResponse mapToResponse(
            CandidateBenefitsDetails benefits) {

        return new CandidateBenefitsResponse(

                benefits.getId(),

                benefits.getCdID(),

                benefits.getRfhNo(),

                benefits.getHeplRecruitmentRefNumber(),

                benefits.getDocType(),

                benefits.getDocFilename(),

                benefits.getCreatedOn(),

                benefits.getCreatedAt(),

                benefits.getUpdatedAt()
        );
    }
}