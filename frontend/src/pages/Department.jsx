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

import "../style/Department.css";


function Department() {

  // =====================================================
  // STATE
  // =====================================================

  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  // 5 records per page
  const itemsPerPage = 5;

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: ""
  });


  const [formData, setFormData] = useState({
    depId: "",
    name: "",
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
  // GET ALL DEPARTMENTS
  // =====================================================

  const fetchDepartments = async () => {

    try {

      setLoading(true);

      const response = await api.get("/departments");

      console.log(
        "Department response:",
        response.data
      );

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setDepartments(data);

      // Always return to first page after refresh
      setCurrentPage(1);

    } catch (error) {

      console.error(
        "Department fetch error:",
        error
      );

      if (error.response?.status === 400) {

        showToast(
          "error",
          error.response?.data?.message ||
          "Invalid request"
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
          "You don't have permission to access departments"
        );

        return;
      }


      showToast(
        "error",
        error.response?.data?.message ||
        "Failed to load departments"
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchDepartments();

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
      depId: "",
      name: "",
      status: "active"
    });

    setShowModal(true);
  };


  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (department) => {

    setEditId(department.id);

    setFormData({

      depId:
        department.depId || "",

      name:
        department.name || "",

      status:
        normalizeStatus(
          department.status
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
      depId: "",
      name: "",
      status: "active"
    });

  };


  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    const departmentId =
      formData.depId.trim();

    const departmentName =
      formData.name.trim();


    // =================================================
    // VALIDATION
    // =================================================

    if (!departmentId) {

      showToast(
        "error",
        "Department ID is required"
      );

      return;
    }


    if (!departmentName) {

      showToast(
        "error",
        "Department name is required"
      );

      return;
    }


    try {

      setSaving(true);


      // =================================================
      // REQUEST BODY
      // =================================================

      // createdBy / updatedBy are NOT sent.
      //
      // Backend gets logged-in employee ID
      // from JWT Authentication.

      const requestData = {

        depId:
          departmentId,

        name:
          departmentName,

        status:
          normalizeStatus(
            formData.status
          )

      };


      console.log(
        "Department request:",
        requestData
      );


      // =================================================
      // UPDATE
      // =================================================

      if (editId !== null) {

        const response =
          await api.put(

            `/departments/${editId}`,

            requestData

          );


        console.log(
          "Department updated:",
          response.data
        );


        showToast(
          "success",
          "Department updated successfully"
        );

      }


      // =================================================
      // CREATE
      // =================================================

      else {

        const response =
          await api.post(

            "/departments",

            requestData

          );


        console.log(
          "Department created:",
          response.data
        );


        showToast(
          "success",
          "Department created successfully"
        );

      }


      setShowModal(false);

      setEditId(null);

      setFormData({
        depId: "",
        name: "",
        status: "active"
      });


      // Refresh table
      await fetchDepartments();


    } catch (error) {

      console.error(
        "Department save error:",
        error
      );


      if (error.response?.status === 400) {

        showToast(
          "error",
          error.response?.data?.message ||
          "Invalid department data"
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
        "Failed to save department"
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
        "Are you sure you want to deactivate this department?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setLoading(true);


      await api.delete(
        `/departments/${id}`
      );


      showToast(
        "success",
        "Department deactivated successfully"
      );


      await fetchDepartments();


    } catch (error) {

      console.error(
        "Department delete error:",
        error
      );


      if (error.response?.status === 400) {

        showToast(
          "error",
          error.response?.data?.message ||
          "Invalid request"
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
          "You don't have permission to deactivate departments"
        );

        return;
      }


      showToast(
        "error",
        error.response?.data?.message ||
        "Failed to deactivate department"
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // SEARCH + STATUS FILTER
  // =====================================================

  const searchValue =
    search.trim().toLowerCase();


  const filteredDepartments =
    departments.filter(
      (department) => {

        const status =
          normalizeStatus(
            department.status
          );


        // Status filter

        if (
          statusFilter !== "all" &&
          status !== statusFilter
        ) {

          return false;

        }


        // Search

        if (!searchValue) {

          return true;

        }


        const depId =
          String(
            department.depId || ""
          ).toLowerCase();


        const name =
          String(
            department.name || ""
          ).toLowerCase();


        const createdBy =
          String(
            department.createdBy || ""
          ).toLowerCase();


        const updatedBy =
          String(
            department.updatedBy || ""
          ).toLowerCase();


        return (

          depId.includes(searchValue)

          ||

          name.includes(searchValue)

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
      filteredDepartments.length /
      itemsPerPage
    );


  const startIndex =
    (currentPage - 1) *
    itemsPerPage;


  const currentDepartments =
    filteredDepartments.slice(
      startIndex,
      startIndex + itemsPerPage
    );


  // =====================================================
  // KEEP PAGE VALID
  // =====================================================

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
  // SEARCH RESET PAGE
  // =====================================================

  const handleSearchChange = (e) => {

    setSearch(
      e.target.value
    );

    setCurrentPage(1);

  };


  // =====================================================
  // STATUS FILTER CHANGE
  // =====================================================

  const handleStatusFilterChange = (e) => {

    setStatusFilter(
      e.target.value
    );

    setCurrentPage(1);

  };


  // =====================================================
  // DATE FORMAT
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

    <div className="department-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <DMSidebar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="department-content">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="department-header">

          <div>

            <h1>
              Department Management
            </h1>

            <p>
              Manage departments and department information
            </p>

          </div>


          <button
            className="add-department-btn"
            onClick={openAddModal}
            type="button"
          >

            <FaPlus />

            <span>
              Add Department
            </span>

          </button>

        </div>


        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="department-toolbar">


          {/* SEARCH */}

          <div className="department-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search department..."
              value={search}
              onChange={handleSearchChange}
            />


            {search && (

              <button
                type="button"
                className="clear-search"
                onClick={() => {

                  setSearch("");
                  setCurrentPage(1);

                }}
              >

                <FaTimes />

              </button>

            )}

          </div>


          {/* STATUS FILTER */}

          <select
            className="department-status-filter"
            value={statusFilter}
            onChange={
              handleStatusFilterChange
            }
          >

            <option value="all">
              All
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

          </select>


          {/* COUNT */}

          <div className="department-count">

            Total:{" "}

            <strong>
              {filteredDepartments.length}
            </strong>

          </div>

        </div>


        {/* =================================================
            TABLE CARD
        ================================================= */}

        <div className="department-table-card">


          {/* LOADING */}

          {loading ? (

            <div className="department-loading">

              Loading departments...

            </div>


          ) : filteredDepartments.length === 0 ? (

            /* EMPTY */

            <div className="department-empty">

              <FaSearch />

              <h3>
                No departments found
              </h3>

              <p>

                {search ||
                statusFilter !== "all"

                  ? "Try changing your search or filter."

                  : "Add a department to get started."

                }

              </p>

            </div>


          ) : (

            <>

              {/* TABLE */}

              <div className="department-table-wrapper">

                <table className="department-table">

                  <thead>

                    <tr>

                      <th>
                        S.No
                      </th>

                      <th>
                        Department ID
                      </th>

                      <th>
                        Department Name
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Created By
                      </th>

                      <th>
                        Created At
                      </th>

                      <th>
                        Updated By
                      </th>

                      <th>
                        Updated At
                      </th>

                      <th>
                        Deleted At
                      </th>

                      <th>
                        Actions
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {currentDepartments.map(
                      (department, index) => (

                        <tr
                          key={
                            department.id
                          }
                        >

                          {/* NUMBER */}

                          <td
                            data-label="#"
                          >

                            {startIndex +
                              index +
                              1}

                          </td>


                          {/* DEPARTMENT ID */}

                          <td
                            data-label="Department ID"
                          >

                            <strong>
                              {department.depId ||
                                "-"}
                            </strong>

                          </td>


                          {/* NAME */}

                          <td
                            data-label="Department Name"
                          >

                            {department.name ||
                              "-"}

                          </td>


                          {/* STATUS */}

                          <td
                            data-label="Status"
                          >

                            <span
                              className={
                                getStatusClass(
                                  department.status
                                )
                              }
                            >

                              {
                                normalizeStatus(
                                  department.status
                                )
                              }

                            </span>

                          </td>


                          {/* CREATED BY */}

                          <td
                            data-label="Created By"
                          >

                            {
                              department.createdBy ||
                              "-"
                            }

                          </td>


                          {/* CREATED AT */}

                          <td
                            data-label="Created At"
                          >

                            {
                              formatDate(
                                department.createdAt
                              )
                            }

                          </td>


                          {/* UPDATED BY */}

                          <td
                            data-label="Updated By"
                          >

                            {
                              department.updatedBy ||
                              "-"
                            }

                          </td>


                          {/* UPDATED AT */}

                          <td
                            data-label="Updated At"
                          >

                            {
                              formatDate(
                                department.updatedAt
                              )
                            }

                          </td>


                          {/* DELETED AT */}

                          <td
                            data-label="Deleted At"
                          >

                            {
                              formatDate(
                                department.deletedAt
                              )
                            }

                          </td>


                          {/* ACTIONS */}

                          <td
                            data-label="Actions"
                          >

                            <div className="department-actions">


                              {/* EDIT */}

                              <button
                                type="button"
                                className="edit-btn"
                                title="Edit Department"
                                onClick={() =>
                                  openEditModal(
                                    department
                                  )
                                }
                              >

                                <FaEdit />

                              </button>


                              {/* DELETE */}

                              <button
                                type="button"
                                className="delete-btn"
                                title={
                                  normalizeStatus(
                                    department.status
                                  ) === "inactive"

                                    ? "Already inactive"

                                    : "Deactivate Department"
                                }
                                disabled={
                                  normalizeStatus(
                                    department.status
                                  ) === "inactive"
                                }
                                onClick={() =>
                                  handleDelete(
                                    department.id
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


              {/* =================================================
                  PAGINATION
              ================================================= */}

              <div className="department-pagination">

                <div className="pagination-info">

                  Showing{" "}

                  <strong>
                    {startIndex + 1}
                  </strong>

                  {" - "}

                  <strong>
                    {Math.min(
                      startIndex +
                        itemsPerPage,
                      filteredDepartments.length
                    )}
                  </strong>

                  {" of "}

                  <strong>
                    {filteredDepartments.length}
                  </strong>

                </div>


                <div className="pagination-buttons">


                  {/* PREVIOUS */}

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
                    title="Previous"
                  >

                    <FaChevronLeft />

                  </button>


                  {/* PAGE NUMBERS */}

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


                  {/* NEXT */}

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
                    title="Next"
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
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (

        <div
          className="department-modal-overlay"
          onMouseDown={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {

              closeModal();

            }

          }}
        >

          <div className="department-modal">


            {/* MODAL HEADER */}

            <div className="department-modal-header">

              <div>

                <h2>

                  {editId !== null

                    ? "Edit Department"

                    : "Add Department"

                  }

                </h2>

                <p>

                  {editId !== null

                    ? "Update department details"

                    : "Create a new department"

                  }

                </p>

              </div>


              <button
                type="button"
                className="modal-close-btn"
                onClick={closeModal}
                disabled={saving}
                title="Close"
              >

                <FaTimes />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="department-form"
            >


              {/* DEPARTMENT ID */}

              <div className="form-field">

                <label>

                  Department ID

                  <span>
                    *
                  </span>

                </label>


                <input
                  type="text"
                  name="depId"
                  placeholder="Example: DEP001"
                  value={
                    formData.depId
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    saving
                  }
                  maxLength={50}
                  required
                />

              </div>


              {/* DEPARTMENT NAME */}

              <div className="form-field">

                <label>

                  Department Name

                  <span>
                    *
                  </span>

                </label>


                <input
                  type="text"
                  name="name"
                  placeholder="Example: Human Resources"
                  value={
                    formData.name
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


              {/* STATUS */}

              <div className="form-field">

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


              {/* BUTTONS */}

              <div className="department-form-actions">

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

                    ? "Update Department"

                    : "Create Department"

                  }

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =================================================
          TOAST
      ================================================= */}

      {toast.show && (

        <div
          className={
            `department-toast ${toast.type}`
          }
        >

          {toast.message}

        </div>

      )}

    </div>

  );

}


export default Department;