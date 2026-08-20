import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaEnvelope, FaPhoneAlt, FaBuilding, FaBriefcase, FaTimes, FaCalendarAlt } from "react-icons/fa";
import Sidebar from "./Sidebar";
import LogoutModal from "./LogoutModal";
import api from "../services/api";
import "../style/CandidateDatabase.css";

function CandidateDatabase() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [recruiterFilter, setRecruiterFilter] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
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
      console.error("Failed to fetch candidates from backend:", err);
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

  const filteredCandidates = candidates.filter((candidate) => {
    const nameMatch = String(candidate.candidateName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(candidate.designation || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(candidate.cdID || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === "" || String(candidate.status || "").toLowerCase() === statusFilter.toLowerCase();
    const recruiterMatch = recruiterFilter === "" || String(candidate.orRecruiterName || "").toLowerCase().includes(recruiterFilter.toLowerCase());

    return nameMatch && statusMatch && recruiterMatch;
  });

  return (
    <div className="candidate-layout">
      <Sidebar />

      <div className="candidate-content">
        <header className="page-header">
          <div className="header-title">
            <h2>Candidate Database</h2>
            <p>Track, filter, and view all recruited candidates in the database</p>
          </div>
          <div className="header-actions">
            <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
              Sign Out
            </button>
          </div>
        </header>

        <main className="candidate-body">
          {/* Sourcing Toolbar */}
          <div className="candidate-toolbar">
            <div className="candidate-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search by candidate name, designation, CDID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="Sourced">Sourced</option>
                <option value="Screening">Screening</option>
                <option value="L1_Interview">L1 Interview</option>
                <option value="L2_Interview">L2 Interview</option>
                <option value="HR_Discussion">HR Discussion</option>
                <option value="Offered">Offered</option>
                <option value="Joined">Joined</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select value={recruiterFilter} onChange={(e) => setRecruiterFilter(e.target.value)}>
                <option value="">All Recruiters</option>
                <option value="pavithra">pavithra</option>
                <option value="balaji">balaji</option>
                <option value="dhanush">dhanush</option>
                <option value="senthil">senthil</option>
              </select>
            </div>
          </div>

          {/* Grid Layout containing Table and Side Detail Panel */}
          <div className="candidate-grid">
            <div className={`table-panel ${selectedCandidate ? "split" : "full"}`}>
              <div className="candidate-table-card">
                {loading ? (
                  <div className="candidate-loading">Loading candidate list...</div>
                ) : filteredCandidates.length === 0 ? (
                  <div className="candidate-empty">No candidates found matching the filters.</div>
                ) : (
                  <table className="candidate-table">
                    <thead>
                      <tr>
                        <th>CDID</th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Recruiter</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCandidates.map((candidate) => (
                        <tr
                          key={candidate.id}
                          className={selectedCandidate?.id === candidate.id ? "active-row" : ""}
                          onClick={() => setSelectedCandidate(candidate)}
                        >
                          <td>
                            <span className="cdid-badge">{candidate.cdID || `CD-${candidate.id}`}</span>
                          </td>
                          <td>
                            <strong>{candidate.candidateName}</strong>
                          </td>
                          <td>{candidate.designation || "-"}</td>
                          <td className="text-capitalize">{candidate.orRecruiterName || "Sourced"}</td>
                          <td>
                            <span className={`status-pill ${String(candidate.status || "Sourced").toLowerCase()}`}>
                              {String(candidate.status || "Sourced").replace("_", " ")}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Quick Details Drawer/Panel */}
            {selectedCandidate && (
              <div className="details-panel">
                <div className="panel-header">
                  <h3>Candidate Details</h3>
                  <button className="close-panel-btn" onClick={() => setSelectedCandidate(null)}>
                    <FaTimes />
                  </button>
                </div>

                <div className="panel-body">
                  <div className="detail-profile">
                    <div className="avatar-circle">
                      {selectedCandidate.candidateName?.charAt(0)}
                    </div>
                    <h4>{selectedCandidate.candidateName}</h4>
                    <span className={`status-pill ${String(selectedCandidate.status).toLowerCase()}`}>
                      {String(selectedCandidate.status).replace("_", " ")}
                    </span>
                  </div>

                  <div className="detail-info-list">
                    <div className="info-item">
                      <FaBriefcase />
                      <div>
                        <label>Designation</label>
                        <p>{selectedCandidate.designation || "-"}</p>
                      </div>
                    </div>

                    <div className="info-item">
                      <FaEnvelope />
                      <div>
                        <label>Email ID</label>
                        <p>{selectedCandidate.candidateEmail || "-"}</p>
                      </div>
                    </div>

                    <div className="info-item">
                      <FaPhoneAlt />
                      <div>
                        <label>Mobile Number</label>
                        <p>{selectedCandidate.candidateMobile || "-"}</p>
                      </div>
                    </div>

                    <div className="info-item">
                      <FaUser />
                      <div>
                        <label>Assigned Recruiter</label>
                        <p className="text-capitalize">{selectedCandidate.orRecruiterName || "-"}</p>
                      </div>
                    </div>

                    <div className="info-divider">CTC & Experience Details</div>

                    <div className="info-grid">
                      <div>
                        <label>Total Experience</label>
                        <p>{selectedCandidate.totalExperience || "Not Specified"}</p>
                      </div>
                      <div>
                        <label>Notice Period</label>
                        <p>{selectedCandidate.noticePeriod || "Not Specified"}</p>
                      </div>
                      <div>
                        <label>Current CTC</label>
                        <p>{selectedCandidate.currentCtc || "N/A"}</p>
                      </div>
                      <div>
                        <label>Expected CTC</label>
                        <p>{selectedCandidate.expectedCtc || "N/A"}</p>
                      </div>
                    </div>

                    <div className="info-divider">Remarks & Screening Comments</div>
                    <div className="remarks-box">
                      <p>{selectedCandidate.remarks || "No comments entered yet."}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

export default CandidateDatabase;
