package com.stanco.serviceimpl;

import com.stanco.dto.request.CandidateExperienceRequest;
import com.stanco.dto.response.CandidateExperienceResponse;

import com.stanco.entity.CandidateExperienceDetails;

import com.stanco.repository.CandidateExperienceRepository;

import com.stanco.service.CandidateExperienceService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateExperienceServiceImpl
        implements CandidateExperienceService {

    private final CandidateExperienceRepository repository;


      @Override
    public CandidateExperienceResponse create(
            CandidateExperienceRequest request) {

        CandidateExperienceDetails experience =
                new CandidateExperienceDetails();

        BeanUtils.copyProperties(
                request,
                experience
        );

        experience.setCreatedAt(
                LocalDateTime.now()
        );

        experience.setUpdatedAt(
                LocalDateTime.now()
        );

        CandidateExperienceDetails saved =
                repository.save(experience);

        return mapToResponse(saved);
    }



    @Override
    public List<CandidateExperienceResponse> getAll() {

        return repository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


  
    @Override
    public CandidateExperienceResponse getById(
            Long id) {

        CandidateExperienceDetails experience =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Experience details not found: "
                                                + id
                                )
                        );

        return mapToResponse(experience);
    }


   
    @Override
    public List<CandidateExperienceResponse> getByCdID(
            String cdID) {

        return repository
                .findByCdID(cdID)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }



    @Override
    public List<CandidateExperienceResponse> getByRfhNo(
            String rfhNo) {

        return repository
                .findByRfhNo(rfhNo)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }



    @Override
    public List<CandidateExperienceResponse> getByCompanyName(
            String companyName) {

        return repository
                .findByCompanyName(companyName)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public CandidateExperienceResponse update(
            Long id,
            CandidateExperienceRequest request) {

        CandidateExperienceDetails experience =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Experience details not found: "
                                                + id
                                )
                        );

        BeanUtils.copyProperties(
                request,
                experience
        );

        experience.setUpdatedAt(
                LocalDateTime.now()
        );

        CandidateExperienceDetails updated =
                repository.save(experience);

        return mapToResponse(updated);
    }


    
    @Override
    public void delete(Long id) {

        CandidateExperienceDetails experience =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Experience details not found: "
                                                + id
                                )
                        );

        repository.delete(experience);
    }


   
    private CandidateExperienceResponse mapToResponse(
            CandidateExperienceDetails experience) {

        return new CandidateExperienceResponse(

                experience.getId(),

                experience.getCdID(),

                experience.getRfhNo(),

                experience.getHeplRecruitmentRefNumber(),

                experience.getJobTitle(),

                experience.getCompanyName(),

                experience.getExpStartMonth(),

                experience.getExpStartYear(),

                experience.getExpEndMonth(),

                experience.getExpEndYear(),

                experience.getCertificate(),

                experience.getCreatedAt(),

                experience.getUpdatedAt()
        );
    }
}