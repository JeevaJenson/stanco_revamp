package com.stanco.serviceimpl;

import com.stanco.dto.request.ApprovedByRequest;
import com.stanco.dto.response.ApprovedByResponse;

import com.stanco.entity.ApprovedBy;

import com.stanco.repository.ApprovedByRepository;

import com.stanco.service.ApprovedByService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApprovedByServiceImpl
        implements ApprovedByService {

    private final ApprovedByRepository repository;



    @Override
    public ApprovedByResponse create(
            ApprovedByRequest request) {

        if (repository.existsByEmpId(
                request.getEmpId())) {

            throw new RuntimeException(
                    "Employee ID already exists: "
                            + request.getEmpId()
            );
        }


        ApprovedBy approvedBy =
                new ApprovedBy();


        approvedBy.setVertical(
                request.getVertical()
        );


        approvedBy.setName(
                request.getName()
        );


        approvedBy.setEmpId(
                request.getEmpId()
        );


        approvedBy.setStatus(
                request.getStatus() != null
                        ? request.getStatus()
                        : "Active"
        );


        ApprovedBy saved =
                repository.save(approvedBy);


        return mapToResponse(saved);
    }


    @Override
    public List<ApprovedByResponse> getAll() {

        return repository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }



    @Override
    public ApprovedByResponse getById(
            Long id) {

        ApprovedBy approvedBy =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Approved By not found: "
                                                + id
                                )
                        );


        return mapToResponse(
                approvedBy
        );
    }



    @Override
    public ApprovedByResponse getByEmpId(
            String empId) {

        ApprovedBy approvedBy =
                repository
                        .findByEmpId(empId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Employee not found: "
                                                + empId
                                )
                        );


        return mapToResponse(
                approvedBy
        );
    }



    @Override
    public List<ApprovedByResponse> getByVertical(
            String vertical) {

        return repository
                .findByVertical(vertical)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public ApprovedByResponse update(
            Long id,
            ApprovedByRequest request) {

        ApprovedBy approvedBy =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Approved By not found: "
                                                + id
                                )
                        );


        approvedBy.setVertical(
                request.getVertical()
        );


        approvedBy.setName(
                request.getName()
        );


        approvedBy.setEmpId(
                request.getEmpId()
        );


        if (request.getStatus() != null) {

            approvedBy.setStatus(
                    request.getStatus()
            );
        }


        ApprovedBy updated =
                repository.save(
                        approvedBy
                );


        return mapToResponse(
                updated
        );
    }


    @Override
    public void delete(
            Long id) {

        ApprovedBy approvedBy =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Approved By not found: "
                                                + id
                                )
                        );


        repository.delete(
                approvedBy
        );
    }
  

    private ApprovedByResponse mapToResponse(
            ApprovedBy approvedBy) {

        return new ApprovedByResponse(

                approvedBy.getId(),

                approvedBy.getVertical(),

                approvedBy.getName(),

                approvedBy.getEmpId(),

                approvedBy.getStatus()
        );
    }
}