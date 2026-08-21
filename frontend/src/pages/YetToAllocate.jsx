import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFileAlt,
  FaEllipsisV,
  FaEye,
  FaUserCheck,
} from "react-icons/fa";

import Sidebar from "./Sidebar";
import LogoutModal from "./LogoutModal";
import api from "../services/api";

import "../style/AllocationList.css";
import "../style/BusinessUnit.css";

function YetToAllocate() {
  const navigate = useNavigate();

  const [rfhList, setRfhList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionDropdown, setActionDropdown] = useState(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  // ============================================================
  // FETCH RFH LIST
  // ============================================================

  useEffect(() => {
    fetchRfhList();
  }, []);

  const fetchRfhList = async () => {
    try {
      setLoading(true);

      const response = await api.get("/rfh");

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      console.log("RFH API RESPONSE:", data);

      setRfhList(data);
    } catch (error) {
      console.error("Failed to fetch RFH list:", error);

      showToast(
        "error",
        "Failed to load Yet to Allocate List"
      );

      setRfhList([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this RFH?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/rfh/${id}`);

      showToast(
        "success",
        "RFH deleted successfully"
      );

      fetchRfhList();
    } catch (error) {
      console.error(
        "Failed to delete RFH:",
        error
      );

      showToast(
        "error",
        error?.response?.data?.message ||
          "Failed to delete RFH"
      );
    }
  };

  // ============================================================
  // TOAST
  // ============================================================

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
  // SEARCH & FILTER
  // ============================================================

  const getRfhNumber = (rfh) => {
    if (!rfh) return "-";
    if (rfh.rfhNo && String(rfh.rfhNo).trim() !== "") return String(rfh.rfhNo).trim();
    if (rfh.recReqID && String(rfh.recReqID).trim() !== "") return String(rfh.recReqID).trim();
    if (rfh.resId && String(rfh.resId).trim() !== "") return String(rfh.resId).trim();
    return "-";
  };

  const filteredList = rfhList.filter((rfh) => {
    // 1. Only show "Yet to Allocate" (Unassigned) requests
    const isUnassigned = rfh.assignedStatus === "Unassigned" || !rfh.assignedStatus;
    if (!isUnassigned) {
      return false;
    }

    // 2. Apply search filter
    const searchLower = searchTerm.toLowerCase().trim();

    return (
      getRfhNumber(rfh)
        .toLowerCase()
        .includes(searchLower) ||
      String(rfh.positionTitle || "")
        .toLowerCase()
        .includes(searchLower) ||
      String(rfh.business || "")
        .toLowerCase()
        .includes(searchLower) ||
      String(rfh.division || "")
        .toLowerCase()
        .includes(searchLower)
    );
  });

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="alloc-layout">

      {/* SIDEBAR */}
      <Sidebar />

      {/* TOAST */}
      {toast.show && (
        <div
          className={`toast-notification ${toast.type}`}
        >
          {toast.message}
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="alloc-content">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <header className="page-header">

          <div className="header-title">
            <h2>Yet to Allocate</h2>
            <p>Manage and track recruitment requests that have not been assigned yet</p>
          </div>

          <div className="header-actions">
            <button
              className="add-business-btn"
              onClick={() => navigate("/rfh/create")}
            >
              <FaPlus />
              <span>Create RFH Form</span>
            </button>
            <button
              className="logout-btn"
              onClick={() => setShowLogoutModal(true)}
            >
              Sign Out
            </button>
          </div>

        </header>

        {/* ====================================================
            BODY
        ==================================================== */}

        <main className="alloc-body">

          <div className="business-table-card">

            <div className="table-header-toolbar">
              <div className="table-title">
                <h3>Yet to Allocate</h3>
                <span>
                  Total: <strong>{filteredList.length}</strong> records
                </span>
              </div>

              <div className="toolbar-actions">
                <div className="search-wrapper">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by RFH #, Title, Business..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="clear-search-btn"
                      onClick={() => setSearchTerm("")}
                    >
                      ×
                    </button>
                  )}
                </div>
                <select className="sort-select-dropdown">
                  <option value="a-z">Sort A-Z</option>
                  <option value="z-a">Sort Z-A</option>
                </select>
              </div>
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="rr-loading">
                <div className="rr-spinner"></div>
                Loading yet to allocate requests...
              </div>
            ) : filteredList.length === 0 ? (
              /* EMPTY */
              <div className="rr-empty">
                <div className="rr-empty-title">
                  No Yet to Allocated Requests
                </div>
                <div className="rr-empty-text">
                  {searchTerm
                    ? "Try changing your search."
                    : "Unassigned RFH requests will appear here."}
                </div>
              </div>
            ) : (
              <div className="business-table-wrapper">
                <table className="business-table">
                  <thead>
                    <tr>
                      <th>S.NO</th>
                      <th>REC REQ ID</th>
                      <th>RFH NO</th>
                      <th>POSITION TITLE</th>
                      <th>NO. OF POSITIONS</th>
                      <th>BAND</th>
                      <th>BUSINESS</th>
                      <th>DIVISION</th>
                      <th>LOCATION</th>
                      <th>REQUEST STATUS</th>
                      <th>ALLOCATION STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.map((rfh, index) => (
                      <tr key={rfh.id}>
                        {/* S.NO */}
                        <td data-label="S.NO">{index + 1}</td>

                        {/* REC REQ ID */}
                        <td data-label="REC REQ ID">
                          <span className="rr-rec-id">
                            {rfh.resId || rfh.recReqID || "-"}
                          </span>
                        </td>

                        {/* RFH */}
                        <td data-label="RFH NO">{rfh.ticketNumber || rfh.rfhNo || "-"}</td>

                        {/* POSITION */}
                        <td data-label="POSITION TITLE">
                          <span className="rr-position-title">
                            {rfh.positionTitle || "-"}
                          </span>
                        </td>

                        {/* POSITIONS */}
                        <td data-label="NO. OF POSITIONS">{rfh.noOfPosition || "-"}</td>

                        {/* BAND */}
                        <td data-label="BAND">{rfh.band || "-"}</td>

                        {/* BUSINESS */}
                        <td data-label="BUSINESS">{rfh.business || "-"}</td>

                        {/* DIVISION */}
                        <td data-label="DIVISION">{rfh.division || "-"}</td>

                        {/* LOCATION */}
                        <td data-label="LOCATION">{rfh.location || "-"}</td>

                        {/* REQUEST STATUS */}
                        <td data-label="REQUEST STATUS">
                          <span className="rr-request-status">
                            {rfh.requestStatus || "Open"}
                          </span>
                        </td>

                        {/* ALLOCATION STATUS */}
                        <td data-label="ALLOCATION STATUS">
                          <span className="rr-status pending">
                            Yet to Allocated
                          </span>
                        </td>

                        {/* ACTION */}
                        <td data-label="ACTIONS">
                          <div className="rr-actions">
                            <button
                              className="rr-action-dots"
                              onClick={() =>
                                setActionDropdown(
                                  actionDropdown === rfh.id ? null : rfh.id
                                )
                              }
                            >
                              <FaEllipsisV />
                            </button>

                            {actionDropdown === rfh.id && (
                              <>
                                <div
                                  className="rr-dropdown-overlay"
                                  onClick={() => setActionDropdown(null)}
                                ></div>
                                <div className="rr-action-menu">
                                  {/* VIEW */}
                                  <button
                                    onClick={() => {
                                      setActionDropdown(null);
                                      navigate(`/rfh/view/${rfh.id}`);
                                    }}
                                  >
                                    <FaEye /> View
                                  </button>

                                  {/* EDIT */}
                                  <button
                                    onClick={() => {
                                      setActionDropdown(null);
                                      navigate(`/rfh/edit/${rfh.id}`);
                                    }}
                                  >
                                    <FaEdit /> Edit
                                  </button>

                                  {/* DELETE */}
                                  <button
                                    className="action-dropdown-item delete"
                                    onClick={() => {
                                      setActionDropdown(null);
                                      handleDelete(rfh.id);
                                    }}
                                  >
                                    <FaTrash /> Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </main>

      </div>

      {/* ======================================================
          LOGOUT MODAL
      ====================================================== */}

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />

    </div>
  );
}

export default YetToAllocate;