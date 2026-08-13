package com.stanco.repository;

import com.stanco.entity.BusinessMaster;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BusinessMasterRepository
        extends JpaRepository<BusinessMaster, Long> {

    Optional<BusinessMaster>
    findByBuId(String buId);

    boolean existsByBuId(String buId);

    List<BusinessMaster>
    findByStatus(String status);
}