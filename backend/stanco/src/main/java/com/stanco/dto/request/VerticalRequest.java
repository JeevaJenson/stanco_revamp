package com.stanco.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class VerticalRequest {

    @NotBlank(message = "Vertical name is required")
    private String verticalName;
}