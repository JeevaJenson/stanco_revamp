package com.stanco.serviceimpl;

import com.stanco.dto.request.BusinessMasterRequest;
import com.stanco.dto.response.BusinessMasterResponse;

import com.stanco.entity.BusinessMaster;

import com.stanco.repository.BusinessMasterRepository;

import com.stanco.service.BusinessMasterService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BusinessMasterServiceImpl
        implements BusinessMasterService {

    private final BusinessMasterRepository repository;


    @Override
    public BusinessMasterResponse create(
            BusinessMasterRequest request,
            String createdBy) {

        if (request.getBuId() != null &&
                repository.existsByBuId(
                        request.getBuId())) {

            throw new RuntimeException(
                    "Business ID already exists"
            );
        }

        BusinessMaster business =
                new BusinessMaster();

        business.setBuId(
                request.getBuId()
        );

        business.setBusinessName(
                request.getBusinessName()
        );

        business.setStatus(
                request.getStatus() != null
                        ? request.getStatus()
                        : "active"
        );

        business.setCreatedBy(
                createdBy
        );

        business.setCreatedAt(
                LocalDateTime.now()
        );

        business.setUpdatedAt(
                LocalDateTime.now()
        );

        BusinessMaster saved =
                repository.save(business);

        return mapToResponse(saved);
    }


    @Override
    public List<BusinessMasterResponse> getAll() {

        return repository.findAll()
                .stream()
                .filter(business ->
                        !"inactive".equalsIgnoreCase(
                                business.getStatus()
                        )
                )
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public BusinessMasterResponse getById(
            Long id) {

        BusinessMaster business =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Business not found: "
                                                + id
                                )
                        );

        return mapToResponse(business);
    }


    @Override
    public BusinessMasterResponse getByBuId(
            String buId) {

        BusinessMaster business =
                repository.findByBuId(buId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Business not found: "
                                                + buId
                        )
                        );

        return mapToResponse(business);
    }


    @Override
    public BusinessMasterResponse update(
            Long id,
            BusinessMasterRequest request,
            String updatedBy) {

        BusinessMaster business =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Business not found: "
                                                + id
                                )
                        );

        business.setBuId(
                request.getBuId()
        );

        business.setBusinessName(
                request.getBusinessName()
        );

        if (request.getStatus() != null) {

            business.setStatus(
                    request.getStatus()
            );
        }

        business.setUpdatedBy(
                updatedBy
        );

        business.setUpdatedAt(
                LocalDateTime.now()
        );

        BusinessMaster updated =
                repository.save(business);

        return mapToResponse(updated);
    }


    @Override
    public void delete(Long id) {

        BusinessMaster business =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Business not found: "
                                                + id
                                )
                        );

        business.setStatus("inactive");

        business.setDeletedAt(
                LocalDateTime.now()
        );

        business.setUpdatedAt(
                LocalDateTime.now()
        );

        repository.save(business);
    }


    private BusinessMasterResponse mapToResponse(
            BusinessMaster business) {

        return new BusinessMasterResponse(

                business.getId(),

                business.getBuId(),

                business.getBusinessName(),

                business.getStatus(),

                business.getCreatedBy(),

                business.getUpdatedBy(),

                business.getCreatedAt(),

                business.getUpdatedAt(),

                business.getDeletedAt()
        );
    }
}