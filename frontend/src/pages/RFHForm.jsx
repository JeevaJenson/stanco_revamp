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

/* =========================================================
   INITIAL FORM DATA
   ========================================================= */

const initialFormData = {
  resId: "",

  // Request for hire
  rollsOption: "",

  // Request raised by
  requestBy: "",
  name: "",
  mobile: "",
  email: "",
  positionReports: "",
  reportEmail: "",

  // Approval
  costCenter: "",
  approvedBy: "",
  requestType: "NEW",
  replacementOf: "",
  approvalHire: "YES",

  // Position details
  positionTitle: "",
  location: "",
  locationPreferred: "",
  business: "",
  band: "",
  division: "",
  function: "",
  noOfPositions: "",

  // Job details
  jdRoles: "",
  qualification: "",
  essentialSkill: "",
  goodSkill: "",
  experience: "",

  // Salary
  salaryRange: "",
  salaryRangeAnnual: "",

  // Other
  anySpecific: "",
  deleteRemark: "",
  approvalHirePath: 0,

  // Dates
  requestDate: new Date().toISOString().split("T")[0],
  approveDate: "",

  // Organization
  department: "",
  designation: "",
  vertical: "",

  // Employment
  tenDoj: "",
  empCategory: "",
  type: "",
  attendanceFormat: "",
  weekOff: "",

  // Reporting
  ckSupervisior: "",
  ckMail: "",
  approverId: "",
  reporterId: "",

  // Client
  clientName: "STANCO",
};

/* =========================================================
   COMPONENT
   ========================================================= */

function RFHForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState(initialFormData);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  /* =========================================================
     DROPDOWN LISTS
     ========================================================= */

  const [businessList, setBusinessList] = useState([
    {
      label: "CKLP",
      value: "CKLP",
    },
    {
      label: "STANCO",
      value: "STANCO",
    },
  ]);

  const [departmentList, setDepartmentList] = useState([
    {
      label: "BUSINESS",
      value: "BUSINESS",
    },
    {
      label: "Human Resources",
      value: "Human Resources",
    },
    {
      label: "IT",
      value: "IT",
    },
  ]);

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

  /* =========================================================
     LOAD DROPDOWN DATA
     ========================================================= */

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [busRes, deptRes, teamRes] = await Promise.all([
          api.get("/business-masters"),
          api.get("/departments"),
          api.get("/teams"),
        ]);

        /* BUSINESS */

        const activeBuses = (busRes.data || [])
          .filter(
            (b) =>
              String(b.status || "active").toLowerCase() === "active"
          )
          .map((b) => ({
            label: b.businessName,
            value: b.businessName,
          }));

        if (activeBuses.length > 0) {
          setBusinessList(activeBuses);
        }

        /* DEPARTMENT */

        const activeDepts = (deptRes.data || [])
          .filter(
            (d) =>
              String(d.status || "active").toLowerCase() === "active"
          )
          .map((d) => ({
            label: d.name,
            value: d.name,
          }));

        if (activeDepts.length > 0) {
          setDepartmentList(activeDepts);
        }

        /* TEAM */

        const activeTeams = (teamRes.data || [])
          .filter(
            (t) =>
              String(t.status ?? 1) === "1" ||
              String(t.status || "").toLowerCase() === "active"
          )
          .map((t) => ({
            label: t.name,
            value: t.name,
          }));

        if (activeTeams.length > 0) {
          setTeamList(activeTeams);
        }
      } catch (error) {
        console.error("Error loading dropdown data:", error);
      }
    };

    loadDropdownData();
  }, []);

  /* =========================================================
     LOAD EDIT DATA / LOGGED-IN USER
     ========================================================= */

  useEffect(() => {
    if (id) {
      fetchRfhById(id);
    } else {
      const currentUserStr = localStorage.getItem("user");

      let currentUserObj = null;

      try {
        currentUserObj = currentUserStr
          ? JSON.parse(currentUserStr)
          : null;
      } catch (error) {
        console.error("User JSON parse error:", error);
      }

      setFormData((prev) => ({
        ...prev,

        requestBy:
          currentUserObj?.name ||
          currentUserObj?.employeeName ||
          currentUserObj?.username ||
          "Admin",

        name:
          currentUserObj?.name ||
          currentUserObj?.employeeName ||
          currentUserObj?.username ||
          "",
      }));
    }
  }, [id]);

  /* =========================================================
     FETCH RFH BY ID
     ========================================================= */

  const fetchRfhById = async (rfhId) => {
    try {
      setLoadingData(true);

      const response = await api.get(`/rfh/${rfhId}`);

      const backendData = response.data || {};

      setFormData({
        ...initialFormData,
        ...backendData,

        /*
         * Backend may return RFH Number.
         * We do NOT display/edit it in frontend.
         */
      });
    } catch (error) {
      console.error("RFH fetch error:", error);

      showToast(
        "error",
        error?.response?.data?.message ||
          "Failed to load RFH details"
      );
    } finally {
      setLoadingData(false);
    }
  };

  /* =========================================================
     TOAST
     ========================================================= */

  const showToast = (type, message) => {
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

  /* =========================================================
     HANDLE INPUT CHANGE
     ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================================
     CANCEL
     ========================================================= */

  const handleCancel = () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel?"
    );

    if (confirmed) {
      navigate("/rfh");
    }
  };

  /* =========================================================
     VALIDATION
     ========================================================= */

  const validateForm = () => {
    if (!formData.requestDate?.trim()) {
      showToast("error", "RFH Date is required");
      return false;
    }

    if (!formData.requestBy?.trim()) {
      showToast("error", "Requested By is required");
      return false;
    }

    if (!formData.business?.trim()) {
      showToast("error", "Business Unit is required");
      return false;
    }

    if (!formData.department?.trim()) {
      showToast("error", "Department is required");
      return false;
    }

    if (!formData.rollsOption?.trim()) {
      showToast("error", "Request for Hire type is required");
      return false;
    }

    if (!formData.positionTitle?.trim()) {
      showToast("error", "Job Title is required");
      return false;
    }

    if (
      !formData.noOfPositions ||
      !String(formData.noOfPositions).trim()
    ) {
      showToast("error", "Positions count is required");
      return false;
    }

    if (!formData.experience?.trim()) {
      showToast("error", "Experience is required");
      return false;
    }

    if (!formData.qualification?.trim()) {
      showToast("error", "Qualification is required");
      return false;
    }

    if (!formData.locationPreferred?.trim()) {
      showToast("error", "Location is required");
      return false;
    }

    if (!formData.attendanceFormat?.trim()) {
      showToast("error", "Work Mode is required");
      return false;
    }

    if (!formData.band?.trim()) {
      showToast("error", "Priority / Grade is required");
      return false;
    }

    return true;
  };

  /* =========================================================
     SUBMIT RFH
     ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    /* Validate */
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      /*
       * IMPORTANT:
       *
       * RFH NUMBER IS NOT GENERATED IN FRONTEND.
       *
       * If ticketNumber exists anywhere in old state/backend response,
       * remove it before sending data to backend.
       */

      const { ticketNumber, resId, requestBy, ...rfhData } = formData;

      /* =====================================================
         PAYLOAD
         ===================================================== */

      const payload = {
        ...rfhData,
        replacementOf: formData.replacementOf?.trim() ? formData.replacementOf : "N/A",
        approvalHirePath:
          formData.approvalHirePath === ""
            ? 0
            : Number(formData.approvalHirePath),
      };

      // Only include resId and requestBy if they actually have a value
      if (resId?.trim()) payload.resId = resId;
      if (requestBy?.trim()) payload.requestBy = requestBy;

      console.log("================================");
      console.log("RFH SUBMIT PAYLOAD");
      console.log("================================");
      console.log(payload);
      console.log("================================");

      let response;

      /* =====================================================
         CREATE
         ===================================================== */

      if (!id) {
        response = await api.post("/rfh", payload);
      }

      /* =====================================================
         UPDATE
         ===================================================== */

      if (id) {
        response = await api.put(`/rfh/${id}`, payload);
      }

      console.log("RFH BACKEND RESPONSE:", response?.data);

      /* =====================================================
         SUCCESS
         ===================================================== */

      showToast(
        "success",
        id
          ? "RFH updated successfully"
          : "RFH created successfully"
      );

      /*
       * Backend can generate RFH Number here.
       *
       * Example backend response:
       *
       * {
       *   success: true,
       *   message: "RFH created successfully",
       *   rfhNumber: "RFH-2026-0001"
       * }
       */

      setTimeout(() => {
        navigate("/rfh");
      }, 1200);
    } catch (error) {
      console.error("RFH save error:", error);

      console.error(
        "Backend response:",
        error?.response?.data
      );

      let errMsg = "Failed to save RFH";
      if (error?.response?.data) {
        if (typeof error.response.data === 'string') {
          errMsg = error.response.data;
        } else if (error.response.data.message) {
          errMsg = error.response.data.message;
        } else if (error.response.data.error) {
          errMsg = error.response.data.error;
        } else if (error.response.data.errors) {
          // Spring Boot validation errors array
          errMsg = JSON.stringify(error.response.data.errors);
        } else {
          errMsg = JSON.stringify(error.response.data);
        }
      } else if (error?.message) {
        errMsg = error.message;
      }

      showToast(
        "error",
        errMsg
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     LOADING
     ========================================================= */

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
          <div>Loading RFH Form details...</div>
        </main>
      </div>
    );
  }

  /* =========================================================
     UI
     ========================================================= */

  return (
    <div className="rfh-layout">
      <Sidebar />

      {/* TOAST */}

      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <main className="rfh-content">
        <div className="rfh-card-container">

          {/* =================================================
              HEADER
              ================================================= */}

          <div
            className="rfh-card-header-bar"
            style={{
              justifyContent: "center",
            }}
          >
            <h2
              style={{
                textTransform: "uppercase",
              }}
            >
              REQUEST FOR HIRE (RFH)
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rfh-single-form"
            style={{
              background: "transparent",
            }}
          >

            {/* =================================================
                CARD 1 - REQUEST FOR HIRE
                ================================================= */}

            <div
              className="rfh-form-card"
              style={{
                marginBottom: "20px",
              }}
            >
              <div className="rfh-grid-container">

                {/* BUSINESS */}

                <div className="col-span-3">
                  <SelectField
                    label="Business"
                    name="business"
                    value={formData.business}
                    onChange={handleChange}
                    options={businessList}
                    required
                  />
                </div>

                <div className="col-span-9"></div>

                {/* REQUEST FOR HIRE */}

                <div className="col-span-12">
                  <div className="rfh-field">

                    <label>
                      Request for hire:
                      <br />

                      <span
                        style={{
                          fontWeight: "normal",
                          fontSize: "11.5px",
                          color: "#64748b",
                        }}
                      >
                        Please select On Role option. If this RFH
                        is for hiring on your roles
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
                          onChange={handleChange}
                        />

                        Activity Outsourcing to HEPL
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
                          onChange={handleChange}
                        />

                        Manpower Outsourcing to HEPL
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
                          onChange={handleChange}
                        />

                        On Client Roll
                      </label>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                CARD 2 - MAIN FORM
                ================================================= */}

            <div className="rfh-form-card">

              <div className="rfh-grid-container">

                {/* =================================================
                    REQUEST RAISED BY
                    ================================================= */}

                <div className="col-span-12">

                  <label
                    style={{
                      fontSize: "12.5px",
                      fontWeight: "600",
                      color: "#475569",
                      borderBottom:
                        "1px solid #e2e8f0",
                      paddingBottom: "8px",
                      display: "block",
                    }}
                  >
                    Request raised by:
                    <span className="required-star">
                      *
                    </span>
                  </label>

                </div>

                {/* NAME */}

                <div className="col-span-3">
                  <InputField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                {/* MOBILE */}

                <div className="col-span-3">
                  <InputField
                    label="Mobile number"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </div>

                {/* EMAIL */}

                <div className="col-span-3">
                  <InputField
                    label="Email address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* POSITION REPORTS */}

                <div className="col-span-3">
                  <SelectField
                    label="Position reports to"
                    name="positionReports"
                    value={formData.positionReports}
                    onChange={handleChange}
                    options={teamList}
                  />
                </div>

                {/* REPORT EMAIL */}

                <div className="col-span-3">
                  <InputField
                    label="Position reports Email"
                    name="reportEmail"
                    value={formData.reportEmail}
                    onChange={handleChange}
                  />
                </div>

                {/* REQUEST DATE */}

                <div className="col-span-3">
                  <InputField
                    label="Request Date"
                    name="requestDate"
                    value={formData.requestDate}
                    onChange={handleChange}
                    type="date"
                    required
                  />
                </div>

                {/* REQUEST TYPE */}

                <div className="col-span-3">
                  <SelectField
                    label="Request Type"
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleChange}
                    options={[
                      {
                        label: "NEW",
                        value: "NEW",
                      },
                      {
                        label: "REPLACEMENT",
                        value: "REPLACEMENT",
                      },
                    ]}
                    required
                  />
                </div>

                {/* APPROVAL DATE */}

                <div className="col-span-3">
                  <InputField
                    label="Approval Date"
                    name="approveDate"
                    value={formData.approveDate}
                    onChange={handleChange}
                    type="date"
                  />
                </div>

                {/* APPROVED BY */}

                <div className="col-span-3">
                  <SelectField
                    label="Approved by"
                    name="approvedBy"
                    value={formData.approvedBy}
                    onChange={handleChange}
                    options={teamList}
                  />
                </div>

                {/* APPROVAL TYPE */}

                <div className="col-span-3">
                  <SelectField
                    label="Approval Type"
                    name="approvalHire"
                    value={formData.approvalHire}
                    onChange={handleChange}
                    options={[
                      {
                        label: "YES",
                        value: "YES",
                      },
                      {
                        label: "NO",
                        value: "NO",
                      },
                    ]}
                  />
                </div>

                {/* POSITION TITLE */}

                <div className="col-span-3">
                  <InputField
                    label="Position Title"
                    name="positionTitle"
                    value={formData.positionTitle}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* WORK LOCATION */}

                <div className="col-span-3">
                  <SelectField
                    label="Work Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    options={[
                      {
                        label: "Remote",
                        value: "Remote",
                      },
                      {
                        label: "Onsite",
                        value: "Onsite",
                      },
                      {
                        label: "Hybrid",
                        value: "Hybrid",
                      },
                    ]}
                  />
                </div>

                {/* LOCATION */}

                <div className="col-span-3">
                  <TextAreaField
                    label="Please mention location / Onsite Location preferred"
                    name="locationPreferred"
                    value={formData.locationPreferred}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* GRADE / BAND */}

                <div className="col-span-3">
                  <SelectField
                    label="Grade/Band"
                    name="band"
                    value={formData.band}
                    onChange={handleChange}
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

                {/* DEPARTMENT */}

                <div className="col-span-3">
                  <SelectField
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    options={departmentList}
                    required
                  />
                </div>

                {/* VERTICAL */}

                <div className="col-span-3">
                  <SelectField
                    label="Vertical"
                    name="vertical"
                    value={formData.vertical}
                    onChange={handleChange}
                    options={departmentList}
                  />
                </div>

                {/* FUNCTION */}

                <div className="col-span-3">
                  <InputField
                    label="Function"
                    name="function"
                    value={formData.function}
                    onChange={handleChange}
                  />
                </div>

                {/* NO OF POSITIONS */}

                <div className="col-span-3">
                  <InputField
                    label="No. of Positions"
                    name="noOfPositions"
                    value={formData.noOfPositions}
                    onChange={handleChange}
                    type="number"
                    required
                  />
                </div>

                {/* JD */}

                <div className="col-span-3">
                  <TextAreaField
                    label="JD / Roles & Responsibilities"
                    name="jdRoles"
                    value={formData.jdRoles}
                    onChange={handleChange}
                    helperText="(Please list as bullet points)"
                    required
                  />
                </div>

                {/* QUALIFICATION */}

                <div className="col-span-3">
                  <InputField
                    label="Qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* ESSENTIAL SKILLS */}

                <div className="col-span-3">
                  <TextAreaField
                    label="Essential Skill sets"
                    name="essentialSkill"
                    value={formData.essentialSkill}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* GOOD SKILLS */}

                <div className="col-span-3">
                  <TextAreaField
                    label="Good to have Skill sets (If any)"
                    name="goodSkill"
                    value={formData.goodSkill}
                    onChange={handleChange}
                  />
                </div>

                {/* EMPLOYMENT CATEGORY */}

                <div className="col-span-3">
                  <SelectField
                    label="Employment Category"
                    name="empCategory"
                    value={formData.empCategory}
                    onChange={handleChange}
                    options={[
                      {
                        label: "Full Time",
                        value: "Full Time",
                      },
                      {
                        label: "Contract",
                        value: "Contract",
                      },
                    ]}
                  />
                </div>

                {/* ATTENDANCE */}

                <div className="col-span-3">
                  <SelectField
                    label="Attendance Format"
                    name="attendanceFormat"
                    value={formData.attendanceFormat}
                    onChange={handleChange}
                    options={[
                      {
                        label: "Biometric",
                        value: "Biometric",
                      },
                      {
                        label: "Manual",
                        value: "Manual",
                      },
                      {
                        label: "App Based",
                        value: "App Based",
                      },
                    ]}
                    required
                  />
                </div>

                {/* WEEK OFF */}

                <div className="col-span-3">
                  <SelectField
                    label="Week Off"
                    name="weekOff"
                    value={formData.weekOff}
                    onChange={handleChange}
                    options={[
                      {
                        label: "Saturday/Sunday",
                        value: "Saturday/Sunday",
                      },
                      {
                        label: "Sunday",
                        value: "Sunday",
                      },
                    ]}
                  />
                </div>

                {/* EXPERIENCE */}

                <div className="col-span-3">
                  <SelectField
                    label="Experience (in yrs)"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    options={[
                      {
                        label: "0-2",
                        value: "0-2",
                      },
                      {
                        label: "3-5",
                        value: "3-5",
                      },
                      {
                        label: "6-10",
                        value: "6-10",
                      },
                      {
                        label: "10+",
                        value: "10+",
                      },
                    ]}
                    required
                  />
                </div>

                {/* MONTHLY CTC */}

                <div className="col-span-3">
                  <InputField
                    label="Budgeted CTC (per month)"
                    name="salaryRange"
                    value={formData.salaryRange}
                    onChange={handleChange}
                    placeholder="Enter Monthly CTC"
                  />
                </div>

                {/* ANNUAL CTC */}

                <div className="col-span-3">
                  <InputField
                    label="Budgeted CTC (per annum)"
                    name="salaryRangeAnnual"
                    value={formData.salaryRangeAnnual}
                    onChange={handleChange}
                    placeholder="Enter Annual CTC"
                  />
                </div>

                {/* OTHER CONSIDERATION */}

                <div className="col-span-3">
                  <TextAreaField
                    label="Any other specific considerations / Add-on Share list"
                    name="anySpecific"
                    value={formData.anySpecific}
                    onChange={handleChange}
                  />
                </div>

                {/* CKPL MANAGER */}

                <div className="col-span-3">
                  <InputField
                    label="CKPL Reporting Manager (only for people outsourcing)"
                    name="ckSupervisior"
                    value={formData.ckSupervisior}
                    onChange={handleChange}
                  />
                </div>

                {/* CKPL EMAIL */}

                <div className="col-span-3">
                  <InputField
                    label="CKPL Reporting Manager's Email ID"
                    name="ckMail"
                    value={formData.ckMail}
                    onChange={handleChange}
                  />
                </div>

              </div>
            </div>

            {/* =================================================
                ACTION BUTTONS
                ================================================= */}

            <div
              className="rfh-single-form-actions"
              style={{
                justifyContent: "center",
                marginTop: "30px",
                gap: "15px",
              }}
            >

              {/* CANCEL */}

              <button
                type="button"
                onClick={handleCancel}
                className="btn-rfh-cancel"
                disabled={loading}
              >
                Cancel
              </button>

              {/* SUBMIT */}

              <button
                type="submit"
                className="btn-rfh-submit"
                style={{
                  padding: "0 40px",
                  background: "#381932",
                  borderRadius: "4px",
                }}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>

            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default RFHForm;