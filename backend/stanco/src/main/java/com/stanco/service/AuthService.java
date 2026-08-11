package com.stanco.service;

import com.stanco.dto.request.LoginRequest;
import com.stanco.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse login(
            LoginRequest request
    );
}