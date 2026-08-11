package com.stanco.serviceimpl;

import com.stanco.dto.request.RfhRevenueDetailRequest;
import com.stanco.dto.response.RfhRevenueDetailResponse;

import com.stanco.entity.RfhRevenueDetail;

import com.stanco.repository.RfhRevenueDetailRepository;

import com.stanco.service.RfhRevenueDetailService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RfhRevenueDetailServiceImpl
        implements RfhRevenueDetailService {

    private final RfhRevenueDetailRepository repository;


    @Override
    public RfhRevenueDetailResponse create(
            RfhRevenueDetailRequest request,
            String createdBy) {


        RfhRevenueDetail detail =
                new RfhRevenueDetail();


        detail.setRfhNo(
                request.getRfhNo()
        );


        detail.setRevenueType(
                request.getRevenueType()
        );


        detail.setRevenuePercentage(
                request.getRevenuePercentage()
        );


        detail.setRevenueCount(
                request.getRevenueCount()
        );


        detail.setCalculatedRevenue(
                request.getCalculatedRevenue() != null
                        ? request.getCalculatedRevenue()
                        : BigDecimal.ZERO
        );


        detail.setCreatedBy(
                createdBy
        );


        detail.setCreatedAt(
                LocalDateTime.now()
        );


        RfhRevenueDetail saved =
                repository.save(detail);


        return mapToResponse(saved);
    }


    @Override
    public List<RfhRevenueDetailResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public RfhRevenueDetailResponse getById(
            Long id) {

        RfhRevenueDetail detail =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "RFH Revenue Detail not found: "
                                                + id
                                )
                        );

        return mapToResponse(detail);
    }


    @Override
    public List<RfhRevenueDetailResponse> getByRfhNo(
            String rfhNo) {

        return repository
                .findAllByRfhNo(rfhNo)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public RfhRevenueDetailResponse update(
            Long id,
            RfhRevenueDetailRequest request,
            String updatedBy) {


        RfhRevenueDetail detail =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "RFH Revenue Detail not found: "
                                                + id
                                )
                        );


        detail.setRfhNo(
                request.getRfhNo()
        );


        detail.setRevenueType(
                request.getRevenueType()
        );


        detail.setRevenuePercentage(
                request.getRevenuePercentage()
        );


        detail.setRevenueCount(
                request.getRevenueCount()
        );


        detail.setCalculatedRevenue(
                request.getCalculatedRevenue() != null
                        ? request.getCalculatedRevenue()
                        : BigDecimal.ZERO
        );


        detail.setUpdatedBy(
                updatedBy
        );


        detail.setUpdatedAt(
                LocalDateTime.now()
        );


        RfhRevenueDetail updated =
                repository.save(detail);


        return mapToResponse(updated);
    }


    @Override
    public void delete(Long id) {

        if (!repository.existsById(id)) {

            throw new RuntimeException(
                    "RFH Revenue Detail not found: " + id
            );
        }

        repository.deleteById(id);
    }


    private RfhRevenueDetailResponse mapToResponse(
            RfhRevenueDetail detail) {

        return new RfhRevenueDetailResponse(

                detail.getId(),

                detail.getRfhNo(),

                detail.getRevenueType(),

                detail.getRevenuePercentage(),

                detail.getRevenueCount(),

                detail.getCalculatedRevenue(),

                detail.getCreatedBy(),

                detail.getUpdatedBy(),

                detail.getCreatedAt(),

                detail.getUpdatedAt()
        );
    }
}