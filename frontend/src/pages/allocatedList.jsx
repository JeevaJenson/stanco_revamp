import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFileAlt,
  FaEllipsisV,
} from "react-icons/fa";

import Sidebar from "./Sidebar";
import LogoutModal from "./LogoutModal";
import api from "../services/api";

import "../style/AllocationList.css";

function AllocatedList() {
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
        "Failed to load Allocated List"
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
    // 1. Only show "Allocated" requests
    const isAssigned = rfh.assignedStatus && rfh.assignedStatus !== "Unassigned";
    if (!isAssigned) {
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
            <h2>Allocated List</h2>
            <p>Manage and track recruitment requests that have been assigned</p>
          </div>

          <div className="header-actions">
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

          {/* ==================================================
              TOOLBAR
          ================================================== */}

          <div className="alloc-toolbar">

            {/* SEARCH */}
            <div className="alloc-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search by RFH #, Title, Business, Division..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            {/* CREATE */}
            <button
              className="create-rfh-btn"
              onClick={() => navigate("/rfh/create")}
            >
              <FaPlus />
              Create RFH Form
            </button>

          </div>

          {/* ==================================================
              TABLE
          ================================================== */}

          <div className="alloc-table-card">

            {/* LOADING */}
            {loading ? (
              <div className="alloc-loading">
                Loading allocated requests...
              </div>
            ) : filteredList.length === 0 ? (
              /* EMPTY */
              <div className="alloc-empty">
                No allocated RFH requests found.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="alloc-table">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>RFH Number</th>
                      <th>Position Title</th>
                      <th>No. of Positions</th>
                      <th>Band</th>
                      <th>Business</th>
                      <th>Division</th>
                      <th>Location</th>
                      <th>Open Date</th>
                      <th>Request Status</th>
                      <th>Assigned Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.map((rfh, index) => (
                      <tr key={rfh.id}>
                        {/* S.NO */}
                        <td>{index + 1}</td>

                        {/* RFH NUMBER */}
                        <td>
                          <span className="rfh-number-badge">
                            <FaFileAlt />
                            {getRfhNumber(rfh)}
                          </span>
                        </td>

                      {/* POSITION TITLE */}
                      <td className="text-capitalize">{rfh.positionTitle || "-"}</td>

                      {/* NO OF POSITIONS */}
                      <td>{rfh.noOfPosition || "-"}</td>

                      {/* BAND */}
                      <td>{rfh.band || "-"}</td>

                      {/* BUSINESS */}
                      <td>{rfh.business || "-"}</td>

                      {/* DIVISION */}
                      <td>{rfh.division || "-"}</td>

                      {/* LOCATION */}
                      <td>{rfh.location || "-"}</td>

                      {/* OPEN DATE */}
                      <td>{rfh.openDate || "-"}</td>

                      {/* REQUEST STATUS */}
                      <td>{rfh.requestStatus || "-"}</td>

                      {/* ASSIGNED STATUS */}
                      <td>{rfh.assignedStatus || "-"}</td>

                      {/* ACTIONS */}
                      <td>
                        <div className="alloc-actions">
                          <button
                            className="btn-action-dots"
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
                                className="dropdown-overlay"
                                onClick={() => setActionDropdown(null)}
                              ></div>
                              <div className="action-dropdown-menu">
                                <button
                                  className="action-dropdown-item"
                                  onClick={() => {
                                    setActionDropdown(null);
                                    navigate(`/rfh/edit/${rfh.id}`);
                                  }}
                                >
                                  <FaEdit /> Edit
                                </button>
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

export default AllocatedList;