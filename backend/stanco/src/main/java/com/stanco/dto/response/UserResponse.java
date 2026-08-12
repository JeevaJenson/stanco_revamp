package com.stanco.dto.response;

import com.stanco.enums.Status;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {

    private Long id;

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

    private Status profileStatus;

    private String team;

    private String colorCode;
}