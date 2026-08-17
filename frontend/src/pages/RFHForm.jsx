import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaSave,
  FaTimes,
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

  requestType: "",
  replacementOf: "",
  approvalHire: "",
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

  requestDate: "",
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

  clientName: "",
};


/* =========================================================
   STEPS
========================================================= */

const steps = [
  {
    id: 1,
    title: "Request Details",
    shortTitle: "Request",
  },
  {
    id: 2,
    title: "Employee & Reporting",
    shortTitle: "Employee",
  },
  {
    id: 3,
    title: "Position Details",
    shortTitle: "Position",
  },
  {
    id: 4,
    title: "Skills & Qualification",
    shortTitle: "Skills",
  },
  {
    id: 5,
    title: "Salary Details",
    shortTitle: "Salary",
  },
  {
    id: 6,
    title: "Employment Details",
    shortTitle: "Employment",
  },
];


/* =========================================================
   INPUT FIELD
   IMPORTANT:
   This component is OUTSIDE RFHForm.
   This fixes input focus issue.
========================================================= */

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
}) => {
  return (
    <div className="rfh-field">

      <label htmlFor={name}>
        {label}

        {required && (
          <span className="required-star">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
      />

    </div>
  );
};


/* =========================================================
   SELECT FIELD
========================================================= */

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
}) => {
  return (
    <div className="rfh-field">

      <label htmlFor={name}>
        {label}

        {required && (
          <span className="required-star">
            *
          </span>
        )}
      </label>

      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
      >

        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}

      </select>

    </div>
  );
};


/* =========================================================
   TEXT AREA FIELD
========================================================= */

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
}) => {
  return (
    <div className="rfh-field rfh-full-field">

      <label htmlFor={name}>
        {label}

        {required && (
          <span className="required-star">
            *
          </span>
        )}
      </label>

      <textarea
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
      />

    </div>
  );
};


/* =========================================================
   MAIN COMPONENT
========================================================= */

