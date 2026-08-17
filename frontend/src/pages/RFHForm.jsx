import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaTimes,
  FaFileAlt,
  FaCalendarAlt,
  FaUser,
  FaBuilding,
  FaBriefcase,
  FaUsers,
  FaPaperPlane,
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
} from "react-icons/fa";
import api from "../services/api";
import Sidebar from "./Sidebar";
import "../style/RFHForm.css";

/* =========================================================
   INITIAL FORM DATA
========================================================= */

const initialFormData = {
  resId: "",
  rollsOption: "",
  name: "",
  mobile: "",
  email: "",
  positionReports: "",
  reportEmail: "",
  costCenter: "",
  approvedBy: "",

  requestType: "NEW",
  replacementOf: "",
  approvalHire: "YES",
  ticketNumber: "",

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

  requestDate: new Date().toISOString().split("T")[0],
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
};

/* =========================================================
   INPUT FIELD WITH ICON
========================================================= */

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
  icon: Icon,
  readOnly = false,
}) => {
  return (
    <div className="rfh-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required-star">*</span>}
      </label>
      <div className="rfh-input-wrapper">
        {Icon && <Icon className="rfh-input-icon" />}
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          readOnly={readOnly}
          style={{ paddingLeft: Icon ? "38px" : "14px" }}
        />
      </div>
    </div>
  );
};

