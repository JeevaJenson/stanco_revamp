package com.stanco.repository;

import com.stanco.entity.CtcCalculation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CtcCalculationRepository
        extends JpaRepository<CtcCalculation, Long> {

    Optional<CtcCalculation> findByCtcID(
            String ctcID
    );

    List<CtcCalculation> findByCdID(
            String cdID
    );

    List<CtcCalculation> findByRfhNo(
            String rfhNo
    );

    boolean existsByCtcID(
            String ctcID
    );
}