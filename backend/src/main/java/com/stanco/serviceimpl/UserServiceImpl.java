package com.stanco.serviceimpl;

import com.stanco.dto.request.CreateUserRequest;
import com.stanco.dto.response.UserResponse;

import com.stanco.entity.User;

import com.stanco.enums.RoleType;
import com.stanco.enums.Status;

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
        public UserResponse createUser(
                        CreateUserRequest request,
                        String creatorEmpID) {

                User creator = userRepository
                                .findByEmpID(creatorEmpID)
                                .orElseThrow(() -> new RuntimeException(
                                                "Creator not found: "
                                                                + creatorEmpID));

                String creatorRole = creator.getRoleType();

                if (request.getRoleType() == null ||
                                request.getRoleType().isBlank()) {

                        throw new RuntimeException(
                                        "Role type is required");
                }

                RoleType requestedRole;

                try {

                        requestedRole = RoleType.valueOf(
                                        request.getRoleType());

                } catch (IllegalArgumentException e) {

                        throw new RuntimeException(
                                        "Invalid role type: "
                                                        + request.getRoleType());
                }

                validateRoleHierarchy(
                                creatorRole,
                                requestedRole);

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

                user.setEmail(
                                request.getEmail());

                user.setMobileNo(
                                request.getMobileNo());

                user.setRoleType(
                                requestedRole.name());

                user.setSupervisor(
                                creator.getEmpID());

                user.setProfileStatus(
                                request.getProfileStatus() != null
                                                ? request.getProfileStatus()
                                                : Status.active);

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

                return mapToResponse(
                                savedUser);
        }

        private void validateRoleHierarchy(
                        String creatorRole,
                        RoleType requestedRole) {

                if ("super_admin".equals(
                                creatorRole)) {

                        if (requestedRole != RoleType.admin) {

                                throw new RuntimeException(
                                                "Super Admin can create Admin only");
                        }

                        return;
                }

                if ("admin".equals(
                                creatorRole)) {

                        if (requestedRole != RoleType.delivery_lead) {

                                throw new RuntimeException(
                                                "Admin can create Hiring Manager only");
                        }

                        return;
                }

                if ("delivery_lead".equals(
                                creatorRole)) {

                        if (requestedRole != RoleType.recruiter) {

                                throw new RuntimeException(
                                                "Hiring Manager can create Recruiter only");
                        }

                        return;
                }

                if ("recruiter".equals(
                                creatorRole)) {

                        throw new RuntimeException(
                                        "Recruiter is not allowed to create users");
                }

                throw new RuntimeException(
                                "Invalid creator role: "
                                                + creatorRole);
        }

        @Override
        public List<UserResponse> getAllUsers() {

                return userRepository
                                .findAll()
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        @Override
        public UserResponse getUserById(
                        Long id) {

                User user = userRepository
                                .findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Employee not found: "
                                                                + id));

                return mapToResponse(user);
        }

        @Override
        public UserResponse getUserByEmpID(
                        String empID) {

                User user = userRepository
                                .findByEmpID(empID)
                                .orElseThrow(() -> new RuntimeException(
                                                "Employee not found: "
                                                                + empID));

                return mapToResponse(user);
        }

        @Override
        public UserResponse getMyDetails(
                        String empID) {

                User user = userRepository
                                .findByEmpID(empID)
                                .orElseThrow(() -> new RuntimeException(
                                                "Employee not found: "
                                                                + empID));

                return mapToResponse(user);
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