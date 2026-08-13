package com.stanco.serviceimpl;

import com.stanco.dto.request.CandidateEducationRequest;
import com.stanco.dto.response.CandidateEducationResponse;

import com.stanco.entity.CandidateEducationDetails;

import com.stanco.repository.CandidateEducationRepository;

import com.stanco.service.CandidateEducationService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateEducationServiceImpl
        implements CandidateEducationService {

    private final CandidateEducationRepository repository;

    @Override
    public CandidateEducationResponse create(
            CandidateEducationRequest request) {

        CandidateEducationDetails education =
                new CandidateEducationDetails();

        BeanUtils.copyProperties(
                request,
                education
        );

        education.setCreatedOn(
                LocalDate.now()
        );

        education.setCreatedAt(
                LocalDateTime.now()
        );

        education.setUpdatedAt(
                LocalDateTime.now()
        );

        CandidateEducationDetails saved =
                repository.save(education);

        return mapToResponse(saved);
    }



    @Override
    public List<CandidateEducationResponse> getAll() {

        return repository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }



    @Override
    public CandidateEducationResponse getById(
            Long id) {

        CandidateEducationDetails education =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Education details not found: "
                                                + id
                                )
                        );

        return mapToResponse(education);
    }


    @Override
    public List<CandidateEducationResponse> getByCdID(
            String cdID) {

        return repository
                .findByCdID(cdID)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public List<CandidateEducationResponse> getByRfhNo(
            String rfhNo) {

        return repository
                .findByRfhNo(rfhNo)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public CandidateEducationResponse update(
            Long id,
            CandidateEducationRequest request) {

        CandidateEducationDetails education =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Education details not found: "
                                                + id
                                )
                        );

        BeanUtils.copyProperties(
                request,
                education
        );

        education.setUpdatedAt(
                LocalDateTime.now()
        );

        CandidateEducationDetails updated =
                repository.save(education);

        return mapToResponse(updated);
    }


    @Override
    public void delete(Long id) {

        CandidateEducationDetails education =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Education details not found: "
                                                + id
                                )
                        );

        repository.delete(education);
    }


    private CandidateEducationResponse mapToResponse(
            CandidateEducationDetails education) {

        return new CandidateEducationResponse(

                education.getId(),

                education.getCdID(),

                education.getRfhNo(),

                education.getHeplRecruitmentRefNumber(),

                education.getDegree(),

                education.getUniversity(),

                education.getEduStartMonth(),

                education.getEduStartYear(),

                education.getEduEndMonth(),

                education.getEduEndYear(),

                education.getEduCertificate(),

                education.getCreatedOn(),

                education.getCreatedAt(),

                education.getUpdatedAt()
        );
    }
}