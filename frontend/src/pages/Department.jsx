import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from "react-icons/fa";
import api from "../services/api";
import Sidebar from "./Sidebar";
import "../style/Department.css";

function Department() {
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    depId: "",
    name: "",
    status: "active",
  });

  // =====================================================
  // TOAST
  // =====================================================

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
    }, 3000);
  };

  // =====================================================
  // GET ALL DEPARTMENTS
  // =====================================================

  const fetchDepartments = async () => {
    try {
      setLoading(true);

      const response = await api.get("/departments");

      console.log("Department response:", response.data);

      setDepartments(response.data || []);
    } catch (error) {
      console.error("Department fetch error:", error);

      if (error.response?.status === 403) {
        showToast(
          "error",
          "You don't have permission to access departments"
        );
      } else {
        showToast(
          "error",
          error.response?.data?.message ||
          "Failed to load departments"
        );
      }
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
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
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
      status: "active",
    });

    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (department) => {
    setEditId(department.id);

    setFormData({
      depId: department.depId || "",
      name: department.name || "",
      status: department.status || "active",
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
      status: "active",
    });
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.depId.trim()) {
      showToast("error", "Department ID is required");
      return;
    }

    if (!formData.name.trim()) {
      showToast("error", "Department name is required");
      return;
    }

    try {
      setSaving(true);

      const requestData = {
        depId: formData.depId.trim(),
        name: formData.name.trim(),
        status: formData.status,
      };

      // ============================
      // UPDATE
      // ============================

      if (editId) {
        const response = await api.put(
          `/departments/${editId}`,
          requestData
        );

        console.log("Department updated:", response.data);

        showToast(
          "success",
          "Department updated successfully"
        );
      }

      // ============================
      // CREATE
      // ============================

      else {
        const response = await api.post(
          "/departments",
          requestData
        );

        console.log("Department created:", response.data);

        showToast(
          "success",
          "Department created successfully"
        );
      }

      closeModal();

      fetchDepartments();

    } catch (error) {
      console.error("Department save error:", error);

      if (error.response?.status === 403) {
        showToast(
          "error",
          "You don't have permission to perform this action"
        );
      } else {
        showToast(
          "error",
          error.response?.data?.message ||
          "Failed to save department"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/departments/${id}`);

      showToast(
        "success",
        "Department deleted successfully"
      );

      fetchDepartments();

    } catch (error) {
      console.error("Department delete error:", error);

      if (error.response?.status === 403) {
        showToast(
          "error",
          "You don't have permission to delete departments"
        );
      } else {
        showToast(
          "error",
          error.response?.data?.message ||
          "Failed to delete department"
        );
      }
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredDepartments = departments.filter(
    (department) => {
      const searchValue = search.toLowerCase();

      return (
        department.depId
          ?.toLowerCase()
          .includes(searchValue) ||
        department.name
          ?.toLowerCase()
          .includes(searchValue) ||
        department.status
          ?.toLowerCase()
          .includes(searchValue)
      );
    }
  );

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="department-layout">

      <Sidebar />

      <div className="department-content">

        {/* ============================================
            HEADER
        ============================================ */}

        <div className="department-header">

          <div>
            <h1>Department Management</h1>

            <p>
              Manage departments and department information
            </p>
          </div>

          <button
            className="add-department-btn"
            onClick={openAddModal}
          >
            <FaPlus />

            <span>
              Add Department
            </span>
          </button>

        </div>

        {/* ============================================
            SEARCH
        ============================================ */}

        <div className="department-toolbar">

          <div className="department-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search department..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="department-count">
            Total: <strong>{filteredDepartments.length}</strong>
          </div>

        </div>

        {/* ============================================
            TABLE
        ============================================ */}

        <div className="department-table-card">

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
                Add a department to get started.
              </p>

            </div>

          ) : (

            <div className="department-table-wrapper">

              <table className="department-table">

                <thead>

                  <tr>
                    <th>S.No</th>
                    <th>Department ID</th>
                    <th>Department Name</th>
                    <th>Status</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredDepartments.map(
                    (department, index) => (

                      <tr key={department.id}>

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          <strong>
                            {department.depId}
                          </strong>
                        </td>

                        <td>
                          {department.name}
                        </td>

                        <td>

                          <span
                            className={
                              department.status ===
                                "active"
                                ? "status-badge active"
                                : "status-badge inactive"
                            }
                          >
                            {department.status}
                          </span>

                        </td>

                        <td>
                          {department.createdBy || "-"}
                        </td>

                    
                        <td>

                          <div className="department-actions">

                            <button
                              className="edit-btn"
                              title="Edit"
                              onClick={() =>
                                openEditModal(
                                  department
                                )
                              }
                            >
                              <FaEdit />
                            </button>

                            <button
                              className="delete-btn"
                              title="Delete"
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

          )}

        </div>

      </div>

      {/* ================================================
          ADD / EDIT MODAL
      ================================================= */}

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

              {/* Department ID */}

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

              {/* Department Name */}

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

              {/* Status */}

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

              {/* Buttons */}

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

      {/* ================================================
          TOAST
      ================================================= */}

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