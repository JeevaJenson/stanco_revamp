package com.stanco.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CtcCalculationRequest {

    @NotBlank
    private String ctcID;

    @NotBlank
    private String cdID;

    @NotBlank
    private String rfhNo;

    @NotBlank
    private String heplRecruitmentRefNumber;

    @NotNull
    private Integer basicPm;

    @NotNull
    private Integer basicPa;

    @NotNull
    private Integer hraPm;

    @NotNull
    private Integer hraPa;

    private Integer hraRange;

    @NotNull
    private Integer mediAlPm;

    @NotNull
    private Integer mediAlPa;

    @NotNull
    private Integer convPm;

    @NotNull
    private Integer convPa;

    @NotNull
    private Integer splAlPm;

    @NotNull
    private Integer splAlPa;

    @NotNull
    private Integer compAPm;

    @NotNull
    private Integer compAPa;

    @NotNull
    private Integer ecPfPm;

    @NotNull
    private Integer ecPfPa;

    @NotNull
    private Integer ecEsiPm;

    @NotNull
    private Integer ecEsiPa;

    @NotNull
    private Integer subTotalbPm;

    @NotNull
    private Integer subTotalbPa;

    @NotNull
    private Integer gratuityPm;

    @NotNull
    private Integer gratuityPa;

    @NotNull
    private Integer stBonusPm;

    @NotNull
    private Integer stBonusPa;

    @NotNull
    private Integer subTotalcPm;

    @NotNull
    private Integer subTotalcPa;

    @NotNull
    private Integer abcPm;

    @NotNull
    private Integer abcPa;

    @NotNull
    private Integer netPay;

    private Integer termInsurance;

    private Integer employeeEsiPm;

    private Integer employeeEsiPa;

    private Integer groupMediclaim;

    private String personalAccidentPolicy;
}