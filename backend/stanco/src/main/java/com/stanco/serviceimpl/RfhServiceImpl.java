package com.stanco.serviceimpl;

import com.stanco.dto.request.RfhRequest;
import com.stanco.dto.response.RfhResponse;

import com.stanco.entity.Rfh;

import com.stanco.repository.RfhRepository;

import com.stanco.service.RfhService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RfhServiceImpl
        implements RfhService {

    private final RfhRepository repository;


    @Override
    public RfhResponse create(
            RfhRequest request,
            String requestBy) {


        if (request.getResId() != null &&
                repository.existsByResId(
                        request.getResId())) {

            throw new RuntimeException(
                    "RES ID already exists"
            );
        }


        Rfh rfh = new Rfh();


        rfh.setResId(
                request.getResId()
        );

        rfh.setRollsOption(
                request.getRollsOption()
        );

        rfh.setName(
                request.getName()
        );

        rfh.setMobile(
                request.getMobile()
        );

        rfh.setEmail(
                request.getEmail()
        );

        rfh.setPositionReports(
                request.getPositionReports()
        );

        rfh.setReportEmail(
                request.getReportEmail()
        );

        rfh.setCostCenter(
                request.getCostCenter()
        );

        rfh.setApprovedBy(
                request.getApprovedBy()
        );

        rfh.setRequestType(
                request.getRequestType()
        );

        rfh.setReplacementOf(
                request.getReplacementOf()
        );

        rfh.setApprovalHire(
                request.getApprovalHire()
        );

        rfh.setTicketNumber(
                request.getTicketNumber()
        );

        rfh.setPositionTitle(
                request.getPositionTitle()
        );

        rfh.setLocation(
                request.getLocation()
        );

        rfh.setLocationPreferred(
                request.getLocationPreferred()
        );

        rfh.setBusiness(
                request.getBusiness()
        );

        rfh.setBand(
                request.getBand()
        );

        rfh.setDivision(
                request.getDivision()
        );

        rfh.setFunction(
                request.getFunction()
        );

        rfh.setNoOfPositions(
                request.getNoOfPositions()
        );

        rfh.setJdRoles(
                request.getJdRoles()
        );

        rfh.setQualification(
                request.getQualification()
        );

        rfh.setEssentialSkill(
                request.getEssentialSkill()
        );

        rfh.setGoodSkill(
                request.getGoodSkill()
        );

        rfh.setExperience(
                request.getExperience()
        );

        rfh.setSalaryRange(
                request.getSalaryRange()
        );

        rfh.setSalaryRangeAnnual(
                request.getSalaryRangeAnnual()
        );

        rfh.setAnySpecific(
                request.getAnySpecific()
        );


        rfh.setCreatedDate(
                LocalDateTime.now()
        );


        rfh.setDeleteStatus(0);


        rfh.setDeleteRemark(
                request.getDeleteRemark() != null
                        ? request.getDeleteRemark()
                        : ""
        );


        rfh.setApprovalHirePath(
                request.getApprovalHirePath() != null
                        ? request.getApprovalHirePath()
                        : 0
        );


        rfh.setRequestDate(
                request.getRequestDate()
        );


        rfh.setRequestBy(
                requestBy
        );


        rfh.setApproveDate(
                request.getApproveDate()
        );

        rfh.setDepartment(
                request.getDepartment()
        );

        rfh.setDesignation(
                request.getDesignation()
        );

        rfh.setVertical(
                request.getVertical()
        );

        rfh.setTenDoj(
                request.getTenDoj()
        );

        rfh.setEmpCategory(
                request.getEmpCategory()
        );

        rfh.setType(
                request.getType()
        );

        rfh.setAttendanceFormat(
                request.getAttendanceFormat()
        );

        rfh.setWeekOff(
                request.getWeekOff()
        );

        rfh.setCkSupervisior(
                request.getCkSupervisior()
        );

        rfh.setCkMail(
                request.getCkMail()
        );

        rfh.setApproverId(
                request.getApproverId()
        );

        rfh.setReporterId(
                request.getReporterId()
        );

        rfh.setClientName(
                request.getClientName()
        );


        Rfh saved =
                repository.save(rfh);


        return mapToResponse(saved);
    }


    @Override
    public List<RfhResponse> getAll() {

        return repository
                .findByDeleteStatus(0)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public RfhResponse getById(
            Long id) {

        Rfh rfh =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "RFH not found: "
                                                + id
                                )
                        );

        return mapToResponse(rfh);
    }


    @Override
    public RfhResponse getByResId(
            String resId) {

        Rfh rfh =
                repository.findByResId(resId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "RFH not found: "
                                                + resId
                                )
                        );

        return mapToResponse(rfh);
    }


    @Override
    public List<RfhResponse> getMyRfh(
            String requestBy) {

        return repository
                .findByRequestBy(requestBy)
                .stream()
                .filter(rfh ->
                        rfh.getDeleteStatus() == 0
                )
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public RfhResponse update(
            Long id,
            RfhRequest request) {

        Rfh rfh =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "RFH not found: "
                                                + id
                                )
                        );


        rfh.setResId(
                request.getResId()
        );

        rfh.setRollsOption(
                request.getRollsOption()
        );

        rfh.setName(
                request.getName()
        );

        rfh.setMobile(
                request.getMobile()
        );

        rfh.setEmail(
                request.getEmail()
        );

        rfh.setPositionReports(
                request.getPositionReports()
        );

        rfh.setReportEmail(
                request.getReportEmail()
        );

        rfh.setCostCenter(
                request.getCostCenter()
        );

        rfh.setApprovedBy(
                request.getApprovedBy()
        );

        rfh.setRequestType(
                request.getRequestType()
        );

        rfh.setReplacementOf(
                request.getReplacementOf()
        );

        rfh.setApprovalHire(
                request.getApprovalHire()
        );

        rfh.setTicketNumber(
                request.getTicketNumber()
        );

        rfh.setPositionTitle(
                request.getPositionTitle()
        );

        rfh.setLocation(
                request.getLocation()
        );

        rfh.setLocationPreferred(
                request.getLocationPreferred()
        );

        rfh.setBusiness(
                request.getBusiness()
        );

        rfh.setBand(
                request.getBand()
        );

        rfh.setDivision(
                request.getDivision()
        );

        rfh.setFunction(
                request.getFunction()
        );

        rfh.setNoOfPositions(
                request.getNoOfPositions()
        );

        rfh.setJdRoles(
                request.getJdRoles()
        );

        rfh.setQualification(
                request.getQualification()
        );

        rfh.setEssentialSkill(
                request.getEssentialSkill()
        );

        rfh.setGoodSkill(
                request.getGoodSkill()
        );

        rfh.setExperience(
                request.getExperience()
        );

        rfh.setSalaryRange(
                request.getSalaryRange()
        );

        rfh.setSalaryRangeAnnual(
                request.getSalaryRangeAnnual()
        );

        rfh.setAnySpecific(
                request.getAnySpecific()
        );

        rfh.setDeleteRemark(
                request.getDeleteRemark()
        );

        rfh.setApprovalHirePath(
                request.getApprovalHirePath()
        );

        rfh.setRequestDate(
                request.getRequestDate()
        );

        rfh.setApproveDate(
                request.getApproveDate()
        );

        rfh.setDepartment(
                request.getDepartment()
        );

        rfh.setDesignation(
                request.getDesignation()
        );

        rfh.setVertical(
                request.getVertical()
        );

        rfh.setTenDoj(
                request.getTenDoj()
        );

        rfh.setEmpCategory(
                request.getEmpCategory()
        );

        rfh.setType(
                request.getType()
        );

        rfh.setAttendanceFormat(
                request.getAttendanceFormat()
        );

        rfh.setWeekOff(
                request.getWeekOff()
        );

        rfh.setCkSupervisior(
                request.getCkSupervisior()
        );

        rfh.setCkMail(
                request.getCkMail()
        );

        rfh.setApproverId(
                request.getApproverId()
        );

        rfh.setReporterId(
                request.getReporterId()
        );

        rfh.setClientName(
                request.getClientName()
        );


        Rfh updated =
                repository.save(rfh);


        return mapToResponse(updated);
    }


    @Override
    public void delete(
            Long id,
            String remark) {

        Rfh rfh =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "RFH not found: "
                                                + id
                                )
                        );


        rfh.setDeleteStatus(1);

        rfh.setDeleteRemark(
                remark != null
                        ? remark
                        : "Deleted"
        );


        repository.save(rfh);
    }


    private RfhResponse mapToResponse(
            Rfh rfh) {

        return new RfhResponse(

                rfh.getId(),
                rfh.getResId(),
                rfh.getRollsOption(),
                rfh.getName(),
                rfh.getMobile(),
                rfh.getEmail(),
                rfh.getPositionReports(),
                rfh.getReportEmail(),
                rfh.getCostCenter(),
                rfh.getApprovedBy(),
                rfh.getRequestType(),
                rfh.getReplacementOf(),
                rfh.getApprovalHire(),
                rfh.getTicketNumber(),
                rfh.getPositionTitle(),
                rfh.getLocation(),
                rfh.getLocationPreferred(),
                rfh.getBusiness(),
                rfh.getBand(),
                rfh.getDivision(),
                rfh.getFunction(),
                rfh.getNoOfPositions(),
                rfh.getJdRoles(),
                rfh.getQualification(),
                rfh.getEssentialSkill(),
                rfh.getGoodSkill(),
                rfh.getExperience(),
                rfh.getSalaryRange(),
                rfh.getSalaryRangeAnnual(),
                rfh.getAnySpecific(),
                rfh.getCreatedDate(),
                rfh.getDeleteStatus(),
                rfh.getDeleteRemark(),
                rfh.getApprovalHirePath(),
                rfh.getRequestDate(),
                rfh.getRequestBy(),
                rfh.getApproveDate(),
                rfh.getDepartment(),
                rfh.getDesignation(),
                rfh.getVertical(),
                rfh.getTenDoj(),
                rfh.getEmpCategory(),
                rfh.getType(),
                rfh.getAttendanceFormat(),
                rfh.getWeekOff(),
                rfh.getCkSupervisior(),
                rfh.getCkMail(),
                rfh.getApproverId(),
                rfh.getReporterId(),
                rfh.getClientName()
        );
    }
}