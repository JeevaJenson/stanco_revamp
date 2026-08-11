package com.stanco.dto.request;

import com.stanco.enums.Status;

import lombok.Data;

@Data
public class DepartmentRequest {

    private String depId;

    private String name;

    private Status status;

    private String createdBy;

    private String updatedBy;
}