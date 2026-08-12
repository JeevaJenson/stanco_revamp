package com.stanco.serviceimpl;

import com.stanco.dto.request.LoginRequest;
import com.stanco.dto.response.AuthResponse;
import com.stanco.entity.User;
import com.stanco.repository.UserRepository;
import com.stanco.security.JwtService;
import com.stanco.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.Authentication;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;


    @Override
    public AuthResponse login(
            LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(

                        new UsernamePasswordAuthenticationToken(
                                request.getEmpID(),
                                request.getPassword()
                        )
                );


        String empID =
                authentication.getName();


        User user =
                userRepository
                        .findByEmpID(empID)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        String token =
                jwtService.generateToken(
                        user.getEmpID(),
                        user.getName(),
                        user.getRoleType()
                );


        return new AuthResponse(

                "Login successful",

                token,

                user.getId(),

                user.getEmpID(),

                user.getName(),

                user.getRoleType()
        );
    }
}