import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaCheckCircle, FaAward, FaPercent, FaBriefcase, FaEnvelope, FaFileAlt } from "react-icons/fa";
import Sidebar from "./Sidebar";
import LogoutModal from "./LogoutModal";
import api from "../services/api";
import "../style/RecruiterReport.css";

function RecruiterReport() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await api.get("/candidates");
      setCandidates(response.data || []);
    } catch (err) {
      console.error("Failed to fetch candidate data for recruiter report:", err);
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

  // Group and Aggregate Statistics by Recruiter
  const computeRecruiterStats = () => {
    const recruiterMap = {};

    candidates.forEach((c) => {
      const name = String(c.orRecruiterName || "Unknown").toLowerCase().trim();
      if (!recruiterMap[name]) {
        recruiterMap[name] = {
          name: name,
          sourced: 0,
          screening: 0,
          interview: 0,
          offered: 0,
          joined: 0,
          rejected: 0
        };
      }

      const stat = recruiterMap[name];
      stat.sourced += 1;

      const statusLower = String(c.status || "").toLowerCase();
      if (statusLower === "screening" || statusLower === "sourced") {
        stat.screening += 1;
      } else if (statusLower.includes("interview") || statusLower.includes("discussion")) {
        stat.interview += 1;
      } else if (statusLower === "offered") {
        stat.offered += 1;
      } else if (statusLower === "joined") {
        stat.joined += 1;
      } else if (statusLower === "rejected") {
        stat.rejected += 1;
      }
    });

    return Object.values(recruiterMap).map(r => {
      const conversion = r.sourced > 0 ? Math.round((r.joined / r.sourced) * 100) : 0;
      return {
        ...r,
        conversionRate: conversion
      };
    }).sort((a, b) => b.joined - a.joined); // Sort by Joined count descending
  };

  const recruiterStats = computeRecruiterStats();

  // Top Performing Recruiter
  const topRecruiter = recruiterStats.length > 0 ? recruiterStats[0] : null;

  // Global Conversions
  const totalSourced = recruiterStats.reduce((sum, r) => sum + r.sourced, 0);
  const totalJoined = recruiterStats.reduce((sum, r) => sum + r.joined, 0);
  const globalConversionRate = totalSourced > 0 ? Math.round((totalJoined / totalSourced) * 100) : 0;

  return (
    <div className="recruiter-layout">
      <Sidebar />

      <div className="recruiter-content">
        <header className="page-header">
          <div className="header-title">
            <h2>Recruiter Performance Report</h2>
            <p>Track conversion rates, sourced profiles, and joining details across all active recruiters</p>
          </div>
          <div className="header-actions">
            <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
              Sign Out
            </button>
          </div>
        </header>

        <main className="recruiter-body">
          {loading ? (
            <div className="recruiter-loading">Loading performance metrics...</div>
          ) : (
            <>
              {/* Performance KPI widgets */}
              <div className="recruiter-stats-grid">
                <div className="kpi-card green">
                  <div className="kpi-icon">
                    <FaAward />
                  </div>
                  <div className="kpi-info">
                    <span className="kpi-label">Top Performer</span>
                    <h3 className="kpi-value text-capitalize">{topRecruiter ? topRecruiter.name : "N/A"}</h3>
                    <p className="kpi-subtext">{topRecruiter ? `${topRecruiter.joined} Joinees Sourced` : "No placements recorded yet"}</p>
                  </div>
                </div>

                <div className="kpi-card blue">
                  <div className="kpi-icon">
                    <FaUserTie />
                  </div>
                  <div className="kpi-info">
                    <span className="kpi-label">Total Active Recruiters</span>
                    <h3 className="kpi-value">{recruiterStats.length}</h3>
                    <p className="kpi-subtext">Actively sourcing profiles</p>
                  </div>
                </div>

                <div className="kpi-card teal">
                  <div className="kpi-icon">
                    <FaCheckCircle />
                  </div>
                  <div className="kpi-info">
                    <span className="kpi-label">Total Joinees Placed</span>
                    <h3 className="kpi-value">{totalJoined}</h3>
                    <p className="kpi-subtext">Across all business verticals</p>
                  </div>
                </div>

                <div className="kpi-card purple">
                  <div className="kpi-icon">
                    <FaPercent />
                  </div>
                  <div className="kpi-info">
                    <span className="kpi-label">Global Join Rate</span>
                    <h3 className="kpi-value">{globalConversionRate}%</h3>
                    <p className="kpi-subtext">Sourced to joined percentage</p>
                  </div>
                </div>
              </div>

              {/* Recruiter Leaderboard Table */}
              <div className="leaderboard-section">
                <h4>Recruiter Conversion Leaderboard</h4>
                <div className="leaderboard-card">
                  <table className="leaderboard-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Recruiter Name</th>
                        <th>Profiles Sourced</th>
                        <th>Screening / Sourced</th>
                        <th>In Progress / Interiew</th>
                        <th>Offered</th>
                        <th>Joined</th>
                        <th>Rejected</th>
                        <th>Conversion Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recruiterStats.map((recruiter, index) => (
                        <tr key={recruiter.name}>
                          <td>
                            <span className={`rank-badge rank-${index + 1}`}>
                              #{index + 1}
                            </span>
                          </td>
                          <td className="text-capitalize">
                            <strong>{recruiter.name}</strong>
                          </td>
                          <td>{recruiter.sourced}</td>
                          <td>{recruiter.screening}</td>
                          <td>{recruiter.interview}</td>
                          <td>{recruiter.offered}</td>
                          <td>
                            <span className="joined-count-highlight">
                              {recruiter.joined}
                            </span>
                          </td>
                          <td>{recruiter.rejected}</td>
                          <td>
                            <div className="conversion-wrapper">
                              <span className="rate-value">{recruiter.conversionRate}%</span>
                              <div className="mini-progress-bar">
                                <div className="fill" style={{ width: `${recruiter.conversionRate}%` }}></div>
                              </div>
                            </div>
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

export default RecruiterReport;
