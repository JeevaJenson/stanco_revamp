package com.stanco.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "candidate_revenue_tracking",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "unique_candidate_rfh",
                        columnNames = {
                                "candidate_id",
                                "rfh_no"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CandidateRevenueTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "candidate_id",
            nullable = false
    )
    private String candidateId;

    @Column(
            name = "rfh_no",
            nullable = false
    )
    private String rfhNo;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "revenue_type",
            nullable = false
    )
    private RevenueType revenueType;

    @Column(
            name = "revenue_amount",
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal revenueAmount;

    @Column(
            name = "created_by",
            nullable = false
    )
    private String createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    public enum RevenueType {
        financial,
        non_financial
    }
}