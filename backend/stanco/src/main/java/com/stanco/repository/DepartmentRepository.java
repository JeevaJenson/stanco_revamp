package com.stanco.repository;

import com.stanco.entity.Department;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentRepository
        extends JpaRepository<Department, Long> {

    Optional<Department> findByDepId(String depId);

    boolean existsByDepId(String depId);
}