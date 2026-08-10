package com.stanco.dto;

import lombok.Data;

@Data
public class RegisterRequest {

    private String empID;
    private String name;
    private String email;
    private String mobileNo;
    private String password;
}