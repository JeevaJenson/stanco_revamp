package com.stanco.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class WeekOffResponse {

    private Long id;

    private String weekOff;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}