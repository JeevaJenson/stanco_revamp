package com.stanco.serviceimpl;

import com.stanco.dto.request.DesignationRequest;
import com.stanco.dto.response.DesignationResponse;

import com.stanco.entity.Designation;

import com.stanco.enums.Status;

import com.stanco.repository.DesignationRepository;

import com.stanco.service.DesignationService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DesignationServiceImpl
                implements DesignationService {

        private final DesignationRepository repository;

        @Override
        public DesignationResponse create(
                        DesignationRequest request) {

                if (repository.existsByDesId(
                                request.getDesId())) {

                        throw new RuntimeException(
                                        "Designation ID already exists: "
                                                        + request.getDesId());
                }

                Designation designation = new Designation();

                designation.setDesId(
                                request.getDesId());

                designation.setName(
                                request.getName());



                designation.setStatus(
                                request.getStatus() != null
                                                ? request.getStatus()
                                                : Status.active);

                designation.setCreatedBy(
                                request.getCreatedBy());

                designation.setCreatedAt(
                                LocalDateTime.now());

                designation.setUpdatedAt(
                                LocalDateTime.now());

                Designation saved = repository.save(
                                designation);

                return mapToResponse(
                                saved);
        }



        @Override
        public List<DesignationResponse> getAll() {

                return repository
                                .findByStatus(Status.active)
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }


        @Override
        public DesignationResponse getById(
                        Long id) {

                Designation designation = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Designation not found: "
                                                                + id));

                return mapToResponse(
                                designation);
        }



        @Override
        public DesignationResponse getByDesId(
                        String desId) {

                Designation designation = repository.findByDesId(desId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Designation not found: "
                                                                + desId));

                return mapToResponse(
                                designation);
        }



        @Override
        public DesignationResponse update(
                        Long id,
                        DesignationRequest request) {

                Designation designation = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Designation not found: "
                                                                + id));

                designation.setDesId(
                                request.getDesId());

                designation.setName(
                                request.getName());

        
                if (request.getStatus() != null) {

                        designation.setStatus(
                                        request.getStatus());
                }

                designation.setUpdatedBy(
                                request.getUpdatedBy());

                designation.setUpdatedAt(
                                LocalDateTime.now());

                if (request.getStatus() == Status.active) {

                        designation.setDeletedAt(null);
                }

        

                if (request.getStatus() == Status.inactive) {

                        designation.setDeletedAt(
                                        LocalDateTime.now());
                }

                Designation updated = repository.save(
                                designation);

                return mapToResponse(
                                updated);
        }


        @Override
        public void delete(
                        Long id) {

                Designation designation = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Designation not found: "
                                                                + id));


                designation.setStatus(
                                Status.inactive);

                designation.setDeletedAt(
                                LocalDateTime.now());

                designation.setUpdatedAt(
                                LocalDateTime.now());

                repository.save(
                                designation);
        }



        private DesignationResponse mapToResponse(
                        Designation designation) {

                return new DesignationResponse(

                                designation.getId(),

                                designation.getDesId(),

                                designation.getName(),

                                designation.getStatus(),

                                designation.getCreatedBy(),

                                designation.getUpdatedBy(),

                                designation.getCreatedAt(),

                                designation.getUpdatedAt(),

                                designation.getDeletedAt());
        }
}