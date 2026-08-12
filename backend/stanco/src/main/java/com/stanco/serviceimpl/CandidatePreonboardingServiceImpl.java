package com.stanco.serviceimpl;

import com.stanco.dto.request.CandidatePreonboardingRequest;
import com.stanco.dto.response.CandidatePreonboardingResponse;

import com.stanco.entity.CandidatePreonboarding;

import com.stanco.repository.CandidatePreonboardingRepository;

import com.stanco.service.CandidatePreonboardingService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidatePreonboardingServiceImpl
        implements CandidatePreonboardingService {

    private final CandidatePreonboardingRepository repository;


    @Override
    public CandidatePreonboardingResponse create(
            CandidatePreonboardingRequest request) {

        CandidatePreonboarding preonboarding =
                new CandidatePreonboarding();

        preonboarding.setEmpId(
                request.getEmpId()
        );

        preonboarding.setRecruiterId(
                request.getRecruiterId()
        );

        preonboarding.setPreonboardingProcess(
                request.getPreonboardingProcess()
        );

        preonboarding.setType(
                request.getType()
        );

        preonboarding.setDate(
                request.getDate()
        );

        preonboarding.setCreatedAt(
                LocalDateTime.now()
        );

        preonboarding.setUpdatedAt(
                LocalDateTime.now()
        );

        CandidatePreonboarding saved =
                repository.save(preonboarding);

        return mapToResponse(saved);
    }



    @Override
    public List<CandidatePreonboardingResponse>
    getAll() {

        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }



    @Override
    public CandidatePreonboardingResponse
    getById(Long id) {

        CandidatePreonboarding preonboarding =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Pre-onboarding record not found: "
                                                + id
                                )
                        );

        return mapToResponse(preonboarding);
    }



    @Override
    public List<CandidatePreonboardingResponse>
    getByEmpId(String empId) {

        return repository.findByEmpId(empId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }




    @Override
    public List<CandidatePreonboardingResponse>
    getByRecruiterId(String recruiterId) {

        return repository.findByRecruiterId(
                        recruiterId
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }



    @Override
    public List<CandidatePreonboardingResponse>
    getByPreonboardingProcess(
            String process) {

        return repository
                .findByPreonboardingProcess(process)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }



    @Override
    public List<CandidatePreonboardingResponse>
    getByType(Integer type) {

        return repository.findByType(type)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public CandidatePreonboardingResponse update(
            Long id,
            CandidatePreonboardingRequest request) {

        CandidatePreonboarding preonboarding =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Pre-onboarding record not found: "
                                                + id
                                )
                        );

        preonboarding.setEmpId(
                request.getEmpId()
        );

        preonboarding.setRecruiterId(
                request.getRecruiterId()
        );

        preonboarding.setPreonboardingProcess(
                request.getPreonboardingProcess()
        );

        preonboarding.setType(
                request.getType()
        );

        preonboarding.setDate(
                request.getDate()
        );

        preonboarding.setUpdatedAt(
                LocalDateTime.now()
        );

        CandidatePreonboarding updated =
                repository.save(preonboarding);

        return mapToResponse(updated);
    }


    @Override
    public void delete(Long id) {

        CandidatePreonboarding preonboarding =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Pre-onboarding record not found: "
                                                + id
                                )
                        );

        repository.delete(preonboarding);
    }



    private CandidatePreonboardingResponse
    mapToResponse(
            CandidatePreonboarding preonboarding) {

        return new CandidatePreonboardingResponse(

                preonboarding.getId(),

                preonboarding.getEmpId(),

                preonboarding.getRecruiterId(),

                preonboarding.getPreonboardingProcess(),

                preonboarding.getType(),

                preonboarding.getDate(),

                preonboarding.getCreatedAt(),

                preonboarding.getUpdatedAt()
        );
    }
}