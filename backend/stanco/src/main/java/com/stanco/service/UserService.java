package com.stanco.service;

import com.stanco.dto.CreateUserRequest;
import com.stanco.dto.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse createUser(
            CreateUserRequest request);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(
            Long id);

    UserResponse getUserByEmpID(
            String empID);

    UserResponse getMyDetails(
            String empID);
}