import React, { useEffect, useState } from "react";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSearch,
  FaSyncAlt
} from "react-icons/fa";

import api from "../services/api";
import Sidebar from "./Sidebar";

import "../style/BusinessUnit.css";


function BusinessUnit() {

  // =====================================================
  // STATE
  // =====================================================

  const [businessUnits, setBusinessUnits] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [toast, setToast] = useState(null);


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
      type,
      message
    });

    setTimeout(() => {

      setToast(null);

    }, 3000);
  };


  // =====================================================
  // GET ALL BUSINESS UNITS
  // =====================================================

  const fetchBusinessUnits = async () => {

    try {

      setLoading(true);

      const response =
        await api.get("/business-masters");

      console.log(
        "Business Units:",
        response.data
      );

      setBusinessUnits(
        response.data || []
      );

    } catch (error) {

      console.error(
        "Business Unit fetch error:",
        error
      );

      showToast(
        "error",
        error.response?.data?.message ||
        "Failed to load business units"
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

    setFormData((prev) => ({

      ...prev,

      [name]: value

    }));
  };


  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const openAddModal = () => {

    setEditingId(null);

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

    setEditingId(
      business.id
    );

    setFormData({

      buId:
        business.buId || "",

      businessName:
        business.businessName || "",

      status:
        business.status || "active"

    });

    setShowModal(true);
  };


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {

    setShowModal(false);

    setEditingId(null);

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


    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!formData.businessName.trim()) {

      showToast(
        "error",
        "Business name is required"
      );

      return;
    }


    try {

      setLoading(true);


      const payload = {

        buId:
          formData.buId.trim()
            ? formData.buId.trim()
            : null,

        businessName:
          formData.businessName.trim(),

        status:
          formData.status

      };


      // =================================================
      // UPDATE
      // =================================================

      if (editingId) {

        await api.put(

          `/business-masters/${editingId}`,

          payload

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

        await api.post(

          "/business-masters",

          payload

        );


        showToast(
          "success",
          "Business Unit created successfully"
        );
      }


      closeModal();


      await fetchBusinessUnits();


    } catch (error) {

      console.error(
        "Business Unit save error:",
        error
      );


      showToast(

        "error",

        error.response?.data?.message ||
        "Operation failed"

      );

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this Business Unit?"
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
        "Business Unit deleted successfully"
      );


      await fetchBusinessUnits();


    } catch (error) {

      console.error(
        "Business Unit delete error:",
        error
      );


      showToast(

        "error",

        error.response?.data?.message ||
        "Failed to delete Business Unit"

      );

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredBusinessUnits =
    businessUnits.filter(
      (business) => {

        const searchText =
          search.toLowerCase().trim();


        if (!searchText) {

          return true;
        }


        return (

          business.buId
            ?.toLowerCase()
            .includes(searchText)

          ||

          business.businessName
            ?.toLowerCase()
            .includes(searchText)

          ||

          business.status
            ?.toLowerCase()
            .includes(searchText)

          ||

          business.createdBy
            ?.toLowerCase()
            .includes(searchText)

        );
      }
    );


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
        "en-IN"
      );

    } catch {

      return "-";
    }
  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="business-page">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="business-content">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="business-header">

          <div>

            <h2>
              Business Unit
            </h2>

            <p>
              Manage your business units
            </p>

          </div>


          <button
            className="add-business-btn"
            onClick={openAddModal}
          >

            <FaPlus />

            <span>
              Add Business Unit
            </span>

          </button>

        </div>


        {/* =================================================
            TOAST
        ================================================= */}

        {toast && (

          <div
            className={`business-toast ${toast.type}`}
          >

            <span>
              {toast.message}
            </span>


            <button
              type="button"
              onClick={() =>
                setToast(null)
              }
            >

              <FaTimes />

            </button>

          </div>

        )}


        {/* =================================================
            TABLE CARD
        ================================================= */}

        <div className="business-table-card">


          {/* =================================================
              TABLE HEADER
          ================================================= */}

          <div className="table-header">

            <div className="table-title">

              <h3>
                Business Units
              </h3>

              <span>

                {filteredBusinessUnits.length}

                {" "}records

              </span>

            </div>


            {/* SEARCH */}

            <div className="business-search">

              <FaSearch />

              <input
                type="text"
                placeholder="Search business units..."
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
                  className="clear-search"
                  onClick={() =>
                    setSearch("")
                  }
                >

                  <FaTimes />

                </button>

              )}

            </div>


            {/* REFRESH */}

            <button
              type="button"
              className="refresh-btn"
              onClick={
                fetchBusinessUnits
              }
              disabled={loading}
              title="Refresh"
            >

              <FaSyncAlt />

            </button>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {loading &&
            businessUnits.length === 0 ? (

            <div className="business-loading">

              <div className="loading-spinner"></div>

              <span>
                Loading business units...
              </span>

            </div>

          )


            /* =================================================
               EMPTY
            ================================================= */

            : filteredBusinessUnits.length === 0 ? (

              <div className="business-empty">

                <FaSearch />

                <h3>
                  No Business Units found
                </h3>

                <p>

                  {search
                    ? "Try a different search term."
                    : "Add a Business Unit to get started."}

                </p>

              </div>

            )


              /* =================================================
                 TABLE
              ================================================= */

              : (

                <div className="business-table-wrapper">

                  <table className="business-table">


                    <thead>

                      <tr>

                        <th>
                          S.No
                        </th>

                        <th>
                          BU ID
                        </th>

                        <th>
                          Business Name
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
                          Actions
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {filteredBusinessUnits.map(

                        (business, index) => (

                          <tr
                            key={
                              business.id
                            }
                          >


                            {/* S.NO */}

                            <td data-label="S.No">

                              {index + 1}

                            </td>


                            {/* BU ID */}

                            <td data-label="BU ID">

                              <strong>

                                {business.buId ||
                                  "-"}

                              </strong>

                            </td>


                            {/* BUSINESS NAME */}

                            <td data-label="Business Name">

                              <span className="business-name">

                                {business.businessName}

                              </span>

                            </td>


                            {/* STATUS */}

                            <td data-label="Status">

                              <span
                                className={
                                  `status-badge ${business.status
                                    ?.toLowerCase() ===
                                    "active"
                                    ? "active"
                                    : "inactive"
                                  }`
                                }
                              >

                                {business.status}

                              </span>

                            </td>


                            {/* CREATED BY */}

                            <td data-label="Created By">

                              {business.createdBy ||
                                "-"}

                            </td>


                            {/* CREATED AT */}

                            <td data-label="Created At">

                              {formatDate(
                                business.createdAt
                              )}

                            </td>


                            {/* ACTIONS */}

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
                                  title="Delete"
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

              )}

        </div>

      </div>


      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (

        <div
          className="business-modal-overlay"
          onClick={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {

              closeModal();

            }

          }}
        >

          <div className="business-modal">


            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <h3>

                  {editingId
                    ? "Edit Business Unit"
                    : "Add Business Unit"}

                </h3>


                <p>

                  {editingId

                    ? "Update business unit details"

                    : "Enter business unit details"}

                </p>

              </div>


              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
              >

                <FaTimes />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="business-form"
            >


              {/* BU ID */}

              <div className="form-group">

                <label>
                  BU ID
                </label>


                <input
                  type="text"
                  name="buId"
                  value={
                    formData.buId
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter BU ID"
                />

              </div>


              {/* BUSINESS NAME */}

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
                  value={
                    formData.businessName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter business name"
                  required
                />

              </div>


              {/* STATUS */}

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
                >

                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>

                </select>

              </div>


              {/* MODAL BUTTONS */}

              <div className="modal-actions">


                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    closeModal
                  }
                  disabled={loading}
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="save-btn"
                  disabled={loading}
                >

                  {loading

                    ? "Saving..."

                    : editingId

                      ? "Update"

                      : "Save"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}


export default BusinessUnit;