import React, { useEffect, useState } from "react";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSearch,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

import api from "../services/api";
import DMSidebar from "./DMSidebar";

import "../style/BusinessUnit.css";


function BusinessUnit() {

  // =====================================================
  // STATE
  // =====================================================

  const [businessUnits, setBusinessUnits] = useState([]);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: ""
  });


  const [formData, setFormData] = useState({
    buId: "",
    businessName: "",
    status: "active"
  });


  // =====================================================
  // TOAST
  // =====================================================

  const showToast = (type, message) => {

    setToast({
      show: true,
      type,
      message
    });

    setTimeout(() => {

      setToast({
        show: false,
        type: "",
        message: ""
      });

    }, 3000);
  };


  // =====================================================
  // NORMALIZE STATUS
  // =====================================================

  const normalizeStatus = (status) => {

    if (
      status === "active" ||
      status === "ACTIVE" ||
      status === "1" ||
      status === 1
    ) {
      return "active";
    }

    return "inactive";
  };


  // =====================================================
  // FETCH BUSINESS UNITS
  // =====================================================

  const fetchBusinessUnits = async () => {

    try {

      setLoading(true);

      const response =
        await api.get("/business-masters");

      console.log(
        "Business Unit response:",
        response.data
      );

      const data =
        Array.isArray(response.data)
          ? response.data
          : [];

      setBusinessUnits(data);

      setCurrentPage(1);

    } catch (error) {

      console.error(
        "Business Unit fetch error:",
        error
      );

      if (error.response?.status === 401) {

        showToast(
          "error",
          "Session expired. Please login again."
        );

        return;
      }

      if (error.response?.status === 403) {

        showToast(
          "error",
          "You don't have permission to access Business Units"
        );

        return;
      }

      showToast(
        "error",
        error.response?.data?.message ||
        "Failed to load Business Units"
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchBusinessUnits();

  }, []);


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData((previous) => ({

      ...previous,

      [name]: value

    }));

  };


  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const openAddModal = () => {

    setEditId(null);

    setFormData({
      buId: "",
      businessName: "",
      status: "active"
    });

    setShowModal(true);

  };


  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (business) => {

    setEditId(business.id);

    setFormData({

      buId:
        business.buId || "",

      businessName:
        business.businessName || "",

      status:
        normalizeStatus(
          business.status
        )

    });

    setShowModal(true);

  };


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {

    if (saving) {
      return;
    }

    setShowModal(false);

    setEditId(null);

    setFormData({
      buId: "",
      businessName: "",
      status: "active"
    });

  };


  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    const buId =
      formData.buId.trim();

    const businessName =
      formData.businessName.trim();


    if (!businessName) {

      showToast(
        "error",
        "Business name is required"
      );

      return;
    }


    try {

      setSaving(true);


      const requestData = {

        buId:
          buId || null,

        businessName:
          businessName,

        status:
          normalizeStatus(
            formData.status
          )

      };


      console.log(
        "Business Unit request:",
        requestData
      );


      // =================================================
      // UPDATE
      // =================================================

      if (editId !== null) {

        const response =
          await api.put(

            `/business-masters/${editId}`,

            requestData

          );

        console.log(
          "Business Unit updated:",
          response.data
        );

        showToast(
          "success",
          "Business Unit updated successfully"
        );

      }


      // =================================================
      // CREATE
      // =================================================

      else {

        const response =
          await api.post(

            "/business-masters",

            requestData

          );

        console.log(
          "Business Unit created:",
          response.data
        );

        showToast(
          "success",
          "Business Unit created successfully"
        );

      }


      setShowModal(false);

      setEditId(null);

      setFormData({
        buId: "",
        businessName: "",
        status: "active"
      });


      await fetchBusinessUnits();

    } catch (error) {

      console.error(
        "Business Unit save error:",
        error
      );


      if (error.response?.status === 400) {

        showToast(
          "error",
          error.response?.data?.message ||
          "Invalid Business Unit data"
        );

        return;
      }


      if (error.response?.status === 401) {

        showToast(
          "error",
          "Session expired. Please login again."
        );

        return;
      }


      if (error.response?.status === 403) {

        showToast(
          "error",
          "You don't have permission to perform this action"
        );

        return;
      }


      showToast(
        "error",
        error.response?.data?.message ||
        "Failed to save Business Unit"
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // DELETE - SOFT DELETE
  // =====================================================

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to deactivate this Business Unit?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setLoading(true);

      await api.delete(
        `/business-masters/${id}`
      );


      showToast(
        "success",
        "Business Unit deactivated successfully"
      );


      await fetchBusinessUnits();

    } catch (error) {

      console.error(
        "Business Unit delete error:",
        error
      );


      if (error.response?.status === 401) {

        showToast(
          "error",
          "Session expired. Please login again."
        );

        return;
      }


      if (error.response?.status === 403) {

        showToast(
          "error",
          "You don't have permission to deactivate Business Units"
        );

        return;
      }


      showToast(
        "error",
        error.response?.data?.message ||
        "Failed to deactivate Business Unit"
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // FILTER
  // =====================================================

  const searchValue =
    search.trim().toLowerCase();


  const filteredBusinessUnits =
    businessUnits.filter(
      (business) => {

        const status =
          normalizeStatus(
            business.status
          );


        if (
          statusFilter !== "all" &&
          status !== statusFilter
        ) {

          return false;

        }


        if (!searchValue) {

          return true;

        }


        const buId =
          String(
            business.buId || ""
          ).toLowerCase();


        const businessName =
          String(
            business.businessName || ""
          ).toLowerCase();


        const createdBy =
          String(
            business.createdBy || ""
          ).toLowerCase();


        const updatedBy =
          String(
            business.updatedBy || ""
          ).toLowerCase();


        return (

          buId.includes(searchValue)

          ||

          businessName.includes(searchValue)

          ||

          status.includes(searchValue)

          ||

          createdBy.includes(searchValue)

          ||

          updatedBy.includes(searchValue)

        );

      }
    );


  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages =
    Math.ceil(
      filteredBusinessUnits.length /
      itemsPerPage
    );


  const startIndex =
    (currentPage - 1) *
    itemsPerPage;


  const currentBusinessUnits =
    filteredBusinessUnits.slice(
      startIndex,
      startIndex + itemsPerPage
    );


  useEffect(() => {

    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {

      setCurrentPage(totalPages);

    }

    if (
      totalPages === 0 &&
      currentPage !== 1
    ) {

      setCurrentPage(1);

    }

  }, [
    totalPages,
    currentPage
  ]);


  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    try {

      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }
      );

    } catch {

      return "-";

    }

  };


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {

    return normalizeStatus(status) === "active"

      ? "status-badge active"

      : "status-badge inactive";

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="business-page">

      <DMSidebar />


      <div className="business-content">


        {/* HEADER */}

        <div className="business-header">

          <div>

            <h2>
              Business Unit Management
            </h2>

            <p>
              Manage business units and business information
            </p>

          </div>


          <button
            type="button"
            className="add-business-btn"
            onClick={openAddModal}
          >

            <FaPlus />

            Add Business Unit

          </button>

        </div>


        {/* TOOLBAR */}

        <div className="business-toolbar">

          <div className="business-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search business unit..."
              value={search}
              onChange={(e) => {

                setSearch(
                  e.target.value
                );

                setCurrentPage(1);

              }}
            />


            {search && (

              <button
                type="button"
                className="clear-business-search"
                onClick={() => {

                  setSearch("");

                  setCurrentPage(1);

                }}
              >

                <FaTimes />

              </button>

            )}

          </div>


          <select
            className="business-status-filter"
            value={statusFilter}
            onChange={(e) => {

              setStatusFilter(
                e.target.value
              );

              setCurrentPage(1);

            }}
          >

            <option value="all">
              All Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

          </select>


          <div className="business-count">

            Total:{" "}

            <strong>
              {filteredBusinessUnits.length}
            </strong>

          </div>

        </div>


        {/* TABLE */}

        <div className="business-table-card">


          {loading ? (

            <div className="business-loading">
              Loading Business Units...
            </div>

          ) : filteredBusinessUnits.length === 0 ? (

            <div className="business-empty">

              <h3>
                No Business Units found
              </h3>

              <p>
                Try changing your search or add a new Business Unit.
              </p>

            </div>

          ) : (

            <>

              <div className="business-table-wrapper">

                <table className="business-table">

                  <thead>

                    <tr>

                      <th>S.No</th>

                      <th>BU ID</th>

                      <th>Business Name</th>

                      <th>Status</th>

                      <th>Created By</th>

                      <th>Created At</th>

                      <th>Updated By</th>

                      <th>Updated At</th>

                      <th>Deleted At</th>

                      <th>Actions</th>

                    </tr>

                  </thead>


                  <tbody>

                    {currentBusinessUnits.map(
                      (business, index) => (

                        <tr
                          key={
                            business.id
                          }
                        >

                          <td data-label="S.No">

                            {startIndex +
                              index +
                              1}

                          </td>


                          <td data-label="BU ID">

                            <strong>
                              {business.buId ||
                                "-"}
                            </strong>

                          </td>


                          <td data-label="Business Name">

                            {business.businessName ||
                              "-"}

                          </td>


                          <td data-label="Status">

                            <span
                              className={
                                getStatusClass(
                                  business.status
                                )
                              }
                            >

                              {
                                normalizeStatus(
                                  business.status
                                )
                              }

                            </span>

                          </td>


                          <td data-label="Created By">

                            {
                              business.createdBy ||
                              "-"
                            }

                          </td>


                          <td data-label="Created At">

                            {
                              formatDate(
                                business.createdAt
                              )
                            }

                          </td>


                          <td data-label="Updated By">

                            {
                              business.updatedBy ||
                              "-"
                            }

                          </td>


                          <td data-label="Updated At">

                            {
                              formatDate(
                                business.updatedAt
                              )
                            }

                          </td>


                          <td data-label="Deleted At">

                            {
                              formatDate(
                                business.deletedAt
                              )
                            }

                          </td>


                          <td data-label="Actions">

                            <div className="action-buttons">


                              <button
                                type="button"
                                className="edit-btn"
                                title="Edit"
                                onClick={() =>
                                  openEditModal(
                                    business
                                  )
                                }
                              >

                                <FaEdit />

                              </button>


                              <button
                                type="button"
                                className="delete-btn"
                                title={
                                  normalizeStatus(
                                    business.status
                                  ) === "inactive"
                                    ? "Already inactive"
                                    : "Deactivate"
                                }
                                disabled={
                                  normalizeStatus(
                                    business.status
                                  ) === "inactive"
                                }
                                onClick={() =>
                                  handleDelete(
                                    business.id
                                  )
                                }
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

              </div>


              {/* PAGINATION */}

              <div className="business-pagination">

                <div className="business-pagination-info">

                  Showing{" "}

                  <strong>
                    {startIndex + 1}
                  </strong>

                  {" - "}

                  <strong>
                    {Math.min(
                      startIndex +
                        itemsPerPage,
                      filteredBusinessUnits.length
                    )}
                  </strong>

                  {" of "}

                  <strong>
                    {filteredBusinessUnits.length}
                  </strong>

                </div>


                <div className="business-pagination-buttons">


                  <button
                    type="button"
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      setCurrentPage(
                        (previous) =>
                          previous - 1
                      )
                    }
                  >

                    <FaChevronLeft />

                  </button>


                  {Array.from(
                    {
                      length: totalPages
                    },
                    (_, index) =>
                      index + 1
                  ).map((page) => (

                    <button
                      type="button"
                      key={page}
                      className={
                        currentPage === page
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setCurrentPage(
                          page
                        )
                      }
                    >

                      {page}

                    </button>

                  ))}


                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        (previous) =>
                          previous + 1
                      )
                    }
                  >

                    <FaChevronRight />

                  </button>

                </div>

              </div>

            </>

          )}

        </div>

      </div>


      {/* =================================================
          MODAL
      ================================================= */}

      {showModal && (

        <div
          className="business-modal-overlay"
          onMouseDown={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {

              closeModal();

            }

          }}
        >

          <div className="business-modal">


            <div className="modal-header">

              <div>

                <h3>

                  {editId !== null
                    ? "Edit Business Unit"
                    : "Add Business Unit"}

                </h3>

                <p>

                  {editId !== null
                    ? "Update business unit details"
                    : "Create a new business unit"}

                </p>

              </div>


              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
                disabled={saving}
              >

                <FaTimes />

              </button>

            </div>


            <form
              className="business-form"
              onSubmit={handleSubmit}
            >


              <div className="form-group">

                <label>
                  BU ID
                </label>

                <input
                  type="text"
                  name="buId"
                  placeholder="Example: BU001"
                  value={
                    formData.buId
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    saving
                  }
                  maxLength={50}
                />

              </div>


              <div className="form-group">

                <label>

                  Business Name

                  <span>
                    *
                  </span>

                </label>

                <input
                  type="text"
                  name="businessName"
                  placeholder="Enter business name"
                  value={
                    formData.businessName
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    saving
                  }
                  maxLength={100}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    saving
                  }
                >

                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>

                </select>

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    closeModal
                  }
                  disabled={
                    saving
                  }
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="save-btn"
                  disabled={
                    saving
                  }
                >

                  {saving
                    ? "Saving..."
                    : editId !== null
                    ? "Update"
                    : "Save"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* TOAST */}

      {toast.show && (

        <div
          className={
            `business-toast ${toast.type}`
          }
        >

          {toast.message}

        </div>

      )}

    </div>

  );

}


export default BusinessUnit;