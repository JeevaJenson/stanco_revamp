import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Sidebar from "./Sidebar";
import { InputField, SelectField, TextAreaField } from "./FormFields";
import "../style/RFHForm.css";

/* =========================================================
   INITIAL FORM DATA
   ========================================================= */

const initialFormData = {
  resId: "",

  // Mandatory Backend Fields (Hidden)
  replacementOf: "N/A",
  deleteRemark: "",
  approvalHirePath: 0,
  requestBy: "Admin",

  // Basic Details
  costCenter: "",
  requestDate: new Date().toISOString().split("T")[0],
  requestType: "NEW",
  clientName: "STANCO",

  // Position Details
  positionTitle: "",
  location: "",
  business: "",
  vertical: "",
  noOfPositions: "",

  // Job Requirements
  jdRoles: "",
  qualification: "",
  essentialSkill: "",
  goodSkill: "",

  // Compensation & Category
  empCategory: "",
  experience: "",
  salaryRange: "",
  salaryRangeAnnual: "",
  type: "Financial Recruitment", 

  // Additional Info
  anySpecific: "",
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
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  /* DROPDOWNS */
  const [businessList, setBusinessList] = useState([]);

  /* =========================================================
     LOAD DATA
     ========================================================= */

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const busRes = await api.get("/business-masters");
        const activeBuses = (busRes.data || [])
          .filter((b) => String(b.status || "active").toLowerCase() === "active")
          .map((b) => ({ label: b.businessName, value: b.businessName }));
        if (activeBuses.length > 0) setBusinessList(activeBuses);
      } catch (error) {
        console.error("Error loading dropdown data:", error);
      }
    };
    loadDropdownData();
  }, []);

  useEffect(() => {
    if (id) {
      fetchRfhById(id);
    }
  }, [id]);

  const fetchRfhById = async (rfhId) => {
    try {
      setLoadingData(true);
      const response = await api.get(`/rfh/${rfhId}`);
      const backendData = response.data || {};
      
      if (!backendData.type) {
          backendData.type = "Financial Recruitment";
      }

      setFormData({ ...initialFormData, ...backendData });
    } catch (error) {
      console.error("RFH fetch error:", error);
      showToast("error", "Failed to load RFH details");
    } finally {
      setLoadingData(false);
    }
  };

  /* =========================================================
     HANDLERS
     ========================================================= */

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3500);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const val = type === "radio" ? (checked ? value : formData[name]) : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: val };
      if (name === "salaryRange") {
        const monthly = parseFloat(val);
        if (!isNaN(monthly)) {
          updated.salaryRangeAnnual = String(monthly * 12);
        } else if (val === "") {
          updated.salaryRangeAnnual = "";
        }
      }
      return updated;
    });
  };

  const validateForm = () => {
    if (!formData.costCenter?.trim()) { showToast("error", "Cost Center is required"); return false; }
    if (!formData.requestDate?.trim()) { showToast("error", "Request Date is required"); return false; }
    if (!formData.positionTitle?.trim()) { showToast("error", "Position Title is required"); return false; }
    if (!formData.business?.trim()) { showToast("error", "Business is required"); return false; }
    if (!formData.noOfPositions) { showToast("error", "No. of Positions is required"); return false; }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const { ticketNumber, ...payload } = formData;

      let response;
      if (!id) {
        response = await api.post("/rfh", payload);
      } else {
        response = await api.put(`/rfh/${id}`, payload);
      }

      showToast("success", id ? "RFH updated successfully" : "RFH created successfully");
      setTimeout(() => navigate("/allocation-list"), 1200);
    } catch (error) {
      console.error("RFH save error:", error);
      showToast("error", "Failed to save RFH");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     UI RENDER
     ========================================================= */

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
      {toast.show && <div className={`toast-notification ${toast.type}`}>{toast.message}</div>}

      <main className="rfh-content">
        
        {/* HEADER */}
        <header className="page-header" style={{ marginBottom: '20px' }}>
          <div className="header-title">
            <h2>REQUEST FOR HIRE (RFH) STANCO</h2>
            <p>Fill out the required details below</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="rfh-single-form" style={{ background: "transparent" }}>
          
          {/* REQUEST RAISED BY CARD */}
          <div className="rfh-form-card" style={{ marginBottom: "20px" }}>
            <h3 className="card-section-title" style={{ fontSize: "14px", fontWeight: "600", color: "#475569", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "16px" }}>Request raised by: *</h3>
            <div className="rfh-grid-container">
              <div className="col-span-12">
                <InputField label="Cost Center" name="costCenter" value={formData.costCenter} onChange={handleChange} required />
              </div>
            </div>
          </div>

          {/* MAIN DETAILS CARD */}
          <div className="rfh-form-card" style={{ marginBottom: "20px" }}>
            <div className="rfh-grid-container">
              
              {/* ROW 1 */}
              <div className="col-span-4">
                <InputField label="Request Date" name="requestDate" type="date" value={formData.requestDate} onChange={handleChange} required />
              </div>
              <div className="col-span-4">
                <SelectField label="Request Type" name="requestType" value={formData.requestType} onChange={handleChange} options={[{ label: "NEW", value: "NEW" }, { label: "REPLACEMENT", value: "REPLACEMENT" }]} required />
              </div>
              <div className="col-span-4">
                <InputField label="Client Name" name="clientName" value={formData.clientName} onChange={handleChange} required />
              </div>

              {/* ROW 2 */}
              <div className="col-span-6">
                <InputField label="Position Title" name="positionTitle" value={formData.positionTitle} onChange={handleChange} required />
              </div>
              <div className="col-span-6">
                <InputField label="Work Location" name="location" value={formData.location} onChange={handleChange} required />
              </div>

              {/* ROW 3 */}
              <div className="col-span-6">
                <SelectField label="Business" name="business" value={formData.business} onChange={handleChange} options={businessList} required />
              </div>
              <div className="col-span-6">
                <SelectField label="Vertical" name="vertical" value={formData.vertical} onChange={handleChange} options={[{ label: "IT", value: "IT" }, { label: "Non-IT", value: "Non-IT" }]} required />
              </div>

              {/* ROW 4 */}
              <div className="col-span-4">
                <InputField label="No. of Positions" name="noOfPositions" type="number" value={formData.noOfPositions} onChange={handleChange} required />
              </div>
              <div className="col-span-4">
                <TextAreaField label="JD / Roles & Responsibilities" name="jdRoles" value={formData.jdRoles} onChange={handleChange} placeholder="[Please list as bullet points / Please mention language skill sets required]" required />
              </div>
              <div className="col-span-4">
                <InputField label="Qualification" name="qualification" value={formData.qualification} onChange={handleChange} required />
              </div>

              {/* ROW 5 */}
              <div className="col-span-4">
                <TextAreaField label="Essential Skill sets" name="essentialSkill" value={formData.essentialSkill} onChange={handleChange} required />
              </div>
              <div className="col-span-4">
                <TextAreaField label="Good to have Skill sets (If any)" name="goodSkill" value={formData.goodSkill} onChange={handleChange} />
              </div>
              <div className="col-span-4">
                <SelectField label="Employment Category" name="empCategory" value={formData.empCategory} onChange={handleChange} options={[{ label: "Full Time", value: "Full Time" }, { label: "Contract", value: "Contract" }]} />
              </div>

              {/* ROW 6 */}
              <div className="col-span-3">
                <InputField label="Experience (in yrs)" name="experience" value={formData.experience} onChange={handleChange} required />
              </div>
              <div className="col-span-3">
                <InputField label="Maximum CTC(Per Month)" name="salaryRange" type="number" value={formData.salaryRange} onChange={handleChange} required />
              </div>
              <div className="col-span-3">
                <InputField label="Maximum CTC(Per Annum)" name="salaryRangeAnnual" type="number" value={formData.salaryRangeAnnual} onChange={handleChange} required />
              </div>
              <div className="col-span-3">
                <div className="rfh-field">
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "8px", display: "block" }}>Revenue Type <span className="required-star" style={{ color: "#ef4444" }}>*</span></label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                      <input type="radio" name="type" value="Financial Recruitment" checked={formData.type === "Financial Recruitment"} onChange={handleChange} />
                      Financial Recruitment
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                      <input type="radio" name="type" value="Non-Financial Recruitment" checked={formData.type === "Non-Financial Recruitment"} onChange={handleChange} />
                      Non-Financial Recruitment
                    </label>
                  </div>
                </div>
              </div>

              {/* ROW 7 */}
              <div className="col-span-12">
                <TextAreaField label="Any other specific consideration/Add (as Share to)" name="anySpecific" value={formData.anySpecific} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-actions" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
            <button type="submit" className="submit-btn" disabled={loading} style={{ padding: '12px 60px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}

export default RFHForm;