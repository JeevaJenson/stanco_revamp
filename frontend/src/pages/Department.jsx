import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaEllipsisV,
  FaArrowLeft} from "react-icons/fa";

import api from "../services/api";
import Sidebar from "./Sidebar";
import "../style/Department.css";
import DepartmentVertical from "./DepartmentVertical";
import { useNavigate } from "react-router-dom";

function Department() {

  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("a-z");

  const ITEMS_PER_PAGE = 9;

  const [selectedDepartment, setSelectedDepartment] =
    useState(null);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: ""
  });

  const [activeActionMenu, setActiveActionMenu] =
    useState(null);

  const [formData, setFormData] = useState({
    depId: "",
    name: "",
    verticalId: "",
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
  // GET DEPARTMENTS
  // =====================================================

  const fetchDepartments = async () => {

    try {

      setLoading(true);

      const response = await api.get("/departments");

      console.log(
        "Department response:",
        response.data
      );

      setDepartments(response.data || []);

    } catch (error) {

      console.error(
        "Department fetch error:",
        error
      );

      showToast(
        "error",
        error.response?.data?.message ||
        "Failed to load departments"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // =====================================================
  // SEARCH PAGE RESET
  // =====================================================

  useEffect(() => {
    setPage(1);
  }, [search]);

  // =====================================================
  // CLOSE ACTION MENU
  // =====================================================

  useEffect(() => {

    const closeMenu = () => {
      setActiveActionMenu(null);
    };

    window.addEventListener(
      "click",
      closeMenu
    );

    return () => {
      window.removeEventListener(
        "click",
        closeMenu
      );
    };

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
  // ADD MODAL
  // =====================================================

  const openAddModal = () => {

    setEditId(null);

    setFormData({
      depId: "",
      name: "",
      verticalId: "",
      status: "active"
    });

    setShowModal(true);
  };

  // =====================================================
  // EDIT MODAL
  // =====================================================

  const openEditModal = (department) => {

    setEditId(department.id);

    setFormData({
      depId: department.depId || "",
      name: department.name || "",
      verticalId: "",
      status: department.status || "active"
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
      verticalId: "",
      status: "active"
    });

  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (e) => {

  e.preventDefault();

  if (!formData.depId.trim()) {

    showToast(
      "error",
      "Department ID is required"
    );

    return;
  }

  if (!formData.name.trim()) {

    showToast(
      "error",
      "Department name is required"
    );

    return;
  }

  // Vertical required ONLY for CREATE
  if (!editId && !formData.verticalId) {

    showToast(
      "error",
      "Vertical is required"
    );

    return;
  }

  try {

    setSaving(true);

    const requestData = {

      depId: formData.depId.trim(),

      name: formData.name.trim(),

      status: formData.status

    };

    // CREATE only
    if (!editId) {

      requestData.verticalId =
        Number(formData.verticalId);

    }

    console.log(
      "Department request:",
      requestData
    );

    if (editId) {

      await api.put(
        `/departments/${editId}`,
        requestData
      );

      showToast(
        "success",
        "Department updated successfully"
      );

    } else {

      await api.post(
        "/departments",
        requestData
      );

      showToast(
        "success",
        "Department created successfully"
      );
    }

    closeModal();

    await fetchDepartments();

  } catch (error) {

    console.error(
      "Department save error:",
      error
    );

    console.error(
      "Backend response:",
      error.response?.data
    );

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
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this department?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await api.delete(
        `/departments/${id}`
      );

      showToast(
        "success",
        "Department deleted successfully"
      );

      fetchDepartments();

    } catch (error) {

      console.error(
        "Department delete error:",
        error
      );

      showToast(
        "error",
        error.response?.data?.message ||
        "Failed to delete department"
      );

    }

  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredDepartments =
    departments.filter(
      (department) => {

        const searchValue =
          search.toLowerCase();

        return (

          department.depId
            ?.toLowerCase()
            .includes(searchValue)

          ||

          department.name
            ?.toLowerCase()
            .includes(searchValue)

          ||

          department.status
            ?.toLowerCase()
            .includes(searchValue)

        );

      }
    );

  // =====================================================
  // SORT
  // =====================================================

  const sortedDepartments =
    [...filteredDepartments].sort(
      (a, b) => {

        switch (sort) {

          case "a-z":

            return (
              a.name || ""
            ).localeCompare(
              b.name || ""
            );

          case "z-a":

            return (
              b.name || ""
            ).localeCompare(
              a.name || ""
            );

          case "newest":

            return b.id - a.id;

          case "oldest":

            return a.id - b.id;

          default:

            return 0;

        }

      }
    );

  // =====================================================
  // PAGINATION
  // =====================================================

  const currentDepartments =
    sortedDepartments.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
    );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        sortedDepartments.length /
        ITEMS_PER_PAGE
      )
    );

  const startIndex =
    sortedDepartments.length === 0
      ? 0
      : (page - 1) *
          ITEMS_PER_PAGE +
        1;

  const endIndex =
    Math.min(
      page * ITEMS_PER_PAGE,
      sortedDepartments.length
    );

  // =====================================================
  // SHOW VERTICAL PAGE
  // =====================================================

  if (selectedDepartment) {

    return (
      <DepartmentVertical
        department={selectedDepartment}
        onBack={() => {

          setSelectedDepartment(null);

          fetchDepartments();

        }}
      />
    );

  }

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="department-layout">

      <Sidebar />

      <div className="department-content">

        {/* HEADER */}
        <header className="page-header">

          <div className="header-title">
            <h2>Department Management</h2>
            <p>Manage departments and department information</p>
          </div>

          <div className="header-actions">
            <button
              className="add-department-btn"
              onClick={openAddModal}
            >
              <FaPlus />
              <span>Add Department</span>
            </button>
          </div>

        </header>

        {/* TABLE CARD */}

        <div className="department-table-card">

          {/* TOOLBAR */}

          <div className="table-header-toolbar">

            <div className="table-title">

              <h3>
                Registered Departments
              </h3>

              <span>

                Total:{" "}

                <strong>
                  {filteredDepartments.length}
                </strong>{" "}

                records

              </span>

            </div>

            <div className="toolbar-actions">

              <div className="search-wrapper">

                <FaSearch
                  className="search-icon"
                />

                <input
                  type="text"
                  placeholder="Search departments..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

                {search && (

                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() =>
                      setSearch("")
                    }
                  >
                    ×
                  </button>

                )}

              </div>

              <select
                className="sort-select-dropdown"
                value={sort}
                onChange={(e) =>
                  setSort(
                    e.target.value
                  )
                }
              >

                <option value="a-z">
                  Sort A-Z
                </option>

                <option value="z-a">
                  Sort Z-A
                </option>

                <option value="newest">
                  Newest
                </option>

                <option value="oldest">
                  Oldest
                </option>

              </select>

            </div>

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="department-loading">
              Loading departments...
            </div>

          ) : filteredDepartments.length === 0 ? (

            <div className="department-empty">

              <h3>
                No departments found
              </h3>

              <p>
                Add a department to
                get started.
              </p>

            </div>

          ) : (

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
                      Vertical Count
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Created By
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

                        <td>
                          {(page - 1) *
                            ITEMS_PER_PAGE +
                            index +
                            1}
                        </td>

                        <td>

                          <strong>
                            {department.depId}
                          </strong>

                        </td>

                        {/* CLICK DEPARTMENT NAME */}

                       <td>
  <button
    type="button"
    className="department-name-link"
    onClick={() =>
      navigate("/departments/vertical", {
        state: {
          department: department
        }
      })
    }
  >
    {department.name}
  </button>
</td>

                        {/* VERTICAL COUNT */}

                        <td>

                          <span className="vertical-count-badge">

                            {department.verticalCount ??
                              0}

                          </span>

                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={
                              department.status ===
                              "active"

                                ? "status-badge active"

                                : "status-badge inactive"
                            }
                          >

                            {department.status?.toUpperCase()}

                          </span>

                        </td>

                        <td>

                          {department.createdBy ||
                            "-"}

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div
                            className="table-actions-wrapper"
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                          >

                            <button
                              type="button"
                              className="btn-dots-action"
                              onClick={() =>
                                setActiveActionMenu(
                                  activeActionMenu ===
                                    `dept-${department.id}`
                                    ? null
                                    : `dept-${department.id}`
                                )
                              }
                            >

                              <FaEllipsisV />

                            </button>

                            {activeActionMenu ===
                              `dept-${department.id}` && (

                              <div className="action-dropdown-menu table-menu">

                                <button
                                  type="button"
                                  className="action-menu-item"
                                  onClick={() => {

                                    openEditModal(
                                      department
                                    );

                                    setActiveActionMenu(
                                      null
                                    );

                                  }}
                                >

                                  <FaEdit />

                                  Update

                                </button>

                                <button
                                  type="button"
                                  className="action-menu-item delete"
                                  onClick={() => {

                                    handleDelete(
                                      department.id
                                    );

                                    setActiveActionMenu(
                                      null
                                    );

                                  }}
                                >

                                  <FaTrash />

                                  Delete

                                </button>

                              </div>

                            )}

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

          {/* PAGINATION */}

          {filteredDepartments.length > 0 && (

            <div className="department-pagination">

              <span className="pagination-info">

                Showing{" "}

                <strong>
                  {startIndex}
                </strong>

                {" "}to{" "}

                <strong>
                  {endIndex}
                </strong>

                {" "}of{" "}

                <strong>
                  {filteredDepartments.length}
                </strong>

                {" "}records

              </span>

              <div className="pagination-buttons">

                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() =>
                    setPage(
                      (p) =>
                        Math.max(
                          p - 1,
                          1
                        )
                    )
                  }
                >
                  &lt; Previous
                </button>

                {Array.from(
                  {
                    length: totalPages
                  },
                  (_, i) =>
                    i + 1
                ).map((p) => (

                  <button
                    key={p}
                    type="button"
                    className={
                      page === p
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setPage(p)
                    }
                  >

                    {p}

                  </button>

                ))}

                <button
                  type="button"
                  disabled={
                    page === totalPages
                  }
                  onClick={() =>
                    setPage(
                      (p) =>
                        Math.min(
                          p + 1,
                          totalPages
                        )
                    )
                  }
                >
                  Next &gt;
                </button>

              </div>

            </div>

          )}

        </div>

      </div>

      {/* ADD / EDIT DEPARTMENT MODAL */}

      {showModal && (

        <div className="department-modal-overlay">

          <div className="department-modal">

            <div className="department-modal-header">

              <div>

                <h2>

                  {editId
                    ? "Edit Department"
                    : "Add Department"}

                </h2>

                <p>

                  {editId
                    ? "Update department details"
                    : "Create a new department"}

                </p>

              </div>

              <button
                className="modal-close-btn"
                onClick={closeModal}
                disabled={saving}
              >

                <FaTimes />

              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="department-form"
            >

              {/* DEPARTMENT ID */}

              <div className="form-field">

                <label>

                  Department ID
                  <span>*</span>

                </label>

                <input
                  type="text"
                  name="depId"
                  placeholder="Example: DEP001"
                  value={formData.depId}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />

              </div>

              {/* NAME */}

              <div className="form-field">

                <label>

                  Department Name
                  <span>*</span>

                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Example: Human Resources"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={saving}
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
                  value={formData.status}
                  onChange={handleChange}
                  disabled={saving}
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
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving}
                >

                  {saving
                    ? "Saving..."
                    : editId
                      ? "Update Department"
                      : "Create Department"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* TOAST */}

      {toast.show && (

        <div
          className={`department-toast ${toast.type}`}
        >
          {toast.message}
        </div>

      )}

    </div>

  );
}

export default Department;