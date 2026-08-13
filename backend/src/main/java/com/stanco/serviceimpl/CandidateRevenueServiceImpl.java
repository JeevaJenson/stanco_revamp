package com.stanco.serviceimpl;

import com.stanco.dto.request.CandidateRevenueRequest;
import com.stanco.dto.response.CandidateRevenueResponse;

import com.stanco.entity.CandidateRevenueTracking;
import com.stanco.entity.CandidateRevenueTracking.RevenueType;

import com.stanco.repository.CandidateRevenueRepository;
import com.stanco.service.CandidateRevenueService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateRevenueServiceImpl
        implements CandidateRevenueService {

    private final CandidateRevenueRepository repository;

    @Override
    public CandidateRevenueResponse create(
            CandidateRevenueRequest request,
            String createdBy) {

        if (repository.existsByCandidateIdAndRfhNo(
                request.getCandidateId(),
                request.getRfhNo())) {

            throw new RuntimeException(
                    "Revenue record already exists for Candidate: "
                            + request.getCandidateId()
                            + " and RFH: "
                            + request.getRfhNo());
        }

        if (request.getRevenueAmount()
                .compareTo(BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    "Revenue amount cannot be negative");
        }

        CandidateRevenueTracking revenue = new CandidateRevenueTracking();

        revenue.setCandidateId(
                request.getCandidateId());

        revenue.setRfhNo(
                request.getRfhNo());

        revenue.setRevenueType(
                request.getRevenueType());

        revenue.setRevenueAmount(
                request.getRevenueAmount());

        revenue.setCreatedBy(
                createdBy);

        revenue.setCreatedAt(
                LocalDateTime.now());

        revenue.setUpdatedAt(
                LocalDateTime.now());

        CandidateRevenueTracking saved = repository.save(revenue);

        return mapToResponse(saved);
    }

    @Override
    public List<CandidateRevenueResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CandidateRevenueResponse getById(
            Long id) {

        CandidateRevenueTracking revenue = repository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Revenue record not found: "
                                + id));

        return mapToResponse(revenue);
    }

    @Override
    public CandidateRevenueResponse getByCandidateAndRfh(
            String candidateId,
            String rfhNo) {

        CandidateRevenueTracking revenue = repository
                .findByCandidateIdAndRfhNo(
                        candidateId,
                        rfhNo)
                .orElseThrow(() -> new RuntimeException(
                        "Revenue record not found"));

        return mapToResponse(revenue);
    }

    @Override
    public List<CandidateRevenueResponse> getByCandidate(
            String candidateId) {

        return repository
                .findByCandidateId(candidateId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<CandidateRevenueResponse> getByRfh(
            String rfhNo) {

        return repository
                .findByRfhNo(rfhNo)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<CandidateRevenueResponse> getByRevenueType(
            String revenueType) {

        RevenueType type;

        try {

            type = RevenueType.valueOf(
                    revenueType);

        } catch (IllegalArgumentException e) {

            throw new RuntimeException(
                    "Invalid revenue type. Use financial or non_financial");
        }

        return repository
                .findByRevenueType(type)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CandidateRevenueResponse update(
            Long id,
            CandidateRevenueRequest request) {

        CandidateRevenueTracking revenue = repository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Revenue record not found: "
                                + id));

        if (request.getRevenueAmount()
                .compareTo(BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    "Revenue amount cannot be negative");
        }

        revenue.setCandidateId(
                request.getCandidateId());

        revenue.setRfhNo(
                request.getRfhNo());

        revenue.setRevenueType(
                request.getRevenueType());

        revenue.setRevenueAmount(
                request.getRevenueAmount());

        revenue.setUpdatedAt(
                LocalDateTime.now());

        CandidateRevenueTracking updated = repository.save(revenue);

        return mapToResponse(updated);
    }

    @Override
    public void delete(Long id) {

        CandidateRevenueTracking revenue = repository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Revenue record not found: "
                                + id));

        repository.delete(revenue);
    }

    private CandidateRevenueResponse mapToResponse(
            CandidateRevenueTracking revenue) {

        return new CandidateRevenueResponse(

                revenue.getId(),

                revenue.getCandidateId(),

                revenue.getRfhNo(),

                revenue.getRevenueType().name(),

                revenue.getRevenueAmount(),

                revenue.getCreatedBy(),

                revenue.getCreatedAt(),

                revenue.getUpdatedAt());
    }
}