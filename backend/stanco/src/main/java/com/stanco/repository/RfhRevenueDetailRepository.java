package com.stanco.repository;

import com.stanco.entity.RfhRevenueDetail;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RfhRevenueDetailRepository
        extends JpaRepository<RfhRevenueDetail, Long> {

    Optional<RfhRevenueDetail>
    findByRfhNo(String rfhNo);

    List<RfhRevenueDetail>
    findAllByRfhNo(String rfhNo);

    boolean existsByRfhNo(String rfhNo);
}