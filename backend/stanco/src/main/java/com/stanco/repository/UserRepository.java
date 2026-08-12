package com.stanco.repository;

import com.stanco.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository
        extends JpaRepository<User, Long> {

    Optional<User> findByEmpID(
            String empID
    );

    Optional<User> findByEmail(
            String email
    );

    boolean existsByEmpID(
            String empID
    );

    boolean existsByEmail(
            String email
    );
}