function RFHForm() {

  const navigate = useNavigate();

  const { id } = useParams();


  /* =======================================================
     STATE
  ======================================================= */

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] =
    useState(initialFormData);

  const [loading, setLoading] =
    useState(false);

  const [loadingData, setLoadingData] =
    useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });


  /* =======================================================
     TOAST
  ======================================================= */

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


  /* =======================================================
     FETCH EDIT DATA
  ======================================================= */

  useEffect(() => {

    if (id) {
      fetchRfhById(id);
    }

  }, [id]);


  const fetchRfhById = async (rfhId) => {

    try {

      setLoadingData(true);

      const response =
        await api.get(`/rfh/${rfhId}`);

      setFormData({
        ...initialFormData,
        ...(response.data || {}),
      });

    } catch (error) {

      console.error(
        "RFH fetch error:",
        error
      );

      showToast(
        "error",
        error?.response?.data?.message ||
          "Failed to load RFH details"
      );

    } finally {

      setLoadingData(false);

    }
  };


  /* =======================================================
     HANDLE INPUT
  ======================================================= */

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateStep = () => {

    /* -----------------------------------------------------
       STEP 1
    ----------------------------------------------------- */

    if (currentStep === 1) {

      if (
        !String(
          formData.requestType || ""
        ).trim()
      ) {

        showToast(
          "error",
          "Request Type is required"
        );

        return false;
      }


      if (
        !String(
          formData.replacementOf || ""
        ).trim()
      ) {

        showToast(
          "error",
          "Replacement Of is required"
        );

        return false;
      }


      return true;
    }


    /* -----------------------------------------------------
       STEP 2
    ----------------------------------------------------- */

    if (currentStep === 2) {

      if (
        formData.mobile &&
        !/^[0-9]{10}$/.test(
          formData.mobile
        )
      ) {

        showToast(
          "error",
          "Mobile number must contain 10 digits"
        );

        return false;
      }


      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          formData.email
        )
      ) {

        showToast(
          "error",
          "Please enter a valid email"
        );

        return false;
      }


      if (
        formData.reportEmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          formData.reportEmail
        )
      ) {

        showToast(
          "error",
          "Please enter a valid report email"
        );

        return false;
      }


      return true;
    }


    /* -----------------------------------------------------
       STEP 3
    ----------------------------------------------------- */

    if (currentStep === 3) {

      if (
        !String(
          formData.positionTitle || ""
        ).trim()
      ) {

        showToast(
          "error",
          "Position Title is required"
        );

        return false;
      }


      if (
        !String(
          formData.noOfPositions || ""
        ).trim()
      ) {

        showToast(
          "error",
          "Number of Positions is required"
        );

        return false;
      }


      if (
        !String(
          formData.clientName || ""
        ).trim()
      ) {

        showToast(
          "error",
          "Client Name is required"
        );

        return false;
      }


      return true;
    }


    /* -----------------------------------------------------
       STEP 4
    ----------------------------------------------------- */

    if (currentStep === 4) {
      return true;
    }


    /* -----------------------------------------------------
       STEP 5
    ----------------------------------------------------- */

    if (currentStep === 5) {
      return true;
    }


    /* -----------------------------------------------------
       STEP 6
    ----------------------------------------------------- */

    if (currentStep === 6) {
      return true;
    }


    return true;
  };


  /* =======================================================
     NEXT
  ======================================================= */

  const handleNext = () => {

    if (!validateStep()) {
      return;
    }


    if (
      currentStep < steps.length
    ) {

      setCurrentStep(
        (previous) =>
          previous + 1
      );


      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };


  /* =======================================================
     BACK
  ======================================================= */

  const handleBack = () => {

    if (currentStep > 1) {

      setCurrentStep(
        (previous) =>
          previous - 1
      );


      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };


  /* =======================================================
     CANCEL
  ======================================================= */

  const handleCancel = () => {

    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this RFH?"
      );

    if (confirmed) {
      navigate("/dashboard");
    }
  };


  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (event) => {

    event.preventDefault();


    if (!validateStep()) {
      return;
    }


    try {

      setLoading(true);


      const payload = {
        ...formData,

        approvalHirePath:
          formData.approvalHirePath === ""
            ? 0
            : Number(
                formData.approvalHirePath
              ),
      };


      let response;


      /* UPDATE */

      if (id) {

        response = await api.put(
          `/rfh/${id}`,
          payload
        );

      }

      /* CREATE */

      else {

        response = await api.post(
          "/rfh",
          payload
        );
      }


      console.log(
        "RFH saved:",
        response.data
      );


      showToast(
        "success",
        id
          ? "RFH updated successfully"
          : "RFH created successfully"
      );


      setTimeout(() => {

        navigate("/rfh");

      }, 1200);

    } catch (error) {

      console.error(
        "RFH save error:",
        error
      );


      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to save RFH";


      showToast(
        "error",
        message
      );

    } finally {

      setLoading(false);

    }
  };


  /* =======================================================
     STEP 1
  ======================================================= */

  const renderStepOne = () => {

    return (

      <div className="rfh-form-grid">

        <SelectField
          label="Request Type"
          name="requestType"
          value={formData.requestType}
          onChange={handleChange}
          required
          options={[
            {
              value: "NEW",
              label: "New",
            },
            {
              value: "REPLACEMENT",
              label: "Replacement",
            },
            {
              value: "ADDITIONAL",
              label: "Additional",
            },
          ]}
        />


        <InputField
          label="Replacement Of"
          name="replacementOf"
          value={formData.replacementOf}
          onChange={handleChange}
          required
          placeholder="Enter replacement employee"
        />


        <SelectField
          label="Rolls Option"
          name="rollsOption"
          value={formData.rollsOption}
          onChange={handleChange}
          options={[
            {
              value: "INTERNAL",
              label: "Internal",
            },
            {
              value: "EXTERNAL",
              label: "External",
            },
          ]}
        />


        <SelectField
          label="Approval Hire"
          name="approvalHire"
          value={formData.approvalHire}
          onChange={handleChange}
          options={[
            {
              value: "YES",
              label: "Yes",
            },
            {
              value: "NO",
              label: "No",
            },
          ]}
        />


        <InputField
          label="Ticket Number"
          name="ticketNumber"
          value={formData.ticketNumber}
          onChange={handleChange}
          placeholder="Enter ticket number"
        />


        <InputField
          label="Request Date"
          name="requestDate"
          value={formData.requestDate}
          onChange={handleChange}
          type="date"
        />


        <InputField
          label="Approve Date"
          name="approveDate"
          value={formData.approveDate}
          onChange={handleChange}
          type="date"
        />


        <InputField
          label="Approval Hire Path"
          name="approvalHirePath"
          value={formData.approvalHirePath}
          onChange={handleChange}
          type="number"
          placeholder="Enter approval path"
        />

      </div>
    );
  };


  /* =======================================================
     STEP 2
  ======================================================= */

  const renderStepTwo = () => {

    return (

      <div className="rfh-form-grid">

        <InputField
          label="Employee Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter employee name"
        />


        <InputField
          label="Mobile"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          type="tel"
          placeholder="10 digit mobile number"
        />


        <InputField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          placeholder="Enter email"
        />


        <InputField
          label="Position Reports"
          name="positionReports"
          value={formData.positionReports}
          onChange={handleChange}
          placeholder="Enter reporting position"
        />


        <InputField
          label="Report Email"
          name="reportEmail"
          value={formData.reportEmail}
          onChange={handleChange}
          type="email"
          placeholder="Enter report email"
        />


        <InputField
          label="Cost Center"
          name="costCenter"
          value={formData.costCenter}
          onChange={handleChange}
          placeholder="Enter cost center"
        />


        <InputField
          label="Approved By"
          name="approvedBy"
          value={formData.approvedBy}
          onChange={handleChange}
          placeholder="Enter approver"
        />


        <InputField
          label="Reporter ID"
          name="reporterId"
          value={formData.reporterId}
          onChange={handleChange}
          placeholder="Enter reporter ID"
        />


        <InputField
          label="Approver ID"
          name="approverId"
          value={formData.approverId}
          onChange={handleChange}
          placeholder="Enter approver ID"
        />

      </div>
    );
  };


  /* =======================================================
     STEP 3
  ======================================================= */

  const renderStepThree = () => {

    return (

      <div className="rfh-form-grid">

        <InputField
          label="Position Title"
          name="positionTitle"
          value={formData.positionTitle}
          onChange={handleChange}
          required
          placeholder="Enter position title"
        />


        <InputField
          label="No. Of Positions"
          name="noOfPositions"
          value={formData.noOfPositions}
          onChange={handleChange}
          required
          type="number"
          placeholder="Enter number"
        />


        <InputField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter location"
        />


        <InputField
          label="Preferred Location"
          name="locationPreferred"
          value={formData.locationPreferred}
          onChange={handleChange}
          placeholder="Enter preferred location"
        />


        <InputField
          label="Business"
          name="business"
          value={formData.business}
          onChange={handleChange}
          placeholder="Enter business"
        />


        <InputField
          label="Band"
          name="band"
          value={formData.band}
          onChange={handleChange}
          placeholder="Enter band"
        />


        <InputField
          label="Division"
          name="division"
          value={formData.division}
          onChange={handleChange}
          placeholder="Enter division"
        />


        <InputField
          label="Function"
          name="function"
          value={formData.function}
          onChange={handleChange}
          placeholder="Enter function"
        />


        <InputField
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="Enter department"
        />


        <InputField
          label="Designation"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="Enter designation"
        />


        <InputField
          label="Vertical"
          name="vertical"
          value={formData.vertical}
          onChange={handleChange}
          placeholder="Enter vertical"
        />


        <InputField
          label="Client Name"
          name="clientName"
          value={formData.clientName}
          onChange={handleChange}
          required
          placeholder="Enter client name"
        />

      </div>
    );
  };


  /* =======================================================
     STEP 4
  ======================================================= */

  const renderStepFour = () => {

    return (

      <div className="rfh-form-grid">

        <InputField
          label="Qualification"
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
          placeholder="Enter qualification"
        />


        <InputField
          label="Experience"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Example: 3-5 years"
        />


        <TextAreaField
          label="JD / Roles"
          name="jdRoles"
          value={formData.jdRoles}
          onChange={handleChange}
          placeholder="Enter job description / roles"
        />


        <TextAreaField
          label="Essential Skills"
          name="essentialSkill"
          value={formData.essentialSkill}
          onChange={handleChange}
          placeholder="Enter essential skills"
        />


        <TextAreaField
          label="Good Skills"
          name="goodSkill"
          value={formData.goodSkill}
          onChange={handleChange}
          placeholder="Enter good-to-have skills"
        />

      </div>
    );
  };


  /* =======================================================
     STEP 5
  ======================================================= */

  const renderStepFive = () => {

    return (

      <div className="rfh-form-grid">

        <InputField
          label="Salary Range"
          name="salaryRange"
          value={formData.salaryRange}
          onChange={handleChange}
          placeholder="Example: 30,000 - 40,000"
        />


        <InputField
          label="Annual Salary Range"
          name="salaryRangeAnnual"
          value={formData.salaryRangeAnnual}
          onChange={handleChange}
          placeholder="Example: 4 LPA - 6 LPA"
        />


        <TextAreaField
          label="Any Specific Requirement"
          name="anySpecific"
          value={formData.anySpecific}
          onChange={handleChange}
          placeholder="Enter any specific requirement"
        />

      </div>
    );
  };


  /* =======================================================
     STEP 6
  ======================================================= */

  const renderStepSix = () => {

    return (

      <div className="rfh-form-grid">

        <InputField
          label="Ten DOJ"
          name="tenDoj"
          value={formData.tenDoj}
          onChange={handleChange}
          type="date"
        />


        <InputField
          label="Employee Category"
          name="empCategory"
          value={formData.empCategory}
          onChange={handleChange}
          placeholder="Enter employee category"
        />


        <InputField
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="Enter employment type"
        />


        <SelectField
          label="Attendance Format"
          name="attendanceFormat"
          value={formData.attendanceFormat}
          onChange={handleChange}
          options={[
            {
              value: "OFFICE",
              label: "Office",
            },
            {
              value: "HYBRID",
              label: "Hybrid",
            },
            {
              value: "REMOTE",
              label: "Remote",
            },
          ]}
        />


        <InputField
          label="Week Off"
          name="weekOff"
          value={formData.weekOff}
          onChange={handleChange}
          placeholder="Example: Saturday / Sunday"
        />


        <InputField
          label="Supervisor"
          name="ckSupervisior"
          value={formData.ckSupervisior}
          onChange={handleChange}
          placeholder="Enter supervisor"
        />


        <InputField
          label="Supervisor Mail"
          name="ckMail"
          value={formData.ckMail}
          onChange={handleChange}
          type="email"
          placeholder="Enter supervisor email"
        />


        <InputField
          label="Approver ID"
          name="approverId"
          value={formData.approverId}
          onChange={handleChange}
          placeholder="Enter approver ID"
        />


        <InputField
          label="Reporter ID"
          name="reporterId"
          value={formData.reporterId}
          onChange={handleChange}
          placeholder="Enter reporter ID"
        />


        <TextAreaField
          label="Delete Remark"
          name="deleteRemark"
          value={formData.deleteRemark}
          onChange={handleChange}
          placeholder="Optional"
        />

      </div>
    );
  };


  /* =======================================================
     CURRENT STEP
  ======================================================= */

  const renderCurrentStep = () => {

    switch (currentStep) {

      case 1:
        return renderStepOne();

      case 2:
        return renderStepTwo();

      case 3:
        return renderStepThree();

      case 4:
        return renderStepFour();

      case 5:
        return renderStepFive();

      case 6:
        return renderStepSix();

      default:
        return null;
    }
  };


  /* =======================================================
     LOADING
  ======================================================= */

  if (loadingData) {

    return (

      <div className="rfh-layout">

        <Sidebar />

        <main className="rfh-content">

          <div className="rfh-loading-page">
            Loading RFH...
          </div>

        </main>

      </div>
    );
  }


  /* =======================================================
     UI
  ======================================================= */

  return (

    <div className="rfh-layout">

      <Sidebar />


      {/* MAIN CONTENT */}

      <main className="rfh-content">


        {/* =================================================
            TOAST
        ================================================= */}

        {toast.show && (

          <div
            className={`rfh-toast ${toast.type}`}
          >

            <span>
              {toast.message}
            </span>


            <button
              type="button"
              onClick={() =>
                setToast({
                  show: false,
                  type: "",
                  message: "",
                })
              }
            >
              <FaTimes />
            </button>

          </div>
        )}


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="rfh-page-header">

          <div>

            <h1>
              {id
                ? "Edit RFH"
                : "Create Temporary RFH"}
            </h1>

            <p>
              Fill the recruitment request
              details step by step
            </p>

          </div>


          <button
            type="button"
            className="rfh-cancel-top"
            onClick={handleCancel}
          >

            <FaTimes />

            Cancel

          </button>

        </div>


        {/* =================================================
            STEP PROGRESS
        ================================================= */}

        <div className="rfh-step-card">

          <div className="rfh-step-progress">

            {steps.map(
              (step, index) => (

                <React.Fragment
                  key={step.id}
                >

                  <div
                    className={`rfh-step-item ${
                      currentStep >=
                      step.id
                        ? "completed"
                        : ""
                    } ${
                      currentStep ===
                      step.id
                        ? "current"
                        : ""
                    }`}
                  >

                    <div className="rfh-step-circle">

                      {currentStep >
                      step.id ? (
                        <FaCheck />
                      ) : (
                        step.id
                      )}

                    </div>


                    <div className="rfh-step-label">

                      <span>
                        Step {step.id}
                      </span>

                      <strong>
                        {step.title}
                      </strong>

                    </div>

                  </div>


                  {index <
                    steps.length - 1 && (

                    <div
                      className={`rfh-step-line ${
                        currentStep >
                        step.id
                          ? "completed"
                          : ""
                      }`}
                    />

                  )}

                </React.Fragment>

              )
            )}

          </div>


          {/* MOBILE STEP TITLE */}

          <div className="rfh-mobile-step-title">

            Step {currentStep} of{" "}
            {steps.length}

            <strong>
              {
                steps[
                  currentStep - 1
                ].title
              }
            </strong>

          </div>

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        <form
          className="rfh-form-card"
          onSubmit={handleSubmit}
          noValidate
        >


          {/* FORM HEADER */}

          <div className="rfh-form-header">

            <div>

              <h2>
                {
                  steps[
                    currentStep - 1
                  ].title
                }
              </h2>

              <p>
                Enter the required
                information below.
              </p>

            </div>


            <div className="rfh-step-number">

              {currentStep} /{" "}
              {steps.length}

            </div>

          </div>


          {/* FORM BODY */}

          <div className="rfh-form-body">

            {renderCurrentStep()}

          </div>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="rfh-form-footer">


            {/* BACK */}

            <button
              type="button"
              className="rfh-back-btn"
              onClick={handleBack}
              disabled={
                currentStep === 1
              }
            >

              <FaArrowLeft />

              Back

            </button>


            <div className="rfh-footer-right">


              {/* CANCEL */}

              <button
                type="button"
                className="rfh-cancel-btn"
                onClick={handleCancel}
              >

                Cancel

              </button>


              {/* NEXT */}

              {currentStep <
              steps.length ? (

                <button
                  type="button"
                  className="rfh-next-btn"
                  onClick={handleNext}
                >

                  Next

                  <FaArrowRight />

                </button>

              ) : (


                /* SUBMIT */

                <button
                  type="submit"
                  className="rfh-submit-btn"
                  disabled={loading}
                >

                  {loading ? (

                    "Saving..."

                  ) : (

                    <>
                      <FaSave />

                      {id
                        ? "Update RFH"
                        : "Create RFH"}
                    </>

                  )}

                </button>

              )}

            </div>

          </div>

        </form>

      </main>

    </div>
  );
}


export default RFHForm;