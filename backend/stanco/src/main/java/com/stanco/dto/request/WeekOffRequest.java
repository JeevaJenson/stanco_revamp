package com.stanco.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class WeekOffRequest {

    @NotBlank(message = "Week off is required")
    private String weekOff;
}