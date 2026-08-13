package com.stanco.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApprovedByResponse {

    private Long id;

    private String vertical;

    private String name;

    private String empId;

    private String status;
}