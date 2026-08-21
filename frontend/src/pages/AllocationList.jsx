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

function AllocationList() {
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
        "Failed to load Allocation List"
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
  // RFH NUMBER
  // IMPORTANT:
  // RFH NUMBER = resId ONLY
  // ticketNumber is NOT used here
  // ============================================================

  const getRfhNumber = (rfh) => {
    if (
      rfh &&
      rfh.resId !== null &&
      rfh.resId !== undefined &&
      String(rfh.resId).trim() !== ""
    ) {
      return String(rfh.resId).trim();
    }

    return "-";
  };

  // ============================================================
  // TICKET NUMBER
  // IMPORTANT:
  // TICKET NUMBER = ticketNumber ONLY
  // resId is NOT used here
  // ============================================================

  const getTicketNumber = (rfh) => {
    if (
      rfh &&
      rfh.ticketNumber !== null &&
      rfh.ticketNumber !== undefined &&
      String(rfh.ticketNumber).trim() !== ""
    ) {
      return String(rfh.ticketNumber).trim();
    }

    return "-";
  };

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredList = rfhList.filter((rfh) => {
    const searchLower = searchTerm
      .toLowerCase()
      .trim();

    return (
      // RFH Number
      getRfhNumber(rfh)
        .toLowerCase()
        .includes(searchLower) ||

      // Ticket Number
      getTicketNumber(rfh)
        .toLowerCase()
        .includes(searchLower) ||

      // Job Title
      String(rfh.positionTitle || "")
        .toLowerCase()
        .includes(searchLower) ||

      // Business
      String(rfh.business || "")
        .toLowerCase()
        .includes(searchLower) ||

      // Department
      String(rfh.department || "")
        .toLowerCase()
        .includes(searchLower) ||

      // Team
      String(rfh.rollsOption || "")
        .toLowerCase()
        .includes(searchLower) ||

      // Requested By
      String(rfh.requestBy || "")
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

            <h2>
              Allocation List
            </h2>

            <p>
              Manage and track all recruitment
              requests (RFHs)
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
                placeholder="Search by RFH #, Ticket #, Title, Business, Department..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />

            </div>

            {/* CREATE */}
            <button
              className="create-rfh-btn"
              onClick={() =>
                navigate("/rfh/create")
              }
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
                Loading allocation requests...
              </div>

            ) : filteredList.length === 0 ? (

              /* EMPTY */
              <div className="alloc-empty">
                No RFH allocation requests found.
              </div>

            ) : (

              <table className="alloc-table">

                <thead>

                  <tr>

                    <th>
                      S.No
                    </th>

                    <th>
                      RFH Number
                    </th>

                    <th>
                      Team
                    </th>

                    <th>
                      Position Title
                    </th>

                    <th>
                      History
                    </th>

                    <th>
                      No of Positions
                    </th>

                    <th>
                      Position Ageing
                    </th>

                    <th>
                      Opening Date
                    </th>

                    <th>
                      Location
                    </th>

                    <th className="text-center">
                      Actions
                    </th>

                    <th>
                      Request Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredList.map(
                    (rfh, index) => (

                      <tr
                        key={rfh.id}
                      >

                        {/* S.NO */}
                        <td>
                          {index + 1}
                        </td>

                        {/* ==================================================
                            RFH NUMBER
                            
                            ONLY resId
                            
                            Example:
                            resId = RFH001
                            
                            Display:
                            RFH001
                        ================================================== */}

                        <td>

                          <span className="rfh-number-badge">

                            <FaFileAlt />

                            {getRfhNumber(rfh)}

                          </span>

                        </td>

                        {/* TEAM */}
                        <td>
                          {rfh.rollsOption || "-"}
                        </td>

                        {/* POSITION TITLE */}
                        <td className="text-capitalize">
                          {rfh.positionTitle || "-"}
                        </td>

                        {/* HISTORY */}
                        <td>
                          {rfh.history || "-"}
                        </td>

                        {/* NO OF POSITIONS */}
                        <td>
                          {rfh.noOfPositions || "-"}
                        </td>

                        {/* POSITION AGEING */}
                        <td>
                          {rfh.positionAgeing || "-"}
                        </td>

                        {/* OPENING DATE */}
                        <td>
                          {rfh.openingDate || "-"}
                        </td>

                        {/* LOCATION */}
                        <td>
                          {rfh.location || "-"}
                        </td>

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

                        {/* REQUEST DATE */}
                        <td>
                          {rfh.requestDate || "-"}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            )}

          </div>

        </main>

      </div>

      {/* ======================================================
          LOGOUT MODAL
      ====================================================== */}

      <LogoutModal
        isOpen={showLogoutModal}
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

export default AllocationList;