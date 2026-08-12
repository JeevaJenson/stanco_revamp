package com.stanco.dto.request;

import lombok.Data;

@Data
public class CreateUserRequest {

    private String empID;

    private String name;

    private String designation;

    private String business;

    private String department;

    private String lobDivision;

    private String supervisor;

    private String email;

    private String mobileNo;

    private String roleType;

    private String profileStatus;

    private String password;

    private String team;

    private String colorCode;
}