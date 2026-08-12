package com.stanco.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CollegeResponse {

    private Integer id;

    private String cldID;

    private String collegeName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}