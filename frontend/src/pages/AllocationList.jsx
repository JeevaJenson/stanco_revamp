import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFileAlt } from "react-icons/fa";
import Sidebar from "./Sidebar";
import LogoutModal from "./LogoutModal";
import api from "../services/api";
import "../style/AllocationList.css";

function AllocationList() {
  const navigate = useNavigate();
  const [rfhList, setRfhList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchRfhList();
  }, []);

  const fetchRfhList = async () => {
    try {
      setLoading(true);
      const response = await api.get("/rfh");
      setRfhList(response.data || []);
    } catch (err) {
      console.error("Failed to fetch RFH list:", err);
      showToast("error", "Failed to load Allocation List");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this RFH?");
    if (!confirmed) return;

    try {
      await api.delete(`/rfh/${id}`);
      showToast("success", "RFH deleted successfully");
      fetchRfhList();
    } catch (err) {
      console.error("Failed to delete RFH:", err);
      showToast("error", err?.response?.data?.message || "Failed to delete RFH");
    }
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: "", message: "" });
    }, 3500);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setShowLogoutModal(false);
    navigate("/");
  };

  // Filter RFH List based on search term
  const filteredList = rfhList.filter((rfh) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      String(rfh.ticketNumber || "").toLowerCase().includes(searchLower) ||
      String(rfh.positionTitle || "").toLowerCase().includes(searchLower) ||
      String(rfh.business || "").toLowerCase().includes(searchLower) ||
      String(rfh.department || "").toLowerCase().includes(searchLower) ||
      String(rfh.rollsOption || "").toLowerCase().includes(searchLower) ||
      String(rfh.requestBy || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="alloc-layout">
      <Sidebar />

      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="alloc-content">
        {/* Top Header */}
        <header className="page-header">
          <div className="header-title">
            <h2>Allocation List</h2>
            <p>Manage and track all recruitment requests (RFHs)</p>
          </div>
          <div className="header-actions">
            <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
              Sign Out
            </button>
          </div>
        </header>

        {/* List Body */}
        <main className="alloc-body">
          
          <div className="alloc-toolbar">
            <div className="alloc-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search by RFH #, Title, Business, Team..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button className="create-rfh-btn" onClick={() => navigate("/rfh/create")}>
              <FaPlus /> Create RFH Form
            </button>
          </div>

          <div className="alloc-table-card">
            {loading ? (
              <div className="alloc-loading">Loading allocation requests...</div>
            ) : filteredList.length === 0 ? (
              <div className="alloc-empty">No RFH allocation requests found.</div>
            ) : (
              <table className="alloc-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>RFH Number</th>
                    <th>Job Title</th>
                    <th>Business Unit</th>
                    <th>Department</th>
                    <th>Team</th>
                    <th>Positions</th>
                    <th>Requested By</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((rfh, index) => (
                    <tr key={rfh.id}>
                      <td>{index + 1}</td>
                      <td>
                        <span className="rfh-number-badge">
                          <FaFileAlt />
                          {rfh.ticketNumber || `RFH-${rfh.id}`}
                        </span>
                      </td>
                      <td className="text-capitalize">{rfh.positionTitle || "-"}</td>
                      <td>{rfh.business || "-"}</td>
                      <td>{rfh.department || "-"}</td>
                      <td>{rfh.rollsOption || "-"}</td>
                      <td>{rfh.noOfPositions || "-"}</td>
                      <td>{rfh.requestBy || "Admin"}</td>
                      <td>
                        <div className="alloc-actions">
                          <button
                            className="btn-action-edit"
                            onClick={() => navigate(`/rfh/edit/${rfh.id}`)}
                            title="Edit RFH"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn-action-delete"
                            onClick={() => handleDelete(rfh.id)}
                            title="Delete RFH"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

export default AllocationList;
