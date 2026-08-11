package com.stanco.serviceimpl;

import com.stanco.dto.request.VerticalRequest;
import com.stanco.dto.response.VerticalResponse;

import com.stanco.entity.Vertical;

import com.stanco.repository.VerticalRepository;

import com.stanco.service.VerticalService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VerticalServiceImpl
        implements VerticalService {

    private final VerticalRepository repository;
 

    @Override
    public VerticalResponse create(
            VerticalRequest request) {

        if (repository.existsByVerticalName(
                request.getVerticalName())) {

            throw new RuntimeException(
                    "Vertical already exists: "
                            + request.getVerticalName()
            );
        }


        Vertical vertical =
                new Vertical();


        vertical.setVerticalName(
                request.getVerticalName()
        );


        vertical.setCreatedAt(
                LocalDateTime.now()
        );


        vertical.setUpdatedAt(
                LocalDateTime.now()
        );


        Vertical saved =
                repository.save(vertical);


        return mapToResponse(saved);
    }


    @Override
    public List<VerticalResponse> getAll() {

        return repository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }



    @Override
    public VerticalResponse getById(
            Long id) {

        Vertical vertical =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Vertical not found: "
                                                + id
                                )
                        );


        return mapToResponse(vertical);
    }


   

    @Override
    public VerticalResponse getByName(
            String verticalName) {

        Vertical vertical =
                repository
                        .findByVerticalName(
                                verticalName
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Vertical not found: "
                                                + verticalName
                                )
                        );


        return mapToResponse(vertical);
    }


    @Override
    public VerticalResponse update(
            Long id,
            VerticalRequest request) {

        Vertical vertical =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Vertical not found: "
                                                + id
                                )
                        );


        if (!vertical.getVerticalName()
                .equals(request.getVerticalName())
                &&
                repository.existsByVerticalName(
                        request.getVerticalName())) {

            throw new RuntimeException(
                    "Vertical already exists: "
                            + request.getVerticalName()
            );
        }


        vertical.setVerticalName(
                request.getVerticalName()
        );


        vertical.setUpdatedAt(
                LocalDateTime.now()
        );


        Vertical updated =
                repository.save(vertical);


        return mapToResponse(updated);
    }


    @Override
    public void delete(
            Long id) {

        Vertical vertical =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Vertical not found: "
                                                + id
                                )
                        );


        repository.delete(vertical);
    }



    private VerticalResponse mapToResponse(
            Vertical vertical) {

        return new VerticalResponse(

                vertical.getId(),

                vertical.getVerticalName(),

                vertical.getCreatedAt(),

                vertical.getUpdatedAt()
        );
    }
}