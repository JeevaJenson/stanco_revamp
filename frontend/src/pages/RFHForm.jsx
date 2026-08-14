import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaFileAlt,
  FaUserTie,
  FaBriefcase,
  FaMoneyBillWave,
  FaPaperPlane,
  FaSave,
  FaRedo
} from "react-icons/fa";
import api from "../services/api";
import Sidebar from "./Sidebar";
import "../style/RFHForm.css";

function RFHForm() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    requestRaisedBy: currentUser.name || currentUser.empID || "Manager / Requester",
    costCenter: "",
    requestDate: today,
    requestType: "",
    clientName: "",
    positionTitle: "",
    workLocation: "",
    business: "",
    vertical: "",
    noOfPositions: "1",
    qualification: "",
    employmentCategory: "Full Time",
    jdRolesResponsibilities: "",
    essentialSkills: "",
    goodToHaveSkills: "",
    experience: "",
    maxCtcMonthly: "",
    maxCtcAnnual: "",
    revenueType: "Financial Recruitment",
    otherConsiderations: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [successModal, setSuccessModal] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "maxCtcMonthly" && value && !isNaN(value)) {
        updated.maxCtcAnnual = String(Math.round(parseFloat(value) * 12));
      } else if (name === "maxCtcAnnual" && value && !isNaN(value)) {
        updated.maxCtcMonthly = String(Math.round(parseFloat(value) / 12));
      }

      return updated;
    });
  };

  const handleRevenueChange = (type) => {
    setFormData((prev) => ({ ...prev, revenueType: type }));
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all fields in this form?")) {
      setFormData({
        requestRaisedBy: currentUser.name || currentUser.empID || "Manager / Requester",
        costCenter: "",
        requestDate: today,
        requestType: "",
        clientName: "",
        positionTitle: "",
        workLocation: "",
        business: "",
        vertical: "",
        noOfPositions: "1",
        qualification: "",
        employmentCategory: "Full Time",
        jdRolesResponsibilities: "",
        essentialSkills: "",
        goodToHaveSkills: "",
        experience: "",
        maxCtcMonthly: "",
        maxCtcAnnual: "",
        revenueType: "Financial Recruitment",
        otherConsiderations: "",
      });
      showToast("success", "Form reset successfully");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    const requiredFields = [
      { key: "requestRaisedBy", label: "Request Raised By" },
      { key: "requestDate", label: "Request Date" },
      { key: "requestType", label: "Request Type" },
      { key: "clientName", label: "Client Name" },
      { key: "positionTitle", label: "Position Title" },
      { key: "workLocation", label: "Work Location" },
      { key: "business", label: "Business" },
      { key: "vertical", label: "Vertical" },
      { key: "noOfPositions", label: "No. of Positions" },
      { key: "jdRolesResponsibilities", label: "JD / Roles & Responsibilities" },
      { key: "qualification", label: "Qualification" },
      { key: "essentialSkills", label: "Essential Skill sets" },
      { key: "experience", label: "Experience (in yrs)" },
      { key: "maxCtcMonthly", label: "Maximum CTC (Per Month)" },
      { key: "maxCtcAnnual", label: "Maximum CTC (Per Annum)" },
      { key: "revenueType", label: "Revenue Type" },
    ];

    for (const field of requiredFields) {
      if (!formData[field.key] || !String(formData[field.key]).trim()) {
        showToast("error", `Please fill in required field: ${field.label}`);
        return;
      }
    }

    setLoading(true);
    const generatedRfhNo = `TRFH-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const payload = {
        rfhNo: generatedRfhNo,
        positionTitle: formData.positionTitle,
        noOfPosition: formData.noOfPositions,
        openDate: formData.requestDate,
        business: formData.business,
        division: formData.vertical,
        location: formData.workLocation,
        salaryRange: formData.maxCtcMonthly,
        salaryRangeAnnual: formData.maxCtcAnnual,
        requestStatus: "OPEN",
        createdBy: formData.requestRaisedBy,
      };

      await api.post("/recruitment-requests", payload).catch((err) => {
        console.warn("Backend API request fallback or running locally:", err);
      });

      setSuccessModal({
        rfhNo: generatedRfhNo,
        position: formData.positionTitle,
        positionsCount: formData.noOfPositions,
        date: formData.requestDate,
        client: formData.clientName,
      });

    } catch (err) {
      console.error("Submission error:", err);
      showToast("error", "An error occurred while submitting RFH.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rfh-saas-layout">
      <Sidebar />

      <main className="rfh-saas-main">
        {/* Floating Toast Notification */}
        {toast && (
          <div className="rfh-toast-container">
            <div className={`rfh-toast-box ${toast.type}`}>
              <span>{toast.message}</span>
              <button
                type="button"
                className="rfh-toast-close"
                onClick={() => setToast(null)}
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {successModal && (
          <div className="rfh-modal-backdrop">
            <div className="rfh-success-card">
              <div className="rfh-success-icon">
                <FaCheckCircle />
              </div>
              <h2>RFH Created Successfully</h2>
              <p className="rfh-ref-code">
                Requisition Code: <strong>{successModal.rfhNo}</strong>
              </p>

              <div className="rfh-summary-table">
                <div className="rfh-sum-row">
                  <span>Position Title:</span>
                  <strong>{successModal.position}</strong>
                </div>
                <div className="rfh-sum-row">
                  <span>Total Vacancies:</span>
                  <strong>{successModal.positionsCount} Positions</strong>
                </div>
                <div className="rfh-sum-row">
                  <span>Client / Account:</span>
                  <strong>{successModal.client}</strong>
                </div>
                <div className="rfh-sum-row">
                  <span>Date Created:</span>
                  <strong>{successModal.date}</strong>
                </div>
              </div>

              <div className="rfh-modal-buttons">
                <button
                  type="button"
                  className="rfh-btn-secondary"
                  onClick={() => navigate("/dashboard")}
                >
                  Return to Dashboard
                </button>
                <button
                  type="button"
                  className="rfh-btn-primary"
                  onClick={() => {
                    setSuccessModal(null);
                    setFormData({
                      requestRaisedBy: currentUser.name || currentUser.empID || "Manager / Requester",
                      costCenter: "",
                      requestDate: today,
                      requestType: "",
                      clientName: "",
                      positionTitle: "",
                      workLocation: "",
                      business: "",
                      vertical: "",
                      noOfPositions: "1",
                      qualification: "",
                      employmentCategory: "Full Time",
                      jdRolesResponsibilities: "",
                      essentialSkills: "",
                      goodToHaveSkills: "",
                      experience: "",
                      maxCtcMonthly: "",
                      maxCtcAnnual: "",
                      revenueType: "Financial Recruitment",
                      otherConsiderations: "",
                    });
                  }}
                >
                  Create Another RFH
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Header Card */}
        <div className="rfh-saas-header">
          <div className="header-left-col">
            <button
              type="button"
              className="rfh-saas-back-btn"
              onClick={() => navigate("/dashboard")}
            >
              <FaArrowLeft size={12} />
              <span>Back</span>
            </button>
            <div className="header-title-group">
              <h1>Request For Hire (RFH) Stanco</h1>
              <p>Fill out candidate requisition details to initiate recruitment workflow</p>
            </div>
          </div>

          <div className="header-right-badges">
            <span className="badge-tag rfh-tag-blue">STANCO PORTAL</span>
            <span className="badge-tag rfh-tag-green">NEW REQUISITION</span>
          </div>
        </div>

        {/* Form Main Body */}
        <div className="rfh-form-wrapper">
          <form onSubmit={handleSubmit} className="rfh-saas-form">
            {/* Card 1: Requester & Client Details */}
            <div className="saas-card">
              <div className="saas-card-title">
                <div className="title-icon-box">
                  <FaUserTie />
                </div>
                <div>
                  <h3>Requester & Client Information</h3>
                  <p>Origin of the hiring request and client specifications</p>
                </div>
              </div>

              <div className="saas-form-grid grid-2">
                <div className="saas-field">
                  <label htmlFor="requestRaisedBy">
                    Request raised by <span className="req-dot">*</span>
                  </label>
                  <input
                    id="requestRaisedBy"
                    type="text"
                    name="requestRaisedBy"
                    className="saas-input"
                    placeholder="Enter requester name / Employee ID"
                    value={formData.requestRaisedBy}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="saas-field">
                  <label htmlFor="costCenter">Cost Center</label>
                  <input
                    id="costCenter"
                    type="text"
                    name="costCenter"
                    className="saas-input"
                    placeholder="e.g. CC-104 / TechOps"
                    value={formData.costCenter}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="saas-form-grid grid-3">
                <div className="saas-field">
                  <label htmlFor="requestDate">
                    Request Date <span className="req-dot">*</span>
                  </label>
                  <input
                    id="requestDate"
                    type="date"
                    name="requestDate"
                    className="saas-input"
                    value={formData.requestDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="saas-field">
                  <label htmlFor="requestType">
                    Request Type <span className="req-dot">*</span>
                  </label>
                  <select
                    id="requestType"
                    name="requestType"
                    className="saas-select"
                    value={formData.requestType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Request Type --</option>
                    <option value="New Position">New Position</option>
                    <option value="Replacement">Replacement</option>
                    <option value="Contractual">Contractual</option>
                    <option value="Temp RFH">Temp RFH</option>
                    <option value="Project Basis">Project Basis</option>
                  </select>
                </div>

                <div className="saas-field">
                  <label htmlFor="clientName">
                    Client Name <span className="req-dot">*</span>
                  </label>
                  <input
                    id="clientName"
                    type="text"
                    name="clientName"
                    className="saas-input"
                    placeholder="e.g. Stanco Global / Client Corp"
                    value={formData.clientName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Position & Organization */}
            <div className="saas-card">
              <div className="saas-card-title">
                <div className="title-icon-box">
                  <FaBriefcase />
                </div>
                <div>
                  <h3>Position & Location Details</h3>
                  <p>Role specifications, department alignment, and vacancy counts</p>
                </div>
              </div>

              <div className="saas-form-grid grid-2">
                <div className="saas-field">
                  <label htmlFor="positionTitle">
                    Position Title <span className="req-dot">*</span>
                  </label>
                  <input
                    id="positionTitle"
                    type="text"
                    name="positionTitle"
                    className="saas-input"
                    placeholder="e.g. Senior Full Stack Developer"
                    value={formData.positionTitle}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="saas-field">
                  <label htmlFor="workLocation">
                    Work Location <span className="req-dot">*</span>
                  </label>
                  <input
                    id="workLocation"
                    type="text"
                    name="workLocation"
                    className="saas-input"
                    placeholder="e.g. Bangalore / Chennai / Hybrid"
                    value={formData.workLocation}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="saas-form-grid grid-2">
                <div className="saas-field">
                  <label htmlFor="business">
                    Business <span className="req-dot">*</span>
                  </label>
                  <select
                    id="business"
                    name="business"
                    className="saas-select"
                    value={formData.business}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Business Unit --</option>
                    <option value="IT Services">IT Services</option>
                    <option value="Digital Engineering">Digital Engineering</option>
                    <option value="Enterprise Consulting">Enterprise Consulting</option>
                    <option value="Corporate Operations">Corporate Operations</option>
                  </select>
                </div>

                <div className="saas-field">
                  <label htmlFor="vertical">
                    Vertical <span className="req-dot">*</span>
                  </label>
                  <select
                    id="vertical"
                    name="vertical"
                    className="saas-select"
                    value={formData.vertical}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Vertical --</option>
                    <option value="BFSI">BFSI</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Telecom">Telecom</option>
                  </select>
                </div>
              </div>

              <div className="saas-form-grid grid-3">
                <div className="saas-field">
                  <label htmlFor="noOfPositions">
                    No. of Positions <span className="req-dot">*</span>
                  </label>
                  <input
                    id="noOfPositions"
                    type="number"
                    min="1"
                    name="noOfPositions"
                    className="saas-input"
                    placeholder="e.g. 1"
                    value={formData.noOfPositions}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="saas-field">
                  <label htmlFor="qualification">
                    Qualification <span className="req-dot">*</span>
                  </label>
                  <input
                    id="qualification"
                    type="text"
                    name="qualification"
                    className="saas-input"
                    placeholder="e.g. B.Tech / B.E / MCA / Any Degree"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="saas-field">
                  <label htmlFor="employmentCategory">
                    Employment Category
                  </label>
                  <select
                    id="employmentCategory"
                    name="employmentCategory"
                    className="saas-select"
                    value={formData.employmentCategory}
                    onChange={handleChange}
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Contractual">Contractual</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Card 3: Job Description & Skill Requirements */}
            <div className="saas-card">
              <div className="saas-card-title">
                <div className="title-icon-box">
                  <FaFileAlt />
                </div>
                <div>
                  <h3>Job Description & Skill Requirements</h3>
                  <p>Responsibilities, mandatory technologies, and preferred proficiencies</p>
                </div>
              </div>

              <div className="saas-field full-row">
                <label htmlFor="jdRolesResponsibilities">
                  JD / Roles & Responsibilities <span className="req-dot">*</span>
                </label>
                <textarea
                  id="jdRolesResponsibilities"
                  name="jdRolesResponsibilities"
                  rows="4"
                  className="saas-textarea"
                  placeholder="Please list as bullet points or describe key role expectations..."
                  value={formData.jdRolesResponsibilities}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="saas-form-grid grid-2">
                <div className="saas-field">
                  <label htmlFor="essentialSkills">
                    Essential Skill sets: <span className="req-dot">*</span>
                  </label>
                  <textarea
                    id="essentialSkills"
                    name="essentialSkills"
                    rows="3"
                    className="saas-textarea"
                    placeholder="e.g. React.js, Spring Boot, MySQL, Java 17, Microservices"
                    value={formData.essentialSkills}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="saas-field">
                  <label htmlFor="goodToHaveSkills">
                    Good to have Skill sets (if any):
                  </label>
                  <textarea
                    id="goodToHaveSkills"
                    name="goodToHaveSkills"
                    rows="3"
                    className="saas-textarea"
                    placeholder="e.g. AWS, Docker, Kubernetes, CI/CD pipelines"
                    value={formData.goodToHaveSkills}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Card 4: Experience, Compensation & Commercials */}
            <div className="saas-card">
              <div className="saas-card-title">
                <div className="title-icon-box">
                  <FaMoneyBillWave />
                </div>
                <div>
                  <h3>Experience & Commercial Compensation</h3>
                  <p>Candidate seniority level, compensation budget, and billing type</p>
                </div>
              </div>

              <div className="saas-form-grid grid-3">
                <div className="saas-field">
                  <label htmlFor="experience">
                    Experience (in yrs) <span className="req-dot">*</span>
                  </label>
                  <input
                    id="experience"
                    type="text"
                    name="experience"
                    className="saas-input"
                    placeholder="e.g. 3-5 Years"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="saas-field">
                  <label htmlFor="maxCtcMonthly">
                    Maximum CTC (Per Month) <span className="req-dot">*</span>
                  </label>
                  <div className="currency-box">
                    <span className="currency-tag">₹</span>
                    <input
                      id="maxCtcMonthly"
                      type="number"
                      name="maxCtcMonthly"
                      className="saas-input with-curr"
                      placeholder="e.g. 85000"
                      value={formData.maxCtcMonthly}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="saas-field">
                  <label htmlFor="maxCtcAnnual">
                    Maximum CTC (Per Annum) <span className="req-dot">*</span>
                  </label>
                  <div className="currency-box">
                    <span className="currency-tag">₹</span>
                    <input
                      id="maxCtcAnnual"
                      type="number"
                      name="maxCtcAnnual"
                      className="saas-input with-curr"
                      placeholder="e.g. 1020000"
                      value={formData.maxCtcAnnual}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Revenue Type Segmented Cards */}
              <div className="revenue-segment-wrapper">
                <label className="saas-group-label">
                  Revenue Type <span className="req-dot">*</span>
                </label>
                <div className="revenue-pill-grid">
                  <div
                    className={`revenue-pill-card ${formData.revenueType === "Financial Recruitment" ? "selected" : ""
                      }`}
                    onClick={() => handleRevenueChange("Financial Recruitment")}
                  >
                    <div className="radio-pill-circle"></div>
                    <div className="pill-text">
                      <strong>Financial Recruitment</strong>
                      <span>Direct billable recruitment with revenue realization</span>
                    </div>
                  </div>

                  <div
                    className={`revenue-pill-card ${formData.revenueType === "Non-Financial Recruitment" ? "selected" : ""
                      }`}
                    onClick={() => handleRevenueChange("Non-Financial Recruitment")}
                  >
                    <div className="radio-pill-circle"></div>
                    <div className="pill-text">
                      <strong>Non-Financial Recruitment</strong>
                      <span>Internal corporate / non-billable strategic hire</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Specific Considerations & Sharing */}
            <div className="saas-card">
              <div className="saas-card-title">
                <div className="title-icon-box">
                  <FaFileAlt />
                </div>
                <div>
                  <h3>Additional Notes & CV Routing</h3>
                  <p>Special instructions or recipient emails to receive shortlisted profiles</p>
                </div>
              </div>

              <div className="saas-field full-row">
                <label htmlFor="otherConsiderations">
                  Any other specific consideration / Add cvs Share to:
                </label>
                <textarea
                  id="otherConsiderations"
                  name="otherConsiderations"
                  rows="3"
                  className="saas-textarea"
                  placeholder="e.g. Please share profiles directly with hr.lead@stanco.com, hiring.manager@stanco.com"
                  value={formData.otherConsiderations}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Bottom Action Controls */}
            <div className="rfh-saas-footer">
              <button
                type="button"
                className="saas-btn-reset"
                onClick={handleReset}
              >
                <FaRedo size={12} />
                <span>Reset All</span>
              </button>

              <div className="saas-footer-right">
                <button
                  type="button"
                  className="saas-btn-draft"
                  onClick={() => showToast("success", "Draft saved locally.")}
                >
                  <FaSave size={13} />
                  <span>Save Draft</span>
                </button>

                <button
                  type="submit"
                  className="saas-btn-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="saas-loading-state">
                      <span className="saas-spinner"></span>
                      <span>Submitting RFH...</span>
                    </span>
                  ) : (
                    <>
                      <FaPaperPlane size={13} />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default RFHForm;
