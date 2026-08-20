import React, {
  useState,
  useEffect,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FaPlus,
  FaSearch,
  FaFileAlt,
} from "react-icons/fa";

import Sidebar from "./Sidebar";
import LogoutModal from "./LogoutModal";

import api from "../services/api";

import "../style/Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  const [requests, setRequests] =
    useState([]);

  const [candidates, setCandidates] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  // ============================================================
  // CURRENT USER
  // ============================================================

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  // ============================================================
  // LOAD DASHBOARD
  // ============================================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {

    try {

      setLoading(true);

      const [
        reqResponse,
        candResponse,
      ] = await Promise.all([

        api
          .get("/rfh")
          .catch(() => ({
            data: [],
          })),

        api
          .get("/candidates")
          .catch(() => ({
            data: [],
          })),

      ]);

      const requestData =
        Array.isArray(reqResponse.data)
          ? reqResponse.data
          : [];

      const candidateData =
        Array.isArray(candResponse.data)
          ? candResponse.data
          : [];

      setRequests(requestData);

      setCandidates(candidateData);

      console.log(
        "Dashboard RFH Data:",
        requestData
      );

    } catch (error) {

      console.error(
        "Failed to fetch dashboard data:",
        error
      );

      setRequests([]);

      setCandidates([]);

    } finally {

      setLoading(false);

    }

  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogoutConfirm = () => {

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    setShowLogoutModal(false);

    navigate("/");

  };

  // ============================================================
  // RFH NUMBER
  // ============================================================

  const getRfhNumber = (rfh) => {

    if (
      rfh?.resId !== null &&
      rfh?.resId !== undefined &&
      String(rfh.resId).trim() !== ""
    ) {

      return String(rfh.resId);

    }

    return "-";

  };

  // ============================================================
  // TICKET NUMBER
  // ============================================================

  const getTicketNumber = (rfh) => {

    if (
      rfh?.ticketNumber !== null &&
      rfh?.ticketNumber !== undefined &&
      String(rfh.ticketNumber).trim() !== ""
    ) {

      return String(
        rfh.ticketNumber
      );

    }

    return "-";

  };

  // ============================================================
  // OPEN POSITIONS
  // ============================================================

  const openPositions =
    requests.reduce(
      (sum, request) => {

        if (
          request.deleteStatus !== 1 &&
          String(
            request.status || "active"
          ).toLowerCase() !== "inactive"
        ) {

          const count =
            parseInt(
              request.noOfPositions ||
                request.noOfPosition ||
                "0",
              10
            );

          return (
            sum +
            (Number.isNaN(count)
              ? 0
              : count)
          );

        }

        return sum;

      },
      0
    );

  // ============================================================
  // TOTAL CANDIDATES
  // ============================================================

  const totalCandidates =
    candidates.length;

  // ============================================================
  // SELECTED
  // ============================================================

  const selected =
    candidates.filter(
      (candidate) =>
        [
          "SELECTED",
          "OFFERED",
          "OFFER_RELEASED",
          "OFFER_ACCEPTED",
          "ONBOARDING",
          "JOINED",
        ].includes(
          String(
            candidate.status || ""
          ).toUpperCase()
        )
    ).length;

  // ============================================================
  // INTERVIEWS
  // ============================================================

  const interviews =
    candidates.filter(
      (candidate) =>
        [
          "L1_INTERVIEW",
          "L2_INTERVIEW",
          "L3_INTERVIEW",
          "HR_DISCUSSION",
        ].includes(
          String(
            candidate.status || ""
          ).toUpperCase()
        )
    ).length;

  // ============================================================
  // ALLOCATIONS
  // ============================================================

  const allocations =
    candidates.filter(
      (candidate) =>
        [
          "JOINED",
          "ONBOARDING",
        ].includes(
          String(
            candidate.status || ""
          ).toUpperCase()
        )
    ).length;

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredRequests =
    requests.filter((rfh) => {

      const term =
        searchTerm
          .toLowerCase()
          .trim();

      return (

        // RFH NUMBER
        String(rfh.resId || "")
          .toLowerCase()
          .includes(term) ||

        // TICKET NUMBER
        String(
          rfh.ticketNumber || ""
        )
          .toLowerCase()
          .includes(term) ||

        // JOB TITLE
        String(
          rfh.positionTitle || ""
        )
          .toLowerCase()
          .includes(term) ||

        // BUSINESS
        String(
          rfh.business || ""
        )
          .toLowerCase()
          .includes(term) ||

        // DEPARTMENT
        String(
          rfh.department || ""
        )
          .toLowerCase()
          .includes(term) ||

        // REQUESTED BY
        String(
          rfh.requestBy || ""
        )
          .toLowerCase()
          .includes(term)

      );

    });

  // ============================================================
  // UI
  // ============================================================

  return (

    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <header className="dashboard-header">

          <div className="header-title">

            <h2>
              Allocation Dashboard
            </h2>

            <p>
              Welcome back,{" "}
              <strong>
                {
                  currentUser.name ||
                  currentUser.empID ||
                  "User"
                }
              </strong>{" "}
              (
              {
                currentUser.roleType ||
                "Manager"
              }
              )
            </p>

          </div>

          <div className="header-actions">

            <button
              className="logout-btn"
              onClick={() =>
                setShowLogoutModal(true)
              }
            >
              Sign Out
            </button>

          </div>

        </header>

        {/* ====================================================
            BODY
        ==================================================== */}

        <main className="dashboard-body">

          {/* ==================================================
              CREATE RFH
          ================================================== */}

          <div className="top-section">

            <button
              className="create-rfh"
              onClick={() =>
                navigate("/rfh/create")
              }
            >

              <FaPlus
                style={{
                  marginRight: "8px",
                }}
              />

              Create RFH Form

            </button>

            {requests.length > 0 && (

              <div className="last-rfh">

                Last Allocation Form

                <strong>

                  {getRfhNumber(
                    requests[0]
                  )}

                </strong>

              </div>

            )}

          </div>

          {/* ==================================================
              METRIC CARDS
          ================================================== */}

          <div className="dashboard-metrics-container">

            <div className="metrics-row row-five">

              {/* OPEN POSITIONS */}

              <div
                className="metric-card"
                style={{
                  borderLeft:
                    "4px solid #2563EB",
                }}
                onClick={() =>
                  navigate(
                    "/allocation-list"
                  )
                }
              >

                <span className="metric-title">
                  OPEN POSITIONS
                </span>

                <span
                  className="metric-value"
                  style={{
                    color: "#2563EB",
                  }}
                >
                  {openPositions}
                </span>

              </div>

              {/* CANDIDATES */}

              <div
                className="metric-card"
                style={{
                  borderLeft:
                    "4px solid #16A34A",
                }}
                onClick={() =>
                  navigate(
                    "/candidate-database"
                  )
                }
              >

                <span className="metric-title">
                  CANDIDATES
                </span>

                <span
                  className="metric-value"
                  style={{
                    color: "#16A34A",
                  }}
                >
                  {totalCandidates}
                </span>

              </div>

              {/* SELECTED */}

              <div
                className="metric-card"
                style={{
                  borderLeft:
                    "4px solid #7C3AED",
                }}
                onClick={() =>
                  navigate(
                    "/recruiter-report"
                  )
                }
              >

                <span className="metric-title">
                  SELECTED
                </span>

                <span
                  className="metric-value"
                  style={{
                    color: "#7C3AED",
                  }}
                >
                  {selected}
                </span>

              </div>

              {/* INTERVIEWS */}

              <div
                className="metric-card"
                style={{
                  borderLeft:
                    "4px solid #EA580C",
                }}
                onClick={() =>
                  navigate(
                    "/candidate-database"
                  )
                }
              >

                <span className="metric-title">
                  INTERVIEWS
                </span>

                <span
                  className="metric-value"
                  style={{
                    color: "#EA580C",
                  }}
                >
                  {interviews}
                </span>

              </div>

              {/* ALLOCATIONS */}

              <div
                className="metric-card"
                style={{
                  borderLeft:
                    "4px solid #06B6D4",
                }}
                onClick={() =>
                  navigate(
                    "/allocation-report"
                  )
                }
              >

                <span className="metric-title">
                  ALLOCATIONS
                </span>

                <span
                  className="metric-value"
                  style={{
                    color: "#06B6D4",
                  }}
                >
                  {allocations}
                </span>

              </div>

            </div>

          </div>

          {/* ==================================================
              RECENT RFH TABLE
          ================================================== */}

          <div className="dashboard-table-container">

            <div className="table-header-section">

              <h3>
                Latest Allocation Requests
              </h3>

              <div className="table-search-box">

                <FaSearch
                  className="search-icon-absolute"
                />

                <input
                  type="text"
                  placeholder="Search RFH, Ticket, Title, Business..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>

            <div className="dashboard-table-wrapper">

              {loading ? (

                <div className="table-loading-container">

                  <span>
                    Loading allocation data...
                  </span>

                </div>

              ) : filteredRequests.length === 0 ? (

                <div className="table-empty-container">

                  <FaFileAlt />

                  <p>
                    No recent allocation
                    requests found.
                  </p>

                </div>

              ) : (

                <table className="dashboard-table">

                  <thead>

                    <tr>

                      <th>
                        RFH Code
                      </th>

                      <th>
                        Ticket Number
                      </th>

                      <th>
                        Job Title
                      </th>

                      <th>
                        Business Unit
                      </th>

                      <th>
                        Department
                      </th>

                      <th>
                        Positions
                      </th>

                      <th>
                        Requested By
                      </th>

                      <th>
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredRequests
                      .slice(0, 8)
                      .map((rfh) => (

                        <tr key={rfh.id}>

                          {/* RFH NUMBER */}

                          <td>

                            <span
                              className="rfh-code"
                              style={{
                                cursor:
                                  "pointer",
                              }}
                              onClick={() =>
                                navigate(
                                  `/rfh/edit/${rfh.id}`
                                )
                              }
                            >

                              <FaFileAlt
                                style={{
                                  marginRight:
                                    "6px",
                                }}
                              />

                              {getRfhNumber(rfh)}

                            </span>

                          </td>

                          {/* TICKET NUMBER */}

                          <td>

                            <span className="ticket-number">

                              {getTicketNumber(
                                rfh
                              )}

                            </span>

                          </td>

                          {/* JOB TITLE */}

                          <td>

                            <strong>
                              {
                                rfh.positionTitle ||
                                "-"
                              }
                            </strong>

                          </td>

                          {/* BUSINESS */}

                          <td>
                            {rfh.business || "-"}
                          </td>

                          {/* DEPARTMENT */}

                          <td>
                            {rfh.department || "-"}
                          </td>

                          {/* POSITIONS */}

                          <td>
                            {rfh.noOfPositions || "-"}
                          </td>

                          {/* REQUESTED BY */}

                          <td>
                            {rfh.requestBy ||
                              "Admin"}
                          </td>

                          {/* STATUS */}

                          <td>

                            <span
                              className={`status-badge ${
                                String(
                                  rfh.status ||
                                    "active"
                                ).toLowerCase() ===
                                "active"
                                  ? "open"
                                  : "closed"
                              }`}
                            >

                              {
                                String(
                                  rfh.status ||
                                    "active"
                                ).toLowerCase() ===
                                "active"
                                  ? "Open"
                                  : "Closed"
                              }

                            </span>

                          </td>

                        </tr>

                      ))}

                  </tbody>

                </table>

              )}

            </div>

          </div>

        </main>

      </div>

      {/* ======================================================
          LOGOUT MODAL
      ====================================================== */}

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

export default Dashboard;