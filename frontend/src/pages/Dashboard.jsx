import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaFileAlt } from "react-icons/fa";
import Sidebar from "./Sidebar";
import LogoutModal from "./LogoutModal";
import api from "../services/api";
import "../style/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Fetch logged in user
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [reqResponse, candResponse] = await Promise.all([
        api.get("/rfh").catch(() => ({ data: [] })),
        api.get("/candidates").catch(() => ({ data: [] }))
      ]);

      setRequests(reqResponse.data || []);
      setCandidates(candResponse.data || []);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setRequests([]);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setShowLogoutModal(false);
    navigate("/");
  };

  // Calculate stats dynamically
  // 1. Open Positions (Active, non-deleted request positions)
  const openPositions = requests.reduce((sum, r) => {
    if (r.deleteStatus !== 1 && String(r.status || "active").toLowerCase() !== "inactive") {
      const count = parseInt(r.noOfPositions || r.noOfPosition || "0", 10);
      return sum + (isNaN(count) ? 0 : count);
    }
    return sum;
  }, 0);

  // 2. Candidates Sourced
  const totalCandidates = candidates.length;

  // 3. Selected Candidates
  const selected = candidates.filter((c) =>
    ["SELECTED", "OFFERED", "OFFER_RELEASED", "OFFER_ACCEPTED", "ONBOARDING", "JOINED"].includes(String(c.status || "").toUpperCase())
  ).length;

  // 4. Interviews
  const interviews = candidates.filter((c) =>
    ["L1_INTERVIEW", "L2_INTERVIEW", "L3_INTERVIEW", "HR_DISCUSSION"].includes(String(c.status || "").toUpperCase())
  ).length;

  // 5. Allocations (Joined)
  const allocations = candidates.filter((c) =>
    ["JOINED", "ONBOARDING"].includes(String(c.status || "").toUpperCase())
  ).length;

  // Filter requests table based on search
  const filteredRequests = requests.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      String(r.ticketNumber || "").toLowerCase().includes(term) ||
      String(r.positionTitle || "").toLowerCase().includes(term) ||
      String(r.business || "").toLowerCase().includes(term) ||
      String(r.department || "").toLowerCase().includes(term) ||
      String(r.requestBy || "").toLowerCase().includes(term)
    );
  });

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
          <div className="header-actions">
            <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
              Sign Out
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="dashboard-body">
          {/* Create Request CTA Bar */}
          <div className="top-section">
            <button className="create-rfh" onClick={() => navigate("/rfh/create")}>
              <FaPlus style={{ marginRight: "8px" }} /> Create RFH Form
            </button>
            {requests.length > 0 && (
              <div className="last-rfh">
                Last Allocation Form
                <strong>{requests[0].ticketNumber || `RFH-${requests[0].id}`}</strong>
              </div>
            )}
          </div>

          {/* Metric Cards Row */}
          <div className="dashboard-metrics-container">
            <div className="metrics-row row-five">
              <div className="metric-card" style={{ borderLeft: "4px solid #2563EB" }} onClick={() => navigate("/allocation-list")}>
                <span className="metric-title">OPEN POSITIONS</span>
                <span className="metric-value" style={{ color: "#2563EB" }}>{openPositions}</span>
              </div>

              <div className="metric-card" style={{ borderLeft: "4px solid #16A34A" }} onClick={() => navigate("/candidate-database")}>
                <span className="metric-title">CANDIDATES</span>
                <span className="metric-value" style={{ color: "#16A34A" }}>{totalCandidates}</span>
              </div>

              <div className="metric-card" style={{ borderLeft: "4px solid #7C3AED" }} onClick={() => navigate("/recruiter-report")}>
                <span className="metric-title">SELECTED</span>
                <span className="metric-value" style={{ color: "#7C3AED" }}>{selected}</span>
              </div>

              <div className="metric-card" style={{ borderLeft: "4px solid #EA580C" }} onClick={() => navigate("/candidate-database")}>
                <span className="metric-title">INTERVIEWS</span>
                <span className="metric-value" style={{ color: "#EA580C" }}>{interviews}</span>
              </div>

              <div className="metric-card" style={{ borderLeft: "4px solid #06B6D4" }} onClick={() => navigate("/allocation-report")}>
                <span className="metric-title">ALLOCATIONS</span>
                <span className="metric-value" style={{ color: "#06B6D4" }}>{allocations}</span>
              </div>
            </div>
          </div>

          {/* Recent Allocation Requests Table */}
          <div className="dashboard-table-container">
            <div className="table-header-section">
              <h3>Latest Allocation Requests</h3>
              <div className="table-search-box">
                <FaSearch className="search-icon-absolute" />
                <input
                  type="text"
                  placeholder="Search allocations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="dashboard-table-wrapper">
              {loading ? (
                <div className="table-loading-container">
                  <span>Loading allocation data...</span>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="table-empty-container">
                  <FaFileAlt />
                  <p>No recent allocation requests found.</p>
                </div>
              ) : (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>RFH Code</th>
                      <th>Job Title</th>
                      <th>Business Unit</th>
                      <th>Department</th>
                      <th>Positions</th>
                      <th>Requested By</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.slice(0, 8).map((rfh) => (
                      <tr key={rfh.id}>
                        <td>
                          <span className="rfh-code" style={{ cursor: "pointer" }} onClick={() => navigate(`/rfh/edit/${rfh.id}`)}>
                            <FaFileAlt style={{ marginRight: "6px" }} />
                            {rfh.ticketNumber || `RFH-${rfh.id}`}
                          </span>
                        </td>
                        <td>
                          <strong>{rfh.positionTitle || "-"}</strong>
                        </td>
                        <td>{rfh.business || "-"}</td>
                        <td>{rfh.department || "-"}</td>
                        <td>{rfh.noOfPositions || "-"}</td>
                        <td>{rfh.requestBy || "Admin"}</td>
                        <td>
                          <span className={`status-badge ${String(rfh.status || "active").toLowerCase() === "active" ? "open" : "closed"}`}>
                            {String(rfh.status || "active").toLowerCase() === "active" ? "Open" : "Closed"}
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

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}

export default Dashboard;