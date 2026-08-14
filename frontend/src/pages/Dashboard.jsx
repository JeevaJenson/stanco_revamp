import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import Sidebar from "./Sidebar";
import LogoutModal from "./LogoutModal";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Fetch logged in user
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [reqResponse, candResponse] = await Promise.all([
        api.get("/recruitment-requests").catch(() => ({ data: [] })),
        api.get("/candidates").catch(() => ({ data: [] }))
      ]);

      if (reqResponse.data) {
        setRequests(reqResponse.data);
      }
      if (candResponse.data) {
        setCandidates(candResponse.data);
      }
    } catch (err) {
      console.warn("Failed to fetch dashboard data:", err);
    }
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setShowLogoutModal(false);
    navigate("/");
  };

  // Calculate stats dynamically
  // 1. Open Positions
  const openPositions = requests.reduce((sum, r) => {
    if ((r.requestStatus || "").toUpperCase() === "OPEN") {
      const count = parseInt(r.noOfPosition || r.noOfPositions || "0", 10);
      return sum + (isNaN(count) ? 0 : count);
    }
    return sum;
  }, 0);

  // 2. Candidates
  const totalCandidates = candidates.length;

  // 3. Selected
  const selected = candidates.filter((c) =>
    ["SELECTED", "OFFER_RELEASED", "OFFER_ACCEPTED", "ONBOARDING", "JOINED"].includes(String(c.status || "").toUpperCase())
  ).length;

  // 4. Interviews
  const interviews = candidates.filter((c) =>
    ["L1_INTERVIEW", "L2_INTERVIEW", "L3_INTERVIEW", "HR_DISCUSSION"].includes(String(c.status || "").toUpperCase())
  ).length;

  // 5. Allocations (joined / onboarded)
  const allocations = candidates.filter((c) =>
    ["JOINED", "ONBOARDING"].includes(String(c.status || "").toUpperCase())
  ).length;

  // Determine the last allocated form number (highest TRFH number in the list)
  const getLastAllocatedFormNo = () => {
    let maxNum = 1;
    requests.forEach((r) => {
      if (r.rfhNo && r.rfhNo.startsWith("TRFH-")) {
        const numPart = parseInt(r.rfhNo.substring(5), 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    });
    return `TRFH-${String(maxNum).padStart(4, "0")}`;
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-title">
            <h2>Allocation Dashboard</h2>
            <p>Welcome back, <strong>{currentUser.name || currentUser.empID || "User"}</strong> ({currentUser.roleType || "Manager"})</p>
          </div>
          <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
            Sign Out
          </button>
        </header>

        {/* Dashboard Body */}
        <main className="dashboard-body">
          {/* Top Actions Row */}
          <div className="top-section">
            <button className="create-rfh" onClick={() => navigate("/rfh/create")}>
              <FaPlus style={{ marginRight: "8px" }} /> Create Temp RFH
            </button>

            <div className="last-rfh">
              <span>Last Allocated Form No</span>
              <strong>{getLastAllocatedFormNo()}</strong>
            </div>
          </div>

          {/* Metric Cards Row (5 columns) */}
          <div className="dashboard-metrics-container">
            <div className="metrics-row row-five">

              <div className="metric-card" style={{ borderLeft: "4px solid #2563EB" }}>
                <span className="metric-title">OPEN POSITIONS</span>
                <span className="metric-value" style={{ color: "#2563EB" }}>{openPositions}</span>
              </div>

              <div className="metric-card" style={{ borderLeft: "4px solid #16A34A" }}>
                <span className="metric-title">CANDIDATES</span>
                <span className="metric-value" style={{ color: "#16A34A" }}>{totalCandidates}</span>
              </div>

              <div className="metric-card" style={{ borderLeft: "4px solid #7C3AED" }}>
                <span className="metric-title">SELECTED</span>
                <span className="metric-value" style={{ color: "#7C3AED" }}>{selected}</span>
              </div>

              <div className="metric-card" style={{ borderLeft: "4px solid #EA580C" }}>
                <span className="metric-title">INTERVIEWS</span>
                <span className="metric-value" style={{ color: "#EA580C" }}>{interviews}</span>
              </div>

              <div className="metric-card" style={{ borderLeft: "4px solid #06B6D4" }}>
                <span className="metric-title">ALLOCATIONS</span>
                <span className="metric-value" style={{ color: "#06B6D4" }}>{allocations}</span>
              </div>

            </div>
          </div>
        </main>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}

export default Dashboard;