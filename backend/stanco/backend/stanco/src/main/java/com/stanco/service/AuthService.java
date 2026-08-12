package com.stanco.service;

import com.stanco.dto.request.LoginRequest;
import com.stanco.dto.request.RegisterRequest;
import com.stanco.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(
            RegisterRequest request
    );

    AuthResponse login(
            LoginRequest request
    );
}