/* =========================================================
   SELECT FIELD WITH ICON
========================================================= */

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  icon: Icon,
}) => {
  return (
    <div className="rfh-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required-star">*</span>}
      </label>
      <div className="rfh-input-wrapper">
        {Icon && <Icon className="rfh-input-icon" />}
        <select
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          style={{ paddingLeft: Icon ? "38px" : "14px" }}
        >
          <option value="">Select</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

/* =========================================================
   TEXTAREA FIELD
========================================================= */

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  helperText = "",
  maxLength,
}) => {
  return (
    <div className="rfh-field rfh-full-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required-star">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      <div className="rfh-textarea-footer">
        {helperText && <span className="rfh-helper-text">{helperText}</span>}
        {maxLength && (
          <span className="rfh-char-counter">
            {(value || "").length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   MAIN FORM COMPONENT
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

  const [businessList, setBusinessList] = useState([
    { label: "CKLP", value: "CKLP" },
    { label: "STANCO", value: "STANCO" }
  ]);
  const [departmentList, setDepartmentList] = useState([
    { label: "BUSINESS", value: "BUSINESS" },
    { label: "Human Resources", value: "Human Resources" },
    { label: "IT", value: "IT" }
  ]);
  const [teamList, setTeamList] = useState([
    { label: "CKPL", value: "CKPL" },
    { label: "STANCO", value: "STANCO" }
  ]);

  // Load dropdown lists and set default values
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [busRes, deptRes, teamRes] = await Promise.all([
          api.get("/business-masters"),
          api.get("/departments"),
          api.get("/teams")
        ]);
        
        const activeBuses = (busRes.data || [])
          .filter(b => String(b.status || "active").toLowerCase() === "active")
          .map(b => ({ label: b.businessName, value: b.businessName }));
        if (activeBuses.length > 0) setBusinessList(activeBuses);

        const activeDepts = (deptRes.data || [])
          .filter(d => String(d.status || "active").toLowerCase() === "active")
          .map(d => ({ label: d.name, value: d.name }));
        if (activeDepts.length > 0) setDepartmentList(activeDepts);

        const activeTeams = (teamRes.data || [])
          .filter(t => String(t.status ?? 1) === "1" || String(t.status || "").toLowerCase() === "active")
          .map(t => ({ label: t.name, value: t.name }));
        if (activeTeams.length > 0) setTeamList(activeTeams);
      } catch (err) {
        console.error("Error loading dropdown data:", err);
      }
    };
    loadDropdownData();
  }, []);

  // Fetch RFH details on edit mode
  useEffect(() => {
    if (id) {
      fetchRfhById(id);
    } else {
      // Auto-set the requestBy field to the logged-in user name
      const currentUserStr = localStorage.getItem("user");
      const currentUserObj = currentUserStr ? JSON.parse(currentUserStr) : null;
      setFormData(prev => ({
        ...prev,
        requestBy: currentUserObj?.name || "Admin",
      }));
    }
  }, [id]);

  const fetchRfhById = async (rfhId) => {
    try {
      setLoadingData(true);
      const response = await api.get(`/rfh/${rfhId}`);
      setFormData({
        ...initialFormData,
        ...(response.data || {}),
      });
    } catch (error) {
      console.error("RFH fetch error:", error);
      showToast("error", error?.response?.data?.message || "Failed to load RFH details");
    } finally {
      setLoadingData(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: "", message: "" });
    }, 3500);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    const confirmed = window.confirm("Are you sure you want to cancel?");
    if (confirmed) {
      navigate("/rfh");
    }
  };

  const validateForm = () => {
    if (!formData.ticketNumber?.trim()) {
      showToast("error", "RFH Number is required");
      return false;
    }
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
      showToast("error", "Team is required");
      return false;
    }
    if (!formData.positionTitle?.trim()) {
      showToast("error", "Job Title is required");
      return false;
    }
    if (!formData.type?.trim()) {
      showToast("error", "Job Type is required");
      return false;
    }
    if (!formData.noOfPositions || !String(formData.noOfPositions).trim()) {
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
      showToast("error", "Priority is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        ...formData,
        approvalHirePath: formData.approvalHirePath === "" ? 0 : Number(formData.approvalHirePath),
      };

      let response;
      if (id) {
        response = await api.put(`/rfh/${id}`, payload);
      } else {
        response = await api.post("/rfh", payload);
      }

      showToast("success", id ? "RFH updated successfully" : "RFH created successfully");
      setTimeout(() => {
        navigate("/rfh");
      }, 1200);
    } catch (error) {
      console.error("RFH save error:", error);
      showToast("error", error?.response?.data?.message || error?.response?.data?.error || "Failed to save RFH");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="rfh-layout">
        <Sidebar />
        <main className="rfh-content" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div>Loading RFH Form details...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="rfh-layout">
      <Sidebar />

      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <main className="rfh-content">
        <div className="rfh-card-container">
          
          {/* HEADER TITLE BAR */}
          <div className="rfh-card-header-bar">
            <FaFileAlt className="header-bar-icon" />
            <h2>{id ? "Update RFH" : "Create RFH"}</h2>
          </div>

          <form onSubmit={handleSubmit} className="rfh-single-form">
            
            {/* 1. RFH DETAILS */}
            <div className="rfh-form-card">
              <div className="rfh-form-card-title">
                <FaFileAlt className="card-title-icon" />
                <h3>RFH DETAILS</h3>
              </div>
              <div className="rfh-form-grid-3col">
                <InputField
                  label="RFH Number"
                  name="ticketNumber"
                  value={formData.ticketNumber}
                  onChange={handleChange}
                  placeholder="RFH-2026-0001"
                  required
                  icon={FaFileAlt}
                />
                <InputField
                  label="RFH Date"
                  name="requestDate"
                  value={formData.requestDate}
                  onChange={handleChange}
                  type="date"
                  required
                  icon={FaCalendarAlt}
                />
                <SelectField
                  label="Requested By"
                  name="requestBy"
                  value={formData.requestBy}
                  onChange={handleChange}
                  options={[
                    { label: formData.requestBy || "Admin", value: formData.requestBy || "Admin" },
                    { label: "Admin", value: "Admin" },
                    { label: "Hiring Manager", value: "Hiring Manager" },
                    { label: "Recruiter", value: "Recruiter" }
                  ]}
                  icon={FaUser}
                />
                <SelectField
                  label="Business Unit"
                  name="business"
                  value={formData.business}
                  onChange={handleChange}
                  options={businessList}
                  required
                  icon={FaBuilding}
                />
                <SelectField
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  options={departmentList}
                  required
                  icon={FaBriefcase}
                />
                <SelectField
                  label="Team"
                  name="rollsOption"
                  value={formData.rollsOption}
                  onChange={handleChange}
                  options={teamList}
                  required
                  icon={FaUsers}
                />
              </div>
            </div>

            {/* 2. JOB DETAILS */}
            <div className="rfh-form-card">
              <div className="rfh-form-card-title">
                <FaBriefcase className="card-title-icon" />
                <h3>JOB DETAILS</h3>
              </div>
              <div className="rfh-form-grid-3col">
                <InputField
                  label="Job Title"
                  name="positionTitle"
                  value={formData.positionTitle}
                  onChange={handleChange}
                  placeholder="Enter job title"
                  required
                />
                <SelectField
                  label="Job Type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  options={[
                    { label: "Full Time", value: "Full Time" },
                    { label: "Contract", value: "Contract" },
                    { label: "Part Time", value: "Part Time" }
                  ]}
                  required
                />
                <InputField
                  label="Positions"
                  name="noOfPositions"
                  value={formData.noOfPositions}
                  onChange={handleChange}
                  placeholder="Enter number of positions"
                  required
                />
                <InputField
                  label="Experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Enter experience (e.g., 2-5 years)"
                  required
                />
                <InputField
                  label="Qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="Enter qualification"
                  required
                />
                <InputField
                  label="Location"
                  name="locationPreferred"
                  value={formData.locationPreferred}
                  onChange={handleChange}
                  placeholder="Enter location"
                  required
                />
                <SelectField
                  label="Work Mode"
                  name="attendanceFormat"
                  value={formData.attendanceFormat}
                  onChange={handleChange}
                  options={[
                    { label: "Hybrid", value: "HYBRID" },
                    { label: "Work From Office", value: "OFFICE" },
                    { label: "Work From Home", value: "REMOTE" }
                  ]}
                  required
                />
                <SelectField
                  label="Priority"
                  name="band"
                  value={formData.band}
                  onChange={handleChange}
                  options={[
                    { label: "High", value: "High" },
                    { label: "Medium", value: "Medium" },
                    { label: "Low", value: "Low" }
                  ]}
                  required
                />
                <InputField
                  label="Joining Date"
                  name="tenDoj"
                  value={formData.tenDoj}
                  onChange={handleChange}
                  type="date"
                  icon={FaCalendarAlt}
                />
              </div>
            </div>

            {/* 3. SKILLS */}
            <div className="rfh-form-card">
              <div className="rfh-form-card-title">
                <FaUsers className="card-title-icon" />
                <h3>SKILLS</h3>
              </div>
              <TextAreaField
                label="Required Skills"
                name="essentialSkill"
                value={formData.essentialSkill}
                onChange={handleChange}
                placeholder="Enter required skills (e.g., Java, React, SQL, ...)"
                helperText="Separate skills with comma"
              />
            </div>

            {/* 4. JOB DESCRIPTION */}
            <div className="rfh-form-card">
              <div className="rfh-form-card-title">
                <FaFileAlt className="card-title-icon" />
                <h3>JOB DESCRIPTION</h3>
              </div>
              
              {/* Rich Text Editor Mockup / Styled Area */}
              <div className="rfh-field rfh-full-field">
                <label>Job Description</label>
                <div className="rfh-editor-wrapper">
                  <div className="rfh-editor-toolbar">
                    <button type="button" className="toolbar-btn"><FaBold /></button>
                    <button type="button" className="toolbar-btn"><FaItalic /></button>
                    <button type="button" className="toolbar-btn"><FaUnderline /></button>
                    <span className="toolbar-separator">|</span>
                    <button type="button" className="toolbar-btn"><FaListUl /></button>
                    <button type="button" className="toolbar-btn"><FaListOl /></button>
                  </div>
                  <textarea
                    name="jdRoles"
                    value={formData.jdRoles ?? ""}
                    onChange={handleChange}
                    placeholder="Enter job description..."
                    maxLength={2000}
                    className="rfh-editor-textarea"
                  />
                  <div className="rfh-editor-footer">
                    <span className="rfh-char-counter">
                      {(formData.jdRoles || "").length} / 2000
                    </span>
                  </div>
                </div>
              </div>

              <TextAreaField
                label="Additional Notes (Optional)"
                name="anySpecific"
                value={formData.anySpecific}
                onChange={handleChange}
                placeholder="Enter any additional notes..."
              />
            </div>

            {/* BOTTOM ACTIONS BAR */}
            <div className="rfh-single-form-actions">
              <button
                type="button"
                className="btn-rfh-cancel"
                onClick={handleCancel}
              >
                <FaTimes />
                Cancel
              </button>
              <button
                type="submit"
                className="btn-rfh-submit"
                disabled={loading}
              >
                <FaPaperPlane />
                {loading ? "Submitting..." : id ? "Update RFH" : "Submit RFH"}
              </button>
            </div>

          </form>

        </div>
      </main>
    </div>
  );
}

export default RFHForm;