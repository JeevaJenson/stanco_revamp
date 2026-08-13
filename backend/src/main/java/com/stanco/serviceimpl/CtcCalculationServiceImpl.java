package com.stanco.serviceimpl;

import com.stanco.dto.request.CtcCalculationRequest;
import com.stanco.dto.response.CtcCalculationResponse;

import com.stanco.entity.CtcCalculation;
import com.stanco.repository.CtcCalculationRepository;
import com.stanco.service.CtcCalculationService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CtcCalculationServiceImpl
        implements CtcCalculationService {

    private final CtcCalculationRepository repository;


    @Override
    public CtcCalculationResponse create(
            CtcCalculationRequest request,
            String createdBy) {

        if (repository.existsByCtcID(
                request.getCtcID())) {

            throw new RuntimeException(
                    "CTC ID already exists: "
                            + request.getCtcID()
            );
        }

        CtcCalculation ctc =
                new CtcCalculation();

        mapRequestToEntity(request, ctc);

        ctc.setCreatedBy(createdBy);
        ctc.setModifiedBy(createdBy);

        ctc.setCreatedAt(
                LocalDateTime.now()
        );

        ctc.setUpdatedAt(
                LocalDateTime.now()
        );

        CtcCalculation saved =
                repository.save(ctc);

        return mapToResponse(saved);
    }


    @Override
    public List<CtcCalculationResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public CtcCalculationResponse getById(
            Long id) {

        CtcCalculation ctc =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "CTC calculation not found: "
                                                + id
                                )
                        );

        return mapToResponse(ctc);
    }


    @Override
    public CtcCalculationResponse getByCtcID(
            String ctcID) {

        CtcCalculation ctc =
                repository.findByCtcID(ctcID)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "CTC calculation not found: "
                                                + ctcID
                                )
                        );

        return mapToResponse(ctc);
    }


    @Override
    public List<CtcCalculationResponse> getByCdID(
            String cdID) {

        return repository.findByCdID(cdID)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public List<CtcCalculationResponse> getByRfhNo(
            String rfhNo) {

        return repository.findByRfhNo(rfhNo)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public CtcCalculationResponse update(
            Long id,
            CtcCalculationRequest request,
            String modifiedBy) {

        CtcCalculation ctc =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "CTC calculation not found: "
                                                + id
                                )
                        );

        mapRequestToEntity(request, ctc);

        ctc.setModifiedBy(modifiedBy);

        ctc.setUpdatedAt(
                LocalDateTime.now()
        );

        CtcCalculation updated =
                repository.save(ctc);

        return mapToResponse(updated);
    }


    @Override
    public void delete(Long id) {

        CtcCalculation ctc =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "CTC calculation not found: "
                                                + id
                                )
                        );

        repository.delete(ctc);
    }


    private void mapRequestToEntity(
            CtcCalculationRequest request,
            CtcCalculation ctc) {

        ctc.setCtcID(request.getCtcID());
        ctc.setCdID(request.getCdID());
        ctc.setRfhNo(request.getRfhNo());
        ctc.setHeplRecruitmentRefNumber(
                request.getHeplRecruitmentRefNumber()
        );

        ctc.setBasicPm(request.getBasicPm());
        ctc.setBasicPa(request.getBasicPa());

        ctc.setHraPm(request.getHraPm());
        ctc.setHraPa(request.getHraPa());
        ctc.setHraRange(request.getHraRange());

        ctc.setMediAlPm(request.getMediAlPm());
        ctc.setMediAlPa(request.getMediAlPa());

        ctc.setConvPm(request.getConvPm());
        ctc.setConvPa(request.getConvPa());

        ctc.setSplAlPm(request.getSplAlPm());
        ctc.setSplAlPa(request.getSplAlPa());

        ctc.setCompAPm(request.getCompAPm());
        ctc.setCompAPa(request.getCompAPa());

        ctc.setEcPfPm(request.getEcPfPm());
        ctc.setEcPfPa(request.getEcPfPa());

        ctc.setEcEsiPm(request.getEcEsiPm());
        ctc.setEcEsiPa(request.getEcEsiPa());

        ctc.setSubTotalbPm(request.getSubTotalbPm());
        ctc.setSubTotalbPa(request.getSubTotalbPa());

        ctc.setGratuityPm(request.getGratuityPm());
        ctc.setGratuityPa(request.getGratuityPa());

        ctc.setStBonusPm(request.getStBonusPm());
        ctc.setStBonusPa(request.getStBonusPa());

        ctc.setSubTotalcPm(request.getSubTotalcPm());
        ctc.setSubTotalcPa(request.getSubTotalcPa());

        ctc.setAbcPm(request.getAbcPm());
        ctc.setAbcPa(request.getAbcPa());

        ctc.setNetPay(request.getNetPay());

        ctc.setTermInsurance(
                request.getTermInsurance()
        );

        ctc.setEmployeeEsiPm(
                request.getEmployeeEsiPm()
        );

        ctc.setEmployeeEsiPa(
                request.getEmployeeEsiPa()
        );

        ctc.setGroupMediclaim(
                request.getGroupMediclaim()
        );

        ctc.setPersonalAccidentPolicy(
                request.getPersonalAccidentPolicy()
        );
    }


    private CtcCalculationResponse mapToResponse(
            CtcCalculation ctc) {

        return new CtcCalculationResponse(

                ctc.getId(),

                ctc.getCtcID(),
                ctc.getCdID(),
                ctc.getRfhNo(),
                ctc.getHeplRecruitmentRefNumber(),

                ctc.getBasicPm(),
                ctc.getBasicPa(),

                ctc.getHraPm(),
                ctc.getHraPa(),
                ctc.getHraRange(),

                ctc.getMediAlPm(),
                ctc.getMediAlPa(),

                ctc.getConvPm(),
                ctc.getConvPa(),

                ctc.getSplAlPm(),
                ctc.getSplAlPa(),

                ctc.getCompAPm(),
                ctc.getCompAPa(),

                ctc.getEcPfPm(),
                ctc.getEcPfPa(),

                ctc.getEcEsiPm(),
                ctc.getEcEsiPa(),

                ctc.getSubTotalbPm(),
                ctc.getSubTotalbPa(),

                ctc.getGratuityPm(),
                ctc.getGratuityPa(),

                ctc.getStBonusPm(),
                ctc.getStBonusPa(),

                ctc.getSubTotalcPm(),
                ctc.getSubTotalcPa(),

                ctc.getAbcPm(),
                ctc.getAbcPa(),

                ctc.getNetPay(),

                ctc.getTermInsurance(),

                ctc.getEmployeeEsiPm(),
                ctc.getEmployeeEsiPa(),

                ctc.getGroupMediclaim(),

                ctc.getPersonalAccidentPolicy(),

                ctc.getCreatedBy(),
                ctc.getModifiedBy(),

                ctc.getCreatedAt(),
                ctc.getUpdatedAt()
        );
    }
}