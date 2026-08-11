package com.stanco.dto.request;

import lombok.Data;

@Data
public class DepartmentRequest {

    private String depId;

    private String name;

    private String status;

    private String createdBy;

    private String updatedBy;
}