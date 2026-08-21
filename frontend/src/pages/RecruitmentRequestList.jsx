import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaEye,
  FaEdit,
  FaUserCheck,
  FaSyncAlt,
  FaEllipsisV,
} from "react-icons/fa";

import Sidebar from "./Sidebar";
import LogoutModal from "./LogoutModal";
import api from "../services/api";

import "../style/RecruitmentRequestList.css";

function RecruitmentRequestList() {

  const navigate = useNavigate();

  /* =========================================================
     STATE
  ========================================================= */

  const [requests, setRequests] = useState([]);

  const [activeTab, setActiveTab] = useState("yet");

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);

  const [actionDropdown, setActionDropdown] = useState(null);

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [showAllocationModal, setShowAllocationModal] =
    useState(false);

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [assignedTo, setAssignedTo] = useState("");

  const [assignedDate, setAssignedDate] =
    useState(
      new Date().toISOString().split("T")[0]
    );

  const [allocating, setAllocating] = useState(false);


  /* =========================================================
     FETCH RECRUITMENT REQUESTS
  ========================================================= */

  useEffect(() => {

    fetchRecruitmentRequests();

  }, []);


  const fetchRecruitmentRequests = async () => {

    try {

      setLoading(true);

      const response = await api.get(
        "/recruitment-requests"
      );

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      console.log(
        "RECRUITMENT REQUEST API RESPONSE:",
        data
      );

      setRequests(data);

    } catch (error) {

      console.error(
        "Failed to fetch recruitment requests:",
        error
      );

      setRequests([]);

      showToast(
        "error",
        error?.response?.data?.message ||
          "Failed to load recruitment requests"
      );

    } finally {

      setLoading(false);

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
     STATUS
  ========================================================= */

  const isAllocated = (request) => {

    return (
      String(
        request?.assignedStatus || ""
      )
        .trim()
        .toLowerCase() === "assigned"
    );

  };


  /* =========================================================
     COUNTS
  ========================================================= */

  const yetToAllocatedCount =
    requests.filter(
      (request) =>
        !isAllocated(request)
    ).length;


  const allocatedCount =
    requests.filter(
      (request) =>
        isAllocated(request)
    ).length;


  /* =========================================================
     TAB FILTER
  ========================================================= */

  const getTabRequests = () => {

    if (activeTab === "yet") {

      return requests.filter(
        (request) =>
          !isAllocated(request)
      );

    }

    if (activeTab === "allocated") {

      return requests.filter(
        (request) =>
          isAllocated(request)
      );

    }

    return requests;

  };


  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredRequests =
    getTabRequests().filter((request) => {

      const search =
        searchTerm
          .toLowerCase()
          .trim();

      if (!search) {
        return true;
      }

      return (

        String(
          request.recReqID || ""
        )
          .toLowerCase()
          .includes(search)

        ||

        String(
          request.rfhNo || ""
        )
          .toLowerCase()
          .includes(search)

        ||

        String(
          request.positionTitle || ""
        )
          .toLowerCase()
          .includes(search)

        ||

        String(
          request.business || ""
        )
          .toLowerCase()
          .includes(search)

        ||

        String(
          request.division || ""
        )
          .toLowerCase()
          .includes(search)

        ||

        String(
          request.location || ""
        )
          .toLowerCase()
          .includes(search)

        ||

        String(
          request.assignedTo || ""
        )
          .toLowerCase()
          .includes(search)

      );

    });


  /* =========================================================
     OPEN ALLOCATION MODAL
  ========================================================= */

  const openAllocationModal = (request) => {

    setSelectedRequest(request);

    setAssignedTo(
      request?.assignedTo || ""
    );

    setAssignedDate(
      request?.assignedDate ||
        new Date()
          .toISOString()
          .split("T")[0]
    );

    setShowAllocationModal(true);

    setActionDropdown(null);

  };


  /* =========================================================
     CLOSE ALLOCATION MODAL
  ========================================================= */

  const closeAllocationModal = () => {

    if (allocating) {
      return;
    }

    setShowAllocationModal(false);

    setSelectedRequest(null);

    setAssignedTo("");

    setAssignedDate(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  };


  /* =========================================================
     ALLOCATE REQUEST
  ========================================================= */

  const handleAllocate = async () => {

    if (!selectedRequest) {
      return;
    }

    if (!assignedTo.trim()) {

      showToast(
        "error",
        "Please enter Employee ID"
      );

      return;

    }

    if (!assignedDate) {

      showToast(
        "error",
        "Please select allocation date"
      );

      return;

    }

    try {

      setAllocating(true);

      /*
       * We need the complete existing record for PUT.
       * Backend update() expects RecruitmentRequestRequest.
       */

      const payload = {

        recReqID:
          selectedRequest.recReqID,

        rfhNo:
          selectedRequest.rfhNo,

        positionTitle:
          selectedRequest.positionTitle,

        noOfPosition:
          selectedRequest.noOfPosition,

        band:
          selectedRequest.band,

        openDate:
          selectedRequest.openDate,

        criticalPosition:
          selectedRequest.criticalPosition,

        business:
          selectedRequest.business,

        division:
          selectedRequest.division,

        function:
          selectedRequest.function,

        location:
          selectedRequest.location,

        billingStatus:
          selectedRequest.billingStatus,

        interviewer:
          selectedRequest.interviewer,

        salaryRange:
          selectedRequest.salaryRange,

        salaryRangeAnnual:
          selectedRequest.salaryRangeAnnual,

        requestStatus:
          selectedRequest.requestStatus,

        closeDate:
          selectedRequest.closeDate,

        /*
         * IMPORTANT
         */

        assignedStatus: "Assigned",

        assignedTo:
          assignedTo.trim(),

        assignedDate:
          assignedDate,

        heplRecruitmentRefNumber:
          selectedRequest.heplRecruitmentRefNumber,

        actionForTheDayStatus:
          selectedRequest.actionForTheDayStatus,

        subPositionTitle:
          selectedRequest.subPositionTitle,

        closedBy:
          selectedRequest.closedBy,

      };


      console.log(
        "ALLOCATION PAYLOAD:",
        payload
      );


      await api.put(
        `/recruitment-requests/${selectedRequest.id}`,
        payload
      );


      showToast(
        "success",
        "Recruitment Request allocated successfully"
      );


      closeAllocationModal();

      await fetchRecruitmentRequests();

      setActiveTab("allocated");


    } catch (error) {

      console.error(
        "Allocation error:",
        error
      );

      showToast(
        "error",
        error?.response?.data?.message ||
          error?.response?.data ||
          "Failed to allocate recruitment request"
      );

    } finally {

      setAllocating(false);

    }

  };


  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogoutConfirm = () => {

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    setShowLogoutModal(false);

    navigate("/");

  };


  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    try {

      return new Date(date).toLocaleDateString(
        "en-IN"
      );

    } catch {

      return date;

    }

  };


  /* =========================================================
     VIEW
  ========================================================= */

  const handleView = (id) => {

    setActionDropdown(null);

    navigate(
      `/recruitment-request/${id}`
    );

  };


  /* =========================================================
     EDIT
  ========================================================= */

  const handleEdit = (id) => {

    setActionDropdown(null);

    navigate(
      `/recruitment-request/edit/${id}`
    );

  };


  /* =========================================================
     UI
  ========================================================= */

  return (

    <div className="recruitment-layout">

      <Sidebar />


      {/* =====================================================
          TOAST
      ===================================================== */}

      {toast.show && (

        <div
          className={`rr-toast ${toast.type}`}
        >
          {toast.message}
        </div>

      )}


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="recruitment-content">


        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="rr-page-header">

          <div>

            <h2>
              Recruitment Requests
            </h2>

            <p>
              Manage and track recruitment request
              allocation
            </p>

          </div>


          <div className="rr-header-actions">

            <button
              className="rr-refresh-btn"
              onClick={
                fetchRecruitmentRequests
              }
              disabled={loading}
            >

              <FaSyncAlt />

              Refresh

            </button>


            <button
              className="rr-create-btn"
              onClick={() =>
                navigate(
                  "/recruitment-request/create"
                )
              }
            >

              + Create Recruitment Request

            </button>


            <button
              className="rr-logout-btn"
              onClick={() =>
                setShowLogoutModal(true)
              }
            >

              Sign Out

            </button>

          </div>

        </header>


        {/* ===================================================
            SUMMARY CARDS
        =================================================== */}

        <div className="rr-summary-container">


          <div
            className={
              activeTab === "yet"
                ? "rr-summary-card active"
                : "rr-summary-card"
            }
            onClick={() =>
              setActiveTab("yet")
            }
          >

            <div className="rr-summary-title">
              Yet to Allocated
            </div>

            <div className="rr-summary-count">
              {yetToAllocatedCount}
            </div>

          </div>


          <div
            className={
              activeTab === "allocated"
                ? "rr-summary-card allocated active"
                : "rr-summary-card allocated"
            }
            onClick={() =>
              setActiveTab("allocated")
            }
          >

            <div className="rr-summary-title">
              Allocated
            </div>

            <div className="rr-summary-count">
              {allocatedCount}
            </div>

          </div>

        </div>


        {/* ===================================================
            TABS
        =================================================== */}

        <div className="rr-tabs">

          <button
            className={
              activeTab === "yet"
                ? "rr-tab active"
                : "rr-tab"
            }
            onClick={() =>
              setActiveTab("yet")
            }
          >

            Yet to Allocated

            <span className="rr-tab-count">
              {yetToAllocatedCount}
            </span>

          </button>


          <button
            className={
              activeTab === "allocated"
                ? "rr-tab active allocated"
                : "rr-tab"
            }
            onClick={() =>
              setActiveTab("allocated")
            }
          >

            Allocated

            <span className="rr-tab-count">
              {allocatedCount}
            </span>

          </button>

        </div>


        {/* ===================================================
            TOOLBAR
        =================================================== */}

        <div className="rr-toolbar">

          <div className="rr-search">

            <FaSearch />

            <input
              type="text"
              placeholder={
                activeTab === "yet"
                  ? "Search yet to allocated requests..."
                  : "Search allocated requests..."
              }
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

          </div>

        </div>


        {/* ===================================================
            TABLE
        =================================================== */}

        <div className="rr-table-card">


          {loading ? (

            <div className="rr-loading">

              <div className="rr-spinner"></div>

              Loading recruitment requests...

            </div>

          ) : filteredRequests.length === 0 ? (

            <div className="rr-empty">

              <div className="rr-empty-title">

                {activeTab === "yet"
                  ? "No Yet to Allocated Requests"
                  : "No Allocated Requests"}

              </div>

              <div className="rr-empty-text">

                {searchTerm
                  ? "Try changing your search."
                  : "Recruitment requests will appear here."}

              </div>

            </div>

          ) : (

            <div className="rr-table-wrapper">

              <table className="rr-table">

                <thead>

                  <tr>

                    <th>
                      S.No
                    </th>

                    <th>
                      Rec Req ID
                    </th>

                    <th>
                      RFH No
                    </th>

                    <th>
                      Position Title
                    </th>

                    <th>
                      No. of Positions
                    </th>

                    <th>
                      Band
                    </th>

                    <th>
                      Business
                    </th>

                    <th>
                      Division
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Request Status
                    </th>


                    {activeTab === "allocated" && (

                      <>

                        <th>
                          Allocated To
                        </th>

                        <th>
                          Allocated Date
                        </th>

                      </>

                    )}


                    <th>
                      Allocation Status
                    </th>

                    <th className="rr-action-column">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredRequests.map(
                    (request, index) => (

                      <tr
                        key={
                          request.id
                        }
                      >


                        {/* S.NO */}

                        <td>
                          {index + 1}
                        </td>


                        {/* REC REQ ID */}

                        <td>

                          <span className="rr-rec-id">

                            {request.recReqID ||
                              "-"}

                          </span>

                        </td>


                        {/* RFH */}

                        <td>
                          {request.rfhNo ||
                            "-"}
                        </td>


                        {/* POSITION */}

                        <td>

                          <span className="rr-position-title">

                            {request.positionTitle ||
                              "-"}

                          </span>

                        </td>


                        {/* POSITIONS */}

                        <td>
                          {request.noOfPosition ||
                            "-"}
                        </td>


                        {/* BAND */}

                        <td>
                          {request.band ||
                            "-"}
                        </td>


                        {/* BUSINESS */}

                        <td>
                          {request.business ||
                            "-"}
                        </td>


                        {/* DIVISION */}

                        <td>
                          {request.division ||
                            "-"}
                        </td>


                        {/* LOCATION */}

                        <td>
                          {request.location ||
                            "-"}
                        </td>


                        {/* REQUEST STATUS */}

                        <td>

                          <span className="rr-request-status">

                            {request.requestStatus ||
                              "Open"}

                          </span>

                        </td>


                        {/* ALLOCATED TO */}

                        {activeTab ===
                          "allocated" && (

                          <td>

                            <span className="rr-employee">

                              {request.assignedTo ||
                                "-"}

                            </span>

                          </td>

                        )}


                        {/* ALLOCATED DATE */}

                        {activeTab ===
                          "allocated" && (

                          <td>

                            {formatDate(
                              request.assignedDate
                            )}

                          </td>

                        )}


                        {/* ALLOCATION STATUS */}

                        <td>

                          {isAllocated(
                            request
                          ) ? (

                            <span className="rr-status allocated">

                              Allocated

                            </span>

                          ) : (

                            <span className="rr-status pending">

                              Yet to Allocated

                            </span>

                          )}

                        </td>


                        {/* ACTION */}

                        <td>

                          <div className="rr-actions">

                            <button
                              className="rr-action-dots"
                              onClick={() =>
                                setActionDropdown(
                                  actionDropdown ===
                                    request.id
                                    ? null
                                    : request.id
                                )
                              }
                            >

                              <FaEllipsisV />

                            </button>


                            {actionDropdown ===
                              request.id && (

                              <>

                                <div
                                  className="rr-dropdown-overlay"
                                  onClick={() =>
                                    setActionDropdown(
                                      null
                                    )
                                  }
                                ></div>


                                <div className="rr-action-menu">


                                  {/* VIEW */}

                                  <button
                                    onClick={() =>
                                      handleView(
                                        request.id
                                      )
                                    }
                                  >

                                    <FaEye />

                                    View

                                  </button>


                                  {/* EDIT */}

                                  <button
                                    onClick={() =>
                                      handleEdit(
                                        request.id
                                      )
                                    }
                                  >

                                    <FaEdit />

                                    Edit

                                  </button>


                                  {/* ALLOCATE */}

                                  {!isAllocated(
                                    request
                                  ) && (

                                    <button
                                      className="allocate-action"
                                      onClick={() =>
                                        openAllocationModal(
                                          request
                                        )
                                      }
                                    >

                                      <FaUserCheck />

                                      Allocate

                                    </button>

                                  )}

                                </div>

                              </>

                            )}

                          </div>

                        </td>


                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>


      {/* =====================================================
          ALLOCATION MODAL
      ===================================================== */}

      {showAllocationModal && (

        <div className="rr-modal-overlay">

          <div className="rr-allocation-modal">


            <div className="rr-modal-header">

              <div>

                <h3>
                  Allocate Recruitment Request
                </h3>

                <p>
                  {selectedRequest?.recReqID ||
                    "-"}
                </p>

              </div>


              <button
                className="rr-modal-close"
                onClick={
                  closeAllocationModal
                }
                disabled={allocating}
              >
                ×
              </button>

            </div>


            <div className="rr-modal-body">


              <div className="rr-request-info">

                <div>

                  <label>
                    Position
                  </label>

                  <strong>
                    {selectedRequest?.positionTitle ||
                      "-"}
                  </strong>

                </div>


                <div>

                  <label>
                    No. of Positions
                  </label>

                  <strong>
                    {selectedRequest?.noOfPosition ||
                      "-"}
                  </strong>

                </div>


                <div>

                  <label>
                    Business
                  </label>

                  <strong>
                    {selectedRequest?.business ||
                      "-"}
                  </strong>

                </div>

              </div>


              {/* EMPLOYEE ID */}

              <div className="rr-form-group">

                <label>

                  Employee ID

                  <span>
                    *
                  </span>

                </label>

                <input
                  type="text"
                  placeholder="Enter Employee ID"
                  value={assignedTo}
                  onChange={(event) =>
                    setAssignedTo(
                      event.target.value
                    )
                  }
                />

              </div>


              {/* DATE */}

              <div className="rr-form-group">

                <label>

                  Allocation Date

                  <span>
                    *
                  </span>

                </label>

                <input
                  type="date"
                  value={assignedDate}
                  onChange={(event) =>
                    setAssignedDate(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>


            <div className="rr-modal-footer">

              <button
                className="rr-cancel-btn"
                onClick={
                  closeAllocationModal
                }
                disabled={allocating}
              >

                Cancel

              </button>


              <button
                className="rr-allocate-btn"
                onClick={
                  handleAllocate
                }
                disabled={allocating}
              >

                <FaUserCheck />

                {allocating
                  ? "Allocating..."
                  : "Allocate"}

              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          LOGOUT MODAL
      ===================================================== */}

      <LogoutModal

        isOpen={
          showLogoutModal
        }

        onClose={() =>
          setShowLogoutModal(false)
        }

        onConfirm={
          handleLogoutConfirm
        }

      />

    </div>

  );

}

export default RecruitmentRequestList;