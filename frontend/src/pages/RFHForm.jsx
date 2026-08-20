import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Sidebar from "./Sidebar";

import {
  InputField,
  SelectField,
  TextAreaField,
} from "../components/FormFields";

import "../style/RFHForm.css";


// ============================================================
// INITIAL FORM DATA
// ============================================================

const initialFormData = {
  // Backend generated RFH number
  resId: "",

  // User manually enters this from UI
  ticketNumber: "",

  rollsOption: "",

  name: "",
  mobile: "",
  email: "",

  positionReports: "",
  reportEmail: "",

  costCenter: "",
  approvedBy: "",

  requestType: "NEW",

  replacementOf: "NA",

  approvalHire: "YES",

  positionTitle: "",
  location: "",
  locationPreferred: "",

  business: "",

  band: "",
  division: "",
  function: "",

  noOfPositions: "",

  jdRoles: "",
  qualification: "",
  essentialSkill: "",
  goodSkill: "",
  experience: "",

  salaryRange: "",
  salaryRangeAnnual: "",

  anySpecific: "",

  deleteRemark: "",

  approvalHirePath: 0,

  requestDate: new Date()
    .toISOString()
    .split("T")[0],

  approveDate: "",

  department: "",
  designation: "",
  vertical: "",

  tenDoj: "",

  empCategory: "",

  type: "",

  attendanceFormat: "",
  weekOff: "",

  ckSupervisior: "",
  ckMail: "",

  approverId: "",
  reporterId: "",

  clientName: "STANCO",

  requestBy: "",
};


// ============================================================
// COMPONENT
// ============================================================

