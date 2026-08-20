import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChartPie, FaListAlt, FaCheckCircle, FaExclamationTriangle, FaFileAlt } from "react-icons/fa";
import Sidebar from "./Sidebar";
import LogoutModal from "./LogoutModal";
import api from "../services/api";
import "../style/AllocationReport.css";

function AllocationReport() {
  const navigate = useNavigate();
  const [rfhs, setRfhs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetchRfhs();
  }, []);

  const fetchRfhs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/rfh");
      setRfhs(response.data || []);
    } catch (err) {
      console.error("Failed to fetch RFH data for report:", err);
      setRfhs([]);
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

  // Compute Aggregated Statistics
  const totalRFHs = rfhs.length;
  const totalPositions = rfhs.reduce((sum, rfh) => sum + Number(rfh.noOfPositions || 0), 0);
  
  const activeCount = rfhs.filter(r => String(r.status || "active").toLowerCase() === "active" || String(r.status ?? 1) === "1").length;
  const inactiveCount = totalRFHs - activeCount;

  const newRequestsCount = rfhs.filter(r => String(r.requestType || "").toLowerCase() === "new").length;
  const replacementRequestsCount = totalRFHs - newRequestsCount;

  // Department Distribution
  const deptMap = {};
  rfhs.forEach(r => {
    const dept = r.department || "Other";
    deptMap[dept] = (deptMap[dept] || 0) + Number(r.noOfPositions || 0);
  });

  return (
    <div className="report-layout">
      <Sidebar />

      <div className="report-content">
        <header className="page-header">
          <div className="header-title">
            <h2>Allocation Report</h2>
            <p>High-level dashboard analytics and statistics of recruitment request allocations</p>
          </div>
          <div className="header-actions">
            <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
              Sign Out
            </button>
          </div>
        </header>

        <main className="report-body">
          {loading ? (
            <div className="report-loading">Loading report analytics...</div>
          ) : (
            <>
              {/* Stat Boxes */}
              <div className="report-stats-grid">
                <div className="stat-card blue">
                  <div className="stat-icon">
                    <FaListAlt />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Total RFHs</span>
                    <h3 className="stat-value">{totalRFHs}</h3>
                  </div>
                </div>

                <div className="stat-card teal">
                  <div className="stat-icon">
                    <FaChartPie />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Required Positions</span>
                    <h3 className="stat-value">{totalPositions}</h3>
                  </div>
                </div>

                <div className="stat-card green">
                  <div className="stat-icon">
                    <FaCheckCircle />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Active Allocations</span>
                    <h3 className="stat-value">{activeCount}</h3>
                  </div>
                </div>

                <div className="stat-card orange">
                  <div className="stat-icon">
                    <FaExclamationTriangle />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Inactive Allocations</span>
                    <h3 className="stat-value">{inactiveCount}</h3>
                  </div>
                </div>
              </div>

              {/* Graphical Breakdown Layout */}
              <div className="report-charts-grid">
                {/* Request Type breakdown */}
                <div className="chart-card">
                  <h4>Request Type Distribution</h4>
                  <div className="bar-charts-list">
                    <div className="progress-bar-wrapper">
                      <div className="progress-bar-info">
                        <span>New Hire Requests</span>
                        <strong>{newRequestsCount} ({totalRFHs > 0 ? Math.round((newRequestsCount / totalRFHs) * 100) : 0}%)</strong>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill teal" style={{ width: `${totalRFHs > 0 ? (newRequestsCount / totalRFHs) * 100 : 0}%` }}></div>
                      </div>
                    </div>

                    <div className="progress-bar-wrapper">
                      <div className="progress-bar-info">
                        <span>Replacements</span>
                        <strong>{replacementRequestsCount} ({totalRFHs > 0 ? Math.round((replacementRequestsCount / totalRFHs) * 100) : 0}%)</strong>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill orange" style={{ width: `${totalRFHs > 0 ? (replacementRequestsCount / totalRFHs) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Departmental Allocation List */}
                <div className="chart-card">
                  <h4>Position Demands by Department</h4>
                  <div className="bar-charts-list">
                    {Object.entries(deptMap).map(([dept, count]) => (
                      <div className="progress-bar-wrapper" key={dept}>
                        <div className="progress-bar-info">
                          <span>{dept} Department</span>
                          <strong>{count} Positions</strong>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill blue" style={{ width: `${totalPositions > 0 ? (count / totalPositions) * 100 : 0}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="report-table-section">
                <h4>Departmental Allocation Detailed breakdown</h4>
                <div className="report-table-card">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>RFH Code</th>
                        <th>Position Title</th>
                        <th>Business Unit</th>
                        <th>Department</th>
                        <th>Type</th>
                        <th>Positions</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rfhs.map((rfh) => (
                        <tr key={rfh.id}>
                          <td>
                            <span className="rfh-code">
                              <FaFileAlt />
                              {rfh.ticketNumber || `RFH-${rfh.id}`}
                            </span>
                          </td>
                          <td><strong>{rfh.positionTitle || "-"}</strong></td>
                          <td>{rfh.business || "-"}</td>
                          <td>{rfh.department || "-"}</td>
                          <td>
                            <span className={`type-tag ${String(rfh.requestType || "").toLowerCase() === "new" ? "new" : "replace"}`}>
                              {rfh.requestType || "NEW"}
                            </span>
                          </td>
                          <td>{rfh.noOfPositions || 0}</td>
                          <td>
                            <span className={`status-tag ${String(rfh.status || "active").toLowerCase() === "active" || String(rfh.status ?? 1) === "1" ? "active" : "inactive"}`}>
                              {String(rfh.status || "active").toLowerCase() === "active" || String(rfh.status ?? 1) === "1" ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
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

export default AllocationReport;
