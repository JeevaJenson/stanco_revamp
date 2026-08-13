package com.stanco.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ctc_calculations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CtcCalculation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ctcID", nullable = false)
    private String ctcID;

    @Column(name = "cdID", nullable = false)
    private String cdID;

    @Column(name = "rfh_no", nullable = false)
    private String rfhNo;

    @Column(name = "hepl_recruitment_ref_number", nullable = false)
    private String heplRecruitmentRefNumber;

    private Integer basicPm;
    private Integer basicPa;

    private Integer hraPm;
    private Integer hraPa;

    private Integer hraRange;

    private Integer mediAlPm;
    private Integer mediAlPa;

    private Integer convPm;
    private Integer convPa;

    private Integer splAlPm;
    private Integer splAlPa;

    private Integer compAPm;
    private Integer compAPa;

    private Integer ecPfPm;
    private Integer ecPfPa;

    private Integer ecEsiPm;
    private Integer ecEsiPa;

    private Integer subTotalbPm;
    private Integer subTotalbPa;

    private Integer gratuityPm;
    private Integer gratuityPa;

    private Integer stBonusPm;
    private Integer stBonusPa;

    private Integer subTotalcPm;
    private Integer subTotalcPa;

    private Integer abcPm;
    private Integer abcPa;

    private Integer netPay;

    private Integer termInsurance;

    private Integer employeeEsiPm;
    private Integer employeeEsiPa;

    private Integer groupMediclaim;

    private String personalAccidentPolicy;

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    @Column(name = "modified_by", nullable = false)
    private String modifiedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}