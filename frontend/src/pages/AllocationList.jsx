import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFileAlt,
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
                      Team
                    </th>

                    <th>
                      Positions
                    </th>

                    <th>
                      Requested By
                    </th>

                    <th className="text-center">
                      Actions
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

                        {/* ==================================================
                            TICKET NUMBER

                            ONLY ticketNumber

                            Example:
                            ticketNumber = TICKET001

                            Display:
                            TICKET001
                        ================================================== */}

                        <td>

                          <span className="ticket-number">

                            {getTicketNumber(rfh)}

                          </span>

                        </td>

                        {/* JOB TITLE */}
                        <td className="text-capitalize">
                          {rfh.positionTitle || "-"}
                        </td>

                        {/* BUSINESS */}
                        <td>
                          {rfh.business || "-"}
                        </td>

                        {/* DEPARTMENT */}
                        <td>
                          {rfh.department || "-"}
                        </td>

                        {/* TEAM */}
                        <td>
                          {rfh.rollsOption || "-"}
                        </td>

                        {/* POSITIONS */}
                        <td>
                          {rfh.noOfPositions || "-"}
                        </td>

                        {/* REQUESTED BY */}
                        <td>
                          {rfh.requestBy || "Admin"}
                        </td>

                        {/* ACTIONS */}
                        <td>

                          <div className="alloc-actions">

                            {/* EDIT */}
                            <button
                              className="btn-action-edit"
                              onClick={() =>
                                navigate(
                                  `/rfh/edit/${rfh.id}`
                                )
                              }
                              title="Edit RFH"
                            >
                              <FaEdit />
                            </button>

                            {/* DELETE */}
                            <button
                              className="btn-action-delete"
                              onClick={() =>
                                handleDelete(
                                  rfh.id
                                )
                              }
                              title="Delete RFH"
                            >
                              <FaTrash />
                            </button>

                          </div>

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