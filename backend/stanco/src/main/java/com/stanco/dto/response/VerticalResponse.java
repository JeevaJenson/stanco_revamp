package com.stanco.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class VerticalResponse {

    private Long id;

    private String verticalName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}