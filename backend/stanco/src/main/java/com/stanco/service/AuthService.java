package com.stanco.service;

import com.stanco.dto.AuthResponse;
import com.stanco.dto.LoginRequest;
import com.stanco.dto.RegisterRequest;
import com.stanco.entity.User;
import com.stanco.repository.UserRepository;
import com.stanco.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmpID(request.getEmpID())) {

            throw new RuntimeException(
                    "Employee ID already exists"
            );
        }

        if (userRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }

        User user = new User();

        user.setEmpID(request.getEmpID());

        user.setName(request.getName());

        user.setEmail(request.getEmail());

        user.setMobileNo(request.getMobileNo());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setDesignation("Employee");

        user.setRoleType("employee");

        user.setProfileStatus("Active");

        user.setTeam("");

        user.setColorCode("");

        user.setCreatedAt(
                LocalDateTime.now()
        );

        user.setUpdatedAt(
                LocalDateTime.now()
        );

        User savedUser =
                userRepository.save(user);

        String token =
                jwtService.generateToken(
                        savedUser.getEmpID(),
                        savedUser.getName(),
                        savedUser.getRoleType()
                );

        return new AuthResponse(

                "Registration successful",

                token,

                savedUser.getId(),

                savedUser.getEmpID(),

                savedUser.getName(),

                savedUser.getRoleType()
        );
    }

    public AuthResponse login(LoginRequest request) {

        User user =
                userRepository
                        .findByEmpID(
                                request.getEmpID()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid Employee ID or Password"
                                )
                        );

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {

            throw new RuntimeException(
                    "Invalid Employee ID or Password"
            );
        }

        if (!"Active".equalsIgnoreCase(
                user.getProfileStatus())) {

            throw new RuntimeException(
                    "User account is inactive"
            );
        }

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