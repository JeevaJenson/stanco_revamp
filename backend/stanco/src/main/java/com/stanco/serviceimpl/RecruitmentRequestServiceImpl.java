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
                        RecruitmentRequestRequest request,
                        String createdBy) {

                if (repository.existsByRecReqID(
                                request.getRecReqID())) {

                        throw new RuntimeException(
                                        "Recruitment Request ID already exists");
                }

                RecruitmentRequest recruitmentRequest = new RecruitmentRequest();

                recruitmentRequest.setRecReqID(
                                request.getRecReqID());

                recruitmentRequest.setRfhNo(
                                request.getRfhNo());

                recruitmentRequest.setPositionTitle(
                                request.getPositionTitle());

                recruitmentRequest.setNoOfPosition(
                                request.getNoOfPosition());

                recruitmentRequest.setBand(
                                request.getBand());

                recruitmentRequest.setOpenDate(
                                request.getOpenDate());

                recruitmentRequest.setCriticalPosition(
                                request.getCriticalPosition());

                recruitmentRequest.setBusiness(
                                request.getBusiness());

                recruitmentRequest.setDivision(
                                request.getDivision());

                recruitmentRequest.setFunction(
                                request.getFunction());

                recruitmentRequest.setLocation(
                                request.getLocation());

                recruitmentRequest.setBillingStatus(
                                request.getBillingStatus());

                recruitmentRequest.setInterviewer(
                                request.getInterviewer());

                recruitmentRequest.setSalaryRange(
                                request.getSalaryRange());

                recruitmentRequest.setSalaryRangeAnnual(
                                request.getSalaryRangeAnnual());

                recruitmentRequest.setRequestStatus(
                                request.getRequestStatus() != null
                                                ? request.getRequestStatus()
                                                : "Open");

                recruitmentRequest.setCloseDate(
                                request.getCloseDate());

                recruitmentRequest.setAssignedStatus(
                                request.getAssignedStatus() != null
                                                ? request.getAssignedStatus()
                                                : "Unassigned");

                recruitmentRequest.setAssignedTo(
                                request.getAssignedTo());

                recruitmentRequest.setAssignedDate(
                                request.getAssignedDate());

                recruitmentRequest.setHeplRecruitmentRefNumber(
                                request.getHeplRecruitmentRefNumber());

                recruitmentRequest.setActionForTheDayStatus(
                                request.getActionForTheDayStatus());

                recruitmentRequest.setCreatedBy(
                                createdBy);

                recruitmentRequest.setModifiedBy(
                                createdBy);

                recruitmentRequest.setCreatedAt(
                                LocalDateTime.now());

                recruitmentRequest.setUpdatedAt(
                                LocalDateTime.now());

                recruitmentRequest.setDeleteStatus(
                                0);

                recruitmentRequest.setSubPositionTitle(
                                request.getSubPositionTitle());

                recruitmentRequest.setClosedBy(
                                request.getClosedBy() != null
                                                ? request.getClosedBy()
                                                : "");

                RecruitmentRequest saved = repository.save(
                                recruitmentRequest);

                return mapToResponse(saved);
        }

        @Override
        public List<RecruitmentRequestResponse> getAll() {

                return repository
                                .findByDeleteStatus(0)
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        @Override
        public RecruitmentRequestResponse getById(
                        Long id) {

                RecruitmentRequest request = repository
                                .findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Recruitment Request not found: "
                                                                + id));

                if (request.getDeleteStatus() != 0) {

                        throw new RuntimeException(
                                        "Recruitment Request is deleted");
                }

                return mapToResponse(request);
        }

        @Override
        public RecruitmentRequestResponse getByRecReqID(
                        String recReqID) {

                RecruitmentRequest request = repository
                                .findByRecReqID(recReqID)
                                .orElseThrow(() -> new RuntimeException(
                                                "Recruitment Request not found: "
                                                                + recReqID));

                if (request.getDeleteStatus() != 0) {

                        throw new RuntimeException(
                                        "Recruitment Request is deleted");
                }

                return mapToResponse(request);
        }

        @Override
        public List<RecruitmentRequestResponse> getMyRequests(String empID) {

                return repository
                                .findByCreatedBy(empID)
                                .stream()
                                .filter(request -> request.getDeleteStatus() == 0)
                                .map(this::mapToResponse)
                                .toList();
        }

        @Override
        public RecruitmentRequestResponse update(
                        Long id,
                        RecruitmentRequestRequest request,
                        String modifiedBy) {

                RecruitmentRequest existing = repository
                                .findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Recruitment Request not found: "
                                                                + id));

                if (existing.getDeleteStatus() != 0) {

                        throw new RuntimeException(
                                        "Cannot update deleted request");
                }

                existing.setRfhNo(
                                request.getRfhNo());

                existing.setPositionTitle(
                                request.getPositionTitle());

                existing.setNoOfPosition(
                                request.getNoOfPosition());

                existing.setBand(
                                request.getBand());

                existing.setOpenDate(
                                request.getOpenDate());

                existing.setCriticalPosition(
                                request.getCriticalPosition());

                existing.setBusiness(
                                request.getBusiness());

                existing.setDivision(
                                request.getDivision());

                existing.setFunction(
                                request.getFunction());

                existing.setLocation(
                                request.getLocation());

                existing.setBillingStatus(
                                request.getBillingStatus());

                existing.setInterviewer(
                                request.getInterviewer());

                existing.setSalaryRange(
                                request.getSalaryRange());

                existing.setSalaryRangeAnnual(
                                request.getSalaryRangeAnnual());

                existing.setRequestStatus(
                                request.getRequestStatus());

                existing.setCloseDate(
                                request.getCloseDate());

                existing.setAssignedStatus(
                                request.getAssignedStatus());

                existing.setAssignedTo(
                                request.getAssignedTo());

                existing.setAssignedDate(
                                request.getAssignedDate());

                existing.setHeplRecruitmentRefNumber(
                                request.getHeplRecruitmentRefNumber());

                existing.setActionForTheDayStatus(
                                request.getActionForTheDayStatus());

                existing.setSubPositionTitle(
                                request.getSubPositionTitle());

                existing.setClosedBy(
                                request.getClosedBy());

                existing.setModifiedBy(
                                modifiedBy);

                existing.setUpdatedAt(
                                LocalDateTime.now());

                RecruitmentRequest updated = repository.save(existing);

                return mapToResponse(updated);
        }

        @Override
        public void delete(
                        Long id,
                        String modifiedBy) {

                RecruitmentRequest request = repository
                                .findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Recruitment Request not found: "
                                                                + id));

                request.setDeleteStatus(
                                1);

                request.setModifiedBy(
                                modifiedBy);

                request.setUpdatedAt(
                                LocalDateTime.now());

                repository.save(request);
        }

        private RecruitmentRequestResponse mapToResponse(
                        RecruitmentRequest request) {

                return new RecruitmentRequestResponse(

                                request.getId(),

                                request.getRecReqID(),

                                request.getRfhNo(),

                                request.getPositionTitle(),

                                request.getNoOfPosition(),

                                request.getBand(),

                                request.getOpenDate(),

                                request.getCriticalPosition(),

                                request.getBusiness(),

                                request.getDivision(),

                                request.getFunction(),

                                request.getLocation(),

                                request.getBillingStatus(),

                                request.getInterviewer(),

                                request.getSalaryRange(),

                                request.getSalaryRangeAnnual(),

                                request.getRequestStatus(),

                                request.getCloseDate(),

                                request.getAssignedStatus(),

                                request.getAssignedTo(),

                                request.getAssignedDate(),

                                request.getHeplRecruitmentRefNumber(),

                                request.getActionForTheDayStatus(),

                                request.getCreatedBy(),

                                request.getModifiedBy(),

                                request.getCreatedAt(),

                                request.getUpdatedAt(),

                                request.getDeleteStatus(),

                                request.getSubPositionTitle(),

                                request.getClosedBy());
        }
}