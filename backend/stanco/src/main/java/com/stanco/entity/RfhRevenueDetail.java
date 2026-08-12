package com.stanco.entity;

import com.stanco.enums.RevenueType;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rfh_revenue_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RfhRevenueDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rfh_no", nullable = false)
    private String rfhNo;

    @Enumerated(EnumType.STRING)
    @Column(name = "revenue_type", nullable = false)
    private RevenueType revenueType;

    @Column(name = "revenue_percentage", precision = 5, scale = 2)
    private BigDecimal revenuePercentage;

    @Column(name = "revenue_count")
    private Integer revenueCount;

    @Column(name = "calculated_revenue", precision = 15, scale = 2, nullable = false)
    private BigDecimal calculatedRevenue = BigDecimal.ZERO;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}