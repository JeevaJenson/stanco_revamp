package com.stanco.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CtcCalculationResponse {

    private Long id;

    private String ctcID;
    private String cdID;
    private String rfhNo;
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

    private String createdBy;
    private String modifiedBy;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}