function RFHForm() {

  const navigate = useNavigate();

  const { id } = useParams();


  // ==========================================================
  // STATES
  // ==========================================================

  const [formData, setFormData] = useState(
    initialFormData
  );

  const [loading, setLoading] = useState(false);

  const [loadingData, setLoadingData] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });


  // ==========================================================
  // DROPDOWN STATES
  // ==========================================================

  const [businessList, setBusinessList] = useState([
    {
      label: "CKPL",
      value: "CKPL",
    },
    {
      label: "STANCO",
      value: "STANCO",
    },
  ]);

  const [departmentList, setDepartmentList] =
    useState([]);

  const [departmentData, setDepartmentData] =
    useState([]);

  const [verticalList, setVerticalList] =
    useState([]);

  const [teamList, setTeamList] = useState([
    {
      label: "CKPL",
      value: "CKPL",
    },
    {
      label: "STANCO",
      value: "STANCO",
    },
  ]);


  // ==========================================================
  // LOAD DROPDOWN DATA
  // ==========================================================

  useEffect(() => {

    const loadDropdownData = async () => {

      try {

        const [
          businessResponse,
          departmentResponse,
          teamResponse,
          verticalResponse,
        ] = await Promise.all([

          api.get("/business-masters"),

          api.get("/departments"),

          api.get("/teams"),

          api.get("/verticals"),

        ]);


        // ====================================================
        // BUSINESS
        // ====================================================

        const businessData =
          businessResponse.data || [];

        const activeBusinesses =
          businessData
            .filter(
              (business) =>
                String(
                  business.status ?? 1
                ) === "1" ||
                String(
                  business.status || ""
                ).toLowerCase() === "active"
            )
            .map((business) => ({
              label:
                business.businessName ||
                business.name,

              value:
                business.businessName ||
                business.name,
            }))
            .filter(
              (business) =>
                business.label
            );


        if (
          activeBusinesses.length > 0
        ) {

          setBusinessList(
            activeBusinesses
          );

        }


        // ====================================================
        // DEPARTMENT
        // ====================================================

        const departmentDataResponse =
          departmentResponse.data || [];

        const activeDepartments =
          departmentDataResponse.filter(
            (department) =>
              String(
                department.status ??
                "active"
              ).toLowerCase() ===
                "active" ||
              String(
                department.status ?? 1
              ) === "1"
          );


        setDepartmentData(
          activeDepartments
        );


        setDepartmentList(
          activeDepartments
            .map((department) => ({
              label:
                department.name ||
                department.departmentName,

              value:
                department.name ||
                department.departmentName,
            }))
            .filter(
              (department) =>
                department.label
            )
        );


        // ====================================================
        // VERTICAL
        // ====================================================

        const verticalData =
          verticalResponse.data || [];

        const activeVerticals =
          verticalData
            .filter(
              (vertical) =>
                String(
                  vertical.status ?? 1
                ) === "1" ||
                String(
                  vertical.status || ""
                ).toLowerCase() ===
                  "active"
            )
            .map((vertical) => ({
              id: vertical.id,

              label:
                vertical.name ||
                vertical.verticalName,

              value:
                vertical.name ||
                vertical.verticalName,
            }))
            .filter(
              (vertical) =>
                vertical.label
            );


        setVerticalList(
          activeVerticals
        );


        // ====================================================
        // TEAM
        // ====================================================

        const teamData =
          teamResponse.data || [];

        const activeTeams =
          teamData
            .filter(
              (team) =>
                String(
                  team.status ?? 1
                ) === "1" ||
                String(
                  team.status || ""
                ).toLowerCase() ===
                  "active"
            )
            .map((team) => ({
              label: team.name,
              value: team.name,
            }))
            .filter(
              (team) =>
                team.label
            );


        if (
          activeTeams.length > 0
        ) {

          setTeamList(
            activeTeams
          );

        }

      } catch (error) {

        console.error(
          "Error loading dropdown data:",
          error
        );

      }

    };


    loadDropdownData();

  }, []);


  // ==========================================================
  // LOAD CURRENT USER / EDIT DATA
  // ==========================================================

  useEffect(() => {

    if (id) {

      fetchRfhById(id);

      return;
    }


    const currentUserString =
      localStorage.getItem("user");


    const currentUser =
      currentUserString
        ? JSON.parse(
            currentUserString
          )
        : null;


    setFormData((previous) => ({

      ...previous,

      requestBy:
        currentUser?.name ||
        currentUser?.empID ||
        "Admin",

      name:
        currentUser?.name ||
        "",

      email:
        currentUser?.email ||
        "",

      mobile:
        currentUser?.mobileNo ||
        "",

    }));

  }, [id]);


  // ==========================================================
  // GET RFH BY ID
  // ==========================================================

  const fetchRfhById = async (
    rfhId
  ) => {

    try {

      setLoadingData(true);


      const response =
        await api.get(
          `/rfh/${rfhId}`
        );


      const rfh =
        response.data || {};


      setFormData({

        ...initialFormData,

        ...rfh,

        /*
         * Backend generated RFH number.
         * Example: RFH001
         */
        resId:
          rfh.resId || "",

        /*
         * User entered ticket number.
         */
        ticketNumber:
          rfh.ticketNumber || "",

        replacementOf:
          rfh.replacementOf ||
          "NA",

        approvalHirePath:
          rfh.approvalHirePath ??
          0,

        clientName:
          rfh.clientName ||
          "STANCO",

      });

    } catch (error) {

      console.error(
        "RFH fetch error:",
        error
      );

      showToast(
        "error",
        error?.response?.data
          ?.message ||
        "Failed to load RFH details"
      );

    } finally {

      setLoadingData(false);

    }

  };


  // ==========================================================
  // TOAST
  // ==========================================================

  const showToast = (
    type,
    message
  ) => {

    setToast({
      show: true,
      type,
      message,
    });


    setTimeout(() => {

      setToast({
        show: false,
        type: "",
        message: "",
      });

    }, 3500);

  };


  // ==========================================================
  // NORMAL INPUT CHANGE
  // ==========================================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setFormData(
      (previous) => ({

        ...previous,

        [name]: value,

      })
    );


    // ========================================================
    // REQUEST TYPE
    // ========================================================

    if (
      name === "requestType"
    ) {

      setFormData(
        (previous) => ({

          ...previous,

          requestType:
            value,

          replacementOf:
            value === "NEW"
              ? "NA"
              : previous.replacementOf,

        })
      );

    }

  };


  // ==========================================================
  // DEPARTMENT CHANGE
  // ==========================================================

  const handleDepartmentChange = (
    event
  ) => {

    const departmentName =
      event.target.value;


    const selectedDepartment =
      departmentData.find(
        (department) =>
          String(
            department?.name ||
            department?.departmentName ||
            ""
          )
            .trim()
            .toLowerCase() ===
          String(
            departmentName || ""
          )
            .trim()
            .toLowerCase()
      );


    console.log(
      "Selected Department:",
      selectedDepartment
    );


    let mappedVertical = "";


    if (selectedDepartment) {

      // 1. verticalName
      if (
        selectedDepartment.verticalName
      ) {

        mappedVertical =
          String(
            selectedDepartment.verticalName
          ).trim();

      }

      // 2. vertical
      else if (
        selectedDepartment.vertical
      ) {

        if (
          typeof selectedDepartment.vertical ===
          "object"
        ) {

          mappedVertical =
            String(
              selectedDepartment.vertical?.name ||
              selectedDepartment.vertical?.verticalName ||
              selectedDepartment.vertical?.value ||
              ""
            ).trim();

        } else {

          mappedVertical =
            String(
              selectedDepartment.vertical
            ).trim();

        }

      }

      // 3. verticalId
      else if (
        selectedDepartment.verticalId !==
          undefined &&
        selectedDepartment.verticalId !==
          null
      ) {

        const matchedVertical =
          verticalList.find(
            (vertical) =>
              String(
                vertical?.id
              ) ===
              String(
                selectedDepartment.verticalId
              )
          );


        mappedVertical =
          String(
            matchedVertical?.value ||
            ""
          ).trim();

      }

      // 4. vertical_id
      else if (
        selectedDepartment.vertical_id !==
          undefined &&
        selectedDepartment.vertical_id !==
          null
      ) {

        const matchedVertical =
          verticalList.find(
            (vertical) =>
              String(
                vertical?.id
              ) ===
              String(
                selectedDepartment.vertical_id
              )
          );


        mappedVertical =
          String(
            matchedVertical?.value ||
            ""
          ).trim();

      }

    }


    console.log(
      "Auto Selected Vertical:",
      mappedVertical
    );


    setFormData(
      (previous) => ({

        ...previous,

        department:
          departmentName,

        vertical:
          mappedVertical,

      })
    );

  };


  // ==========================================================
  // CANCEL
  // ==========================================================

  const handleCancel = () => {

    const confirmed =
      window.confirm(
        "Are you sure you want to cancel?"
      );


    if (confirmed) {

      navigate("/rfh");

    }

  };


  // ==========================================================
  // VALIDATION
  // ==========================================================

  const validateForm = () => {

    if (
      !formData.ticketNumber?.trim()
    ) {

      showToast(
        "error",
        "Ticket Number is required"
      );

      return false;

    }


    if (
      !formData.requestDate?.trim()
    ) {

      showToast(
        "error",
        "RFH Date is required"
      );

      return false;

    }


    if (
      !formData.business?.trim()
    ) {

      showToast(
        "error",
        "Business Unit is required"
      );

      return false;

    }


    if (
      !formData.department?.trim()
    ) {

      showToast(
        "error",
        "Department is required"
      );

      return false;

    }


    if (
      !formData.rollsOption?.trim()
    ) {

      showToast(
        "error",
        "Team / Role option is required"
      );

      return false;

    }


    if (
      !formData.positionTitle?.trim()
    ) {

      showToast(
        "error",
        "Job Title is required"
      );

      return false;

    }


    if (
      !formData.noOfPositions ||
      !String(
        formData.noOfPositions
      ).trim()
    ) {

      showToast(
        "error",
        "Positions count is required"
      );

      return false;

    }


    if (
      !formData.experience?.trim()
    ) {

      showToast(
        "error",
        "Experience is required"
      );

      return false;

    }


    if (
      !formData.qualification?.trim()
    ) {

      showToast(
        "error",
        "Qualification is required"
      );

      return false;

    }


    if (
      !formData.locationPreferred?.trim()
    ) {

      showToast(
        "error",
        "Location is required"
      );

      return false;

    }


    if (
      !formData.attendanceFormat?.trim()
    ) {

      showToast(
        "error",
        "Work Mode is required"
      );

      return false;

    }


    if (
      !formData.band?.trim()
    ) {

      showToast(
        "error",
        "Priority / Grade is required"
      );

      return false;

    }


    if (
      !formData.requestType?.trim()
    ) {

      showToast(
        "error",
        "Request Type is required"
      );

      return false;

    }


    if (
      !formData.replacementOf?.trim()
    ) {

      showToast(
        "error",
        "Replacement Of is required"
      );

      return false;

    }


    if (
      !formData.clientName?.trim()
    ) {

      showToast(
        "error",
        "Client Name is required"
      );

      return false;

    }


    return true;

  };


  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();


    if (
      !validateForm()
    ) {

      return;

    }


    try {

      setLoading(true);


      /*
       * IMPORTANT
       *
       * resId:
       * Do NOT generate from React.
       *
       * Backend generates:
       *
       * RFH001
       * RFH002
       * RFH003
       *
       *
       * ticketNumber:
       * User manually enters in UI.
       *
       * Example:
       *
       * TKT-1001
       */


      const payload = {

        /*
         * Keep resId only for update/reference.
         * Backend CREATE will ignore/generate it.
         */
        resId:
          id
            ? formData.resId?.trim() || null
            : null,


        /*
         * USER ENTERED TICKET NUMBER
         */
        ticketNumber:
          formData.ticketNumber?.trim() ||
          "",


        rollsOption:
          formData.rollsOption?.trim() ||
          "",

        name:
          formData.name?.trim() ||
          "",

        mobile:
          formData.mobile?.trim() ||
          "",

        email:
          formData.email?.trim() ||
          "",

        positionReports:
          formData.positionReports?.trim() ||
          "",

        reportEmail:
          formData.reportEmail?.trim() ||
          "",

        costCenter:
          formData.costCenter?.trim() ||
          "",

        approvedBy:
          formData.approvedBy?.trim() ||
          "",

        requestType:
          formData.requestType?.trim() ||
          "NEW",

        replacementOf:
          formData.requestType === "NEW"
            ? "NA"
            : (
                formData.replacementOf?.trim() ||
                ""
              ),

        approvalHire:
          formData.approvalHire?.trim() ||
          "YES",

        positionTitle:
          formData.positionTitle?.trim() ||
          "",

        location:
          formData.location?.trim() ||
          "",

        locationPreferred:
          formData.locationPreferred?.trim() ||
          "",

        business:
          formData.business?.trim() ||
          "",

        band:
          formData.band?.trim() ||
          "",

        division:
          formData.division?.trim() ||
          "",

        function:
          formData.function?.trim() ||
          "",

        noOfPositions:
          String(
            formData.noOfPositions ||
            ""
          ).trim(),

        jdRoles:
          formData.jdRoles?.trim() ||
          "",

        qualification:
          formData.qualification?.trim() ||
          "",

        essentialSkill:
          formData.essentialSkill?.trim() ||
          "",

        goodSkill:
          formData.goodSkill?.trim() ||
          "",

        experience:
          formData.experience?.trim() ||
          "",

        salaryRange:
          formData.salaryRange?.trim() ||
          "",

        salaryRangeAnnual:
          formData.salaryRangeAnnual?.trim() ||
          "",

        anySpecific:
          formData.anySpecific?.trim() ||
          "",

        deleteRemark:
          formData.deleteRemark?.trim() ||
          "",

        approvalHirePath:
          formData.approvalHirePath === "" ||
          formData.approvalHirePath === null ||
          formData.approvalHirePath === undefined

            ? 0

            : Number(
                formData.approvalHirePath
              ),

        requestDate:
          formData.requestDate?.trim() ||
          "",

        approveDate:
          formData.approveDate?.trim() ||
          "",

        department:
          formData.department?.trim() ||
          "",

        designation:
          formData.designation?.trim() ||
          "",

        vertical:
          formData.vertical?.trim() ||
          "",

        tenDoj:
          formData.tenDoj?.trim() ||
          "",

        empCategory:
          formData.empCategory?.trim() ||
          "",

        type:
          formData.type?.trim() ||
          "",

        attendanceFormat:
          formData.attendanceFormat?.trim() ||
          "",

        weekOff:
          formData.weekOff?.trim() ||
          "",

        ckSupervisior:
          formData.ckSupervisior?.trim() ||
          "",

        ckMail:
          formData.ckMail?.trim() ||
          "",

        approverId:
          formData.approverId?.trim() ||
          "",

        reporterId:
          formData.reporterId?.trim() ||
          "",

        clientName:
          formData.clientName?.trim() ||
          "STANCO",

      };


      console.log(
        "================================"
      );

      console.log(
        id
          ? "RFH UPDATE PAYLOAD"
          : "RFH CREATE PAYLOAD"
      );

      console.log(
        payload
      );

      console.log(
        "================================"
      );


      let response;


      // ====================================================
      // UPDATE
      // ====================================================

      if (id) {

        response =
          await api.put(
            `/rfh/${id}`,
            payload
          );

      }


      // ====================================================
      // CREATE
      // ====================================================

      else {

        response =
          await api.post(
            "/rfh",
            payload
          );

      }


      console.log(
        "RFH SUCCESS:",
        response.data
      );


      /*
       * Backend generated RFH number
       *
       * Example:
       * RFH001
       */
      const generatedRfhNumber =
        response?.data?.resId ||
        "";


      /*
       * UI entered ticket number
       */
      const savedTicketNumber =
        response?.data?.ticketNumber ||
        formData.ticketNumber ||
        "";


      showToast(
        "success",

        id

          ? `RFH ${generatedRfhNumber} updated successfully | Ticket: ${savedTicketNumber}`

          : `RFH ${generatedRfhNumber} created successfully | Ticket: ${savedTicketNumber}`
      );


      /*
       * Optional:
       * Show generated RFH number in console
       */
      console.log(
        "Generated RFH Number:",
        generatedRfhNumber
      );

      console.log(
        "Ticket Number:",
        savedTicketNumber
      );


      setTimeout(() => {

        navigate("/rfh");

      }, 1200);


    } catch (error) {

      console.error(
        "================================"
      );

      console.error(
        "RFH SAVE ERROR"
      );

      console.error(
        error
      );

      console.error(
        "STATUS:",
        error?.response?.status
      );

      console.error(
        "DATA:",
        error?.response?.data
      );

      console.error(
        "================================"
      );


      const backendData =
        error?.response?.data;


      let message =
        "Failed to save RFH";


      if (
        typeof backendData ===
        "string"
      ) {

        message =
          backendData;

      }

      else if (
        backendData?.message
      ) {

        message =
          backendData.message;

      }

      else if (
        backendData?.error
      ) {

        message =
          backendData.error;

      }

      else if (
        backendData?.errors
      ) {

        message =
          Object.values(
            backendData.errors
          ).join(", ");

      }


      showToast(
        "error",
        message
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================================
  // LOADING EDIT DATA
  // ==========================================================

  if (loadingData) {

    return (

      <div className="rfh-layout">

        <Sidebar />

        <main
          className="rfh-content"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >

          <div>
            Loading RFH Form
            details...
          </div>

        </main>

      </div>

    );

  }


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="rfh-layout">

      <Sidebar />


      {/* ====================================================
          TOAST
      ==================================================== */}

      {toast.show && (

        <div
          className={`toast-notification ${toast.type}`}
        >

          {toast.message}

        </div>

      )}


      <main className="rfh-content">

        <div className="rfh-card-container">


          {/* ==================================================
              HEADER
          ================================================== */}

          <div
            className="rfh-card-header-bar"
            style={{
              justifyContent: "center",
            }}
          >

            <h2
              style={{
                textTransform:
                  "uppercase",

                color:
                  "#e87706",
              }}
            >

              REQUEST FOR HIRE
              {" "}
              (RFH - HEPL)

            </h2>

          </div>


          {/* ==================================================
              FORM
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            className="rfh-single-form"
            style={{
              padding: "0",
              background:
                "transparent",
            }}
          >


            {/* =================================================
                BUSINESS / ROLE
            ================================================= */}

            <div
              className="rfh-form-card"
              style={{
                marginBottom:
                  "20px",
              }}
            >

              <div className="rfh-grid-container">


                <div className="col-span-3">

                  <SelectField
                    label="Business"
                    name="business"
                    value={
                      formData.business
                    }
                    onChange={
                      handleChange
                    }
                    options={
                      businessList
                    }
                    required
                  />

                </div>


                <div className="col-span-9">
                </div>


                {/* =================================================
                    TICKET NUMBER
                ================================================= */}

                <div className="col-span-3">

                  <InputField
                    label="Ticket Number"
                    name="ticketNumber"
                    value={
                      formData.ticketNumber
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter Ticket Number"
                    required
                  />

                </div>


                {/* =================================================
                    RFH NUMBER
                ================================================= */}

                <div className="col-span-3">

                  <InputField
                    label="RFH Number"
                    name="resId"
                    value={
                      formData.resId ||
                      "Generated after submit"
                    }
                    onChange={() => {}}
                    readOnly
                  />

                </div>


                <div className="col-span-6">
                </div>


                <div className="col-span-12">

                  <div className="rfh-field">

                    <label>

                      Request for hire:

                      <br />

                      <span
                        style={{
                          fontWeight:
                            "normal",

                          fontSize:
                            "11.5px",

                          color:
                            "#64748b",
                        }}
                      >

                        Please select
                        On Role option.
                        If this RFH is
                        for hiring on
                        your roles

                      </span>

                    </label>


                    <div className="rfh-radio-group">


                      <label className="rfh-radio-item">

                        <input
                          type="radio"
                          name="rollsOption"
                          value="Activity Outsourcing to HEPL"
                          checked={
                            formData.rollsOption ===
                            "Activity Outsourcing to HEPL"
                          }
                          onChange={
                            handleChange
                          }
                        />

                        Activity
                        Outsourcing to
                        HEPL

                      </label>


                      <label className="rfh-radio-item">

                        <input
                          type="radio"
                          name="rollsOption"
                          value="Manpower Outsourcing to HEPL"
                          checked={
                            formData.rollsOption ===
                            "Manpower Outsourcing to HEPL"
                          }
                          onChange={
                            handleChange
                          }
                        />

                        Manpower
                        Outsourcing to
                        HEPL

                      </label>


                      <label className="rfh-radio-item">

                        <input
                          type="radio"
                          name="rollsOption"
                          value="On Client Roll"
                          checked={
                            formData.rollsOption ===
                            "On Client Roll"
                          }
                          onChange={
                            handleChange
                          }
                        />

                        On Client
                        Roll

                      </label>


                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                REQUEST RAISED BY
            ================================================= */}

            <div className="rfh-form-card">

              <div className="rfh-grid-container">


                <div className="col-span-12">

                  <label
                    style={{
                      fontSize:
                        "12.5px",

                      fontWeight:
                        "600",

                      color:
                        "#475569",

                      borderBottom:
                        "1px solid #e2e8f0",

                      paddingBottom:
                        "8px",

                      display:
                        "block",
                    }}
                  >

                    Request raised
                    by:

                    <span className="required-star">
                      *
                    </span>

                  </label>

                </div>


                <div className="col-span-3">

                  <InputField
                    label="Name"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="col-span-3">

                  <InputField
                    label="Mobile number"
                    name="mobile"
                    value={
                      formData.mobile
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="col-span-3">

                  <InputField
                    label="Email address"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="col-span-3">

                  <SelectField
                    label="Position reports to"
                    name="positionReports"
                    value={
                      formData.positionReports
                    }
                    onChange={
                      handleChange
                    }
                    options={
                      teamList
                    }
                  />

                </div>


                <div className="col-span-3">

                  <InputField
                    label="Position reports Email"
                    name="reportEmail"
                    value={
                      formData.reportEmail
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="col-span-3">

                  <InputField
                    label="Request Date"
                    name="requestDate"
                    value={
                      formData.requestDate
                    }
                    onChange={
                      handleChange
                    }
                    type="date"
                    required
                  />

                </div>


                <div className="col-span-3">

                  <SelectField
                    label="Request Type"
                    name="requestType"
                    value={
                      formData.requestType
                    }
                    onChange={
                      handleChange
                    }
                    options={[
                      {
                        label: "NEW",
                        value: "NEW",
                      },
                      {
                        label:
                          "REPLACEMENT",
                        value:
                          "REPLACEMENT",
                      },
                    ]}
                    required
                  />

                </div>


                <div className="col-span-3">

                  <InputField
                    label="Approval Date"
                    name="approveDate"
                    value={
                      formData.approveDate
                    }
                    onChange={
                      handleChange
                    }
                    type="date"
                  />

                </div>


                <div className="col-span-3">

                  <SelectField
                    label="Approved by"
                    name="approvedBy"
                    value={
                      formData.approvedBy
                    }
                    onChange={
                      handleChange
                    }
                    options={
                      teamList
                    }
                    required
                  />

                </div>


                <div className="col-span-3">

                  <SelectField
                    label="Approval Type"
                    name="approvalHire"
                    value={
                      formData.approvalHire
                    }
                    onChange={
                      handleChange
                    }
                    options={[
                      {
                        label:
                          "YES",
                        value:
                          "YES",
                      },
                      {
                        label:
                          "NO",
                        value:
                          "NO",
                      },
                    ]}
                    required
                  />

                </div>


                <div className="col-span-3">

                  <InputField
                    label="Position Title"
                    name="positionTitle"
                    value={
                      formData.positionTitle
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                <div className="col-span-3">

                  <SelectField
                    label="Work Location"
                    name="location"
                    value={
                      formData.location
                    }
                    onChange={
                      handleChange
                    }
                    options={[
                      {
                        label:
                          "Remote",
                        value:
                          "Remote",
                      },
                      {
                        label:
                          "Onsite",
                        value:
                          "Onsite",
                      },
                      {
                        label:
                          "Hybrid",
                        value:
                          "Hybrid",
                      },
                    ]}
                    required
                  />

                </div>


                <div className="col-span-3">

                  <TextAreaField
                    label="Please mention location / Onsite Location preferred"
                    name="locationPreferred"
                    value={
                      formData.locationPreferred
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="col-span-3">

                  <SelectField
                    label="Grade/Band"
                    name="band"
                    value={
                      formData.band
                    }
                    onChange={
                      handleChange
                    }
                    options={[
                      {
                        label: "A",
                        value: "A",
                      },
                      {
                        label: "B",
                        value: "B",
                      },
                      {
                        label: "C",
                        value: "C",
                      },
                    ]}
                    required
                  />

                </div>


                <div className="col-span-3">

                  <SelectField
                    label="Department"
                    name="department"
                    value={
                      formData.department
                    }
                    onChange={
                      handleDepartmentChange
                    }
                    options={
                      departmentList
                    }
                    required
                  />

                </div>


                <div className="col-span-3">

                  <InputField
                    label="Vertical"
                    name="vertical"
                    value={
                      formData.vertical
                    }
                    onChange={() => {}}
                    readOnly
                    required
                  />

                </div>


                <div className="col-span-3">

                  <InputField
                    label="Function"
                    name="function"
                    value={
                      formData.function
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                <div className="col-span-3">

                  <InputField
                    label="No. of Positions"
                    name="noOfPositions"
                    value={
                      formData.noOfPositions
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                <div className="col-span-3">

                  <TextAreaField
                    label="JD / Roles & Responsibilities"
                    name="jdRoles"
                    value={
                      formData.jdRoles
                    }
                    onChange={
                      handleChange
                    }
                    helperText="(Please list as bullet points)"
                    required
                  />

                </div>


                <div className="col-span-3">

                  <InputField
                    label="Qualification"
                    name="qualification"
                    value={
                      formData.qualification
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                <div className="col-span-3">

                  <TextAreaField
                    label="Essential Skill sets"
                    name="essentialSkill"
                    value={
                      formData.essentialSkill
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                <div className="col-span-3">

                  <TextAreaField
                    label="Good to have Skill sets(If any)"
                    name="goodSkill"
                    value={
                      formData.goodSkill
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="col-span-3">

                  <SelectField
                    label="Employment Category"
                    name="empCategory"
                    value={
                      formData.empCategory
                    }
                    onChange={
                      handleChange
                    }
                    options={[
                      {
                        label:
                          "Full Time",
                        value:
                          "Full Time",
                      },
                      {
                        label:
                          "Contract",
                        value:
                          "Contract",
                      },
                    ]}
                  />

                </div>


                <div className="col-span-3">

                  <SelectField
                    label="Attendance Format"
                    name="attendanceFormat"
                    value={
                      formData.attendanceFormat
                    }
                    onChange={
                      handleChange
                    }
                    options={[
                      {
                        label:
                          "Biometric",
                        value:
                          "Biometric",
                      },
                      {
                        label:
                          "Manual",
                        value:
                          "Manual",
                      },
                      {
                        label:
                          "App Based",
                        value:
                          "App Based",
                      },
                    ]}
                  />

                </div>


                <div className="col-span-3">

                  <SelectField
                    label="Week Off"
                    name="weekOff"
                    value={
                      formData.weekOff
                    }
                    onChange={
                      handleChange
                    }
                    options={[
                      {
                        label:
                          "Saturday/Sunday",
                        value:
                          "Saturday/Sunday",
                      },
                      {
                        label:
                          "Sunday",
                        value:
                          "Sunday",
                      },
                    ]}
                  />

                </div>


                <div className="col-span-3">

                  <SelectField
                    label="Experience (in yrs)"
                    name="experience"
                    value={
                      formData.experience
                    }
                    onChange={
                      handleChange
                    }
                    options={[
                      {
                        label:
                          "0-2",
                        value:
                          "0-2",
                      },
                      {
                        label:
                          "3-5",
                        value:
                          "3-5",
                      },
                      {
                        label:
                          "6-10",
                        value:
                          "6-10",
                      },
                      {
                        label:
                          "10+",
                        value:
                          "10+",
                      },
                    ]}
                    required
                  />

                </div>


                <div className="col-span-3">

                  <InputField
                    label="Budgeted CTC (per month)"
                    name="salaryRange"
                    value={
                      formData.salaryRange
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter Month & CTC"
                    required
                  />

                </div>


                <div className="col-span-3">

                  <InputField
                    label="Budgeted CTC (per annum)"
                    name="salaryRangeAnnual"
                    value={
                      formData.salaryRangeAnnual
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter Annual CTC"
                    required
                  />

                </div>


                <div className="col-span-3">

                  <TextAreaField
                    label="Any other specific considerations/Add-on Share list"
                    name="anySpecific"
                    value={
                      formData.anySpecific
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="col-span-3">

                  <InputField
                    label="CKPL Reporting Manager (only for people outsourcing)"
                    name="ckSupervisior"
                    value={
                      formData.ckSupervisior
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="col-span-3">

                  <InputField
                    label="CKPL Reporting Manager's Email ID"
                    name="ckMail"
                    value={
                      formData.ckMail
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


              </div>

            </div>


            {/* =================================================
                BUTTONS
            ================================================= */}

            <div
              className="rfh-single-form-actions"
              style={{
                justifyContent:
                  "center",

                marginTop:
                  "30px",
              }}
            >

              <button
                type="button"
                onClick={
                  handleCancel
                }
                style={{
                  padding:
                    "0 30px",

                  marginRight:
                    "10px",
                }}
              >

                Cancel

              </button>


              <button
                type="submit"
                className="btn-rfh-submit"
                style={{
                  padding:
                    "0 40px",

                  background:
                    "#3b82f6",

                  borderRadius:
                    "4px",
                }}
                disabled={loading}
              >

                {loading

                  ? "Submitting..."

                  : id

                  ? "Update"

                  : "Submit"}

              </button>


            </div>


          </form>

        </div>

      </main>

    </div>

  );

}


export default RFHForm;