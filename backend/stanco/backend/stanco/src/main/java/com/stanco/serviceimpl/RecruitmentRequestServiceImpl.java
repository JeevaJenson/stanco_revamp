package com.stanco.serviceimpl;

import com.stanco.dto.request.RecruitmentRequestRequest;
import com.stanco.dto.response.RecruitmentRequestResponse;

import com.stanco.entity.RecruitmentRequest;

import com.stanco.repository.RecruitmentRequestRepository;

import com.stanco.service.RecruitmentRequestService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecruitmentRequestServiceImpl
                implements RecruitmentRequestService {

        private final RecruitmentRequestRepository repository;

        @Override
        public RecruitmentRequestResponse create(
                        RecruitmentRequestRequest request) {

                if (repository.existsByRecReqID(
                                request.getRecReqID())) {

                        throw new RuntimeException(
                                        "Recruitment Request ID already exists");
                }

                RecruitmentRequest entity = new RecruitmentRequest();

                mapRequestToEntity(
                                request,
                                entity);

                entity.setCreatedAt(
                                LocalDateTime.now());

                entity.setUpdatedAt(
                                LocalDateTime.now());

                if (entity.getDeleteStatus() == null) {

                        entity.setDeleteStatus(0);
                }

                RecruitmentRequest saved = repository.save(entity);

                return mapToResponse(saved);
        }

        @Override
        public List<RecruitmentRequestResponse> getAll() {

                return repository.findAll()
                                .stream()
                                .filter(request -> request.getDeleteStatus() == null
                                                || request.getDeleteStatus() == 0)
                                .map(this::mapToResponse)
                                .toList();
        }

        @Override
        public RecruitmentRequestResponse getById(
                        Long id) {

                RecruitmentRequest entity = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Recruitment request not found: "
                                                                + id));

                return mapToResponse(entity);
        }

        @Override
        public RecruitmentRequestResponse getByRecReqID(
                        String recReqID) {

                RecruitmentRequest entity = repository.findByRecReqID(recReqID)
                                .orElseThrow(() -> new RuntimeException(
                                                "Recruitment request not found: "
                                                                + recReqID));

                return mapToResponse(entity);
        }

        @Override
        public RecruitmentRequestResponse update(
                        Long id,
                        RecruitmentRequestRequest request) {

                RecruitmentRequest entity = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Recruitment request not found: "
                                                                + id));

                mapRequestToEntity(
                                request,
                                entity);

                entity.setUpdatedAt(
                                LocalDateTime.now());

                RecruitmentRequest updated = repository.save(entity);

                return mapToResponse(updated);
        }

        @Override
        public void delete(Long id) {

                RecruitmentRequest entity = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Recruitment request not found: "
                                                                + id));

                entity.setDeleteStatus(1);

                entity.setUpdatedAt(
                                LocalDateTime.now());

                repository.save(entity);
        }

        private void mapRequestToEntity(
                        RecruitmentRequestRequest request,
                        RecruitmentRequest entity) {

                entity.setRecReqID(
                                request.getRecReqID());

                entity.setRfhNo(
                                request.getRfhNo());

                entity.setPositionTitle(
                                request.getPositionTitle());

                entity.setNoOfPosition(
                                request.getNoOfPosition());

                entity.setBand(
                                request.getBand());

                entity.setOpenDate(
                                request.getOpenDate());

                entity.setCriticalPosition(
                                request.getCriticalPosition());

                entity.setBusiness(
                                request.getBusiness());

                entity.setDivision(
                                request.getDivision());

                entity.setFunction(
                                request.getFunction());

                entity.setLocation(
                                request.getLocation());

                entity.setBillingStatus(
                                request.getBillingStatus());

                entity.setInterviewer(
                                request.getInterviewer());

                entity.setSalaryRange(
                                request.getSalaryRange());

                entity.setSalaryRangeAnnual(
                                request.getSalaryRangeAnnual());

                entity.setRequestStatus(
                                request.getRequestStatus());

                entity.setCloseDate(
                                request.getCloseDate());

                entity.setAssignedStatus(
                                request.getAssignedStatus());

                entity.setAssignedTo(
                                request.getAssignedTo());

                entity.setAssignedDate(
                                request.getAssignedDate());

                entity.setHeplRecruitmentRefNumber(
                                request.getHeplRecruitmentRefNumber());

                entity.setActionForTheDayStatus(
                                request.getActionForTheDayStatus());

                entity.setCreatedBy(
                                request.getCreatedBy());

                entity.setModifiedBy(
                                request.getModifiedBy());

                entity.setDeleteStatus(
                                request.getDeleteStatus());

                entity.setSubPositionTitle(
                                request.getSubPositionTitle());

                entity.setClosedBy(
                                request.getClosedBy());
        }

        private RecruitmentRequestResponse mapToResponse(
                        RecruitmentRequest entity) {

                return new RecruitmentRequestResponse(

                                entity.getId(),

                                entity.getRecReqID(),

                                entity.getRfhNo(),

                                entity.getPositionTitle(),

                                entity.getNoOfPosition(),

                                entity.getBand(),

                                entity.getOpenDate(),

                                entity.getCriticalPosition(),

                                entity.getBusiness(),

                                entity.getDivision(),

                                entity.getFunction(),

                                entity.getLocation(),

                                entity.getBillingStatus(),

                                entity.getInterviewer(),

                                entity.getSalaryRange(),

                                entity.getSalaryRangeAnnual(),

                                entity.getRequestStatus(),

                                entity.getCloseDate(),

                                entity.getAssignedStatus(),

                                entity.getAssignedTo(),

                                entity.getAssignedDate(),

                                entity.getHeplRecruitmentRefNumber(),

                                entity.getActionForTheDayStatus(),

                                entity.getCreatedBy(),

                                entity.getModifiedBy(),

                                entity.getCreatedAt(),

                                entity.getUpdatedAt(),

                                entity.getDeleteStatus(),

                                entity.getSubPositionTitle(),

                                entity.getClosedBy());
        }
}