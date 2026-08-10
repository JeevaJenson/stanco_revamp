package com.stanco.dto;

import lombok.Data;

@Data
public class LoginRequest {

    private String empID;
    private String password;
}