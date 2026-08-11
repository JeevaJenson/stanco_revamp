package com.stanco.serviceimpl;

import com.stanco.dto.request.CreateUserRequest;
import com.stanco.dto.response.UserResponse;

import com.stanco.entity.User;

import com.stanco.repository.UserRepository;

import com.stanco.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl
                implements UserService {

        private final UserRepository userRepository;

        private final PasswordEncoder passwordEncoder;

        @Override
        public List<UserResponse> getAllUsers() {

                return userRepository.findAll()
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        @Override
        public UserResponse getUserById(Long id) {

                User user = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Employee not found with ID: " + id));

                return mapToResponse(user);
        }

        @Override
        public UserResponse getUserByEmpID(
                        String empID) {

                User user = userRepository.findByEmpID(empID)
                                .orElseThrow(() -> new RuntimeException(
                                                "Employee not found: " + empID));

                return mapToResponse(user);
        }

        @Override
        public UserResponse getMyDetails(
                        String empID) {

                User user = userRepository.findByEmpID(empID)
                                .orElseThrow(() -> new RuntimeException(
                                                "Employee not found: " + empID));

                return mapToResponse(user);
        }

        @Override
        public UserResponse createUser(
                        CreateUserRequest request) {

                if (userRepository.existsByEmpID(
                                request.getEmpID())) {

                        throw new RuntimeException(
                                        "Employee ID already exists");
                }

                if (userRepository.existsByEmail(
                                request.getEmail())) {

                        throw new RuntimeException(
                                        "Email already exists");
                }

                if (!isValidRole(
                                request.getRoleType())) {

                        throw new RuntimeException(
                                        "Invalid role type");
                }

                User user = new User();

                user.setEmpID(
                                request.getEmpID());

                user.setName(
                                request.getName());

                user.setDesignation(
                                request.getDesignation());

                user.setBusiness(
                                request.getBusiness());

                user.setDepartment(
                                request.getDepartment());

                user.setLobDivision(
                                request.getLobDivision());

                user.setSupervisor(
                                request.getSupervisor());

                user.setEmail(
                                request.getEmail());

                user.setMobileNo(
                                request.getMobileNo());

                user.setRoleType(
                                request.getRoleType());

                user.setProfileStatus(
                                request.getProfileStatus() != null
                                                ? request.getProfileStatus()
                                                : "Active");

                user.setPassword(
                                passwordEncoder.encode(
                                                request.getPassword()));

                user.setTeam(
                                request.getTeam() != null
                                                ? request.getTeam()
                                                : "");

                user.setColorCode(
                                request.getColorCode() != null
                                                ? request.getColorCode()
                                                : "");

                user.setCreatedAt(
                                LocalDateTime.now());

                user.setUpdatedAt(
                                LocalDateTime.now());

                User savedUser = userRepository.save(user);

                return mapToResponse(savedUser);
        }

        private boolean isValidRole(String roleType) {

                return "super_admin".equals(roleType)
                                || "recruiter".equals(roleType)
                                || "delivery_lead".equals(roleType)
                                || "line_business_head".equals(roleType);
        }

        private UserResponse mapToResponse(
                        User user) {

                return new UserResponse(
                                user.getId(),
                                user.getEmpID(),
                                user.getName(),
                                user.getDesignation(),
                                user.getBusiness(),
                                user.getDepartment(),
                                user.getLobDivision(),
                                user.getSupervisor(),
                                user.getEmail(),
                                user.getMobileNo(),
                                user.getRoleType(),
                                user.getProfileStatus(),
                                user.getTeam(),
                                user.getColorCode());
        }
}