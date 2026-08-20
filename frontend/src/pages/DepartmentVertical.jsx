import React, { useEffect, useState } from "react";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSearch,
  FaEllipsisV,
  FaArrowLeft
} from "react-icons/fa";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import api from "../services/api";
import Sidebar from "./Sidebar";

import "../style/Department.css";


function DepartmentVertical() {

  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // SELECTED DEPARTMENT
  // =====================================================

  const department =
    location.state?.department;


  // =====================================================
  // STATES
  // =====================================================

  const [verticals, setVerticals] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  // SAME SORT STYLE AS BUSINESS UNIT
  const [sort, setSort] =
    useState("a-z");

  const [activeActionMenu, setActiveActionMenu] =
    useState(null);

  const [toast, setToast] =
    useState(null);

  const [formData, setFormData] = useState({
    verticalName: "",
    status: "active"
  });


  // =====================================================
  // CLOSE ACTION MENU
  // =====================================================

  useEffect(() => {

    const closeMenu = () =>
      setActiveActionMenu(null);

    window.addEventListener(
      "click",
      closeMenu
    );

    return () =>
      window.removeEventListener(
        "click",
        closeMenu
      );

  }, []);


  // =====================================================
  // TOAST
  // =====================================================

  const showToast = (
    type,
    message
  ) => {

    setToast({
      type,
      message
    });

    setTimeout(() => {

      setToast(null);

    }, 3000);

  };


  // =====================================================
  // GET DEPARTMENT VERTICALS
  // =====================================================

  const fetchVerticals = async () => {

    if (!department?.id) {
      return;
    }

    try {

      setLoading(true);

      const response =
        await api.get(
          `/departments/${department.id}/verticals`
        );

      console.log(
        "Department Verticals:",
        response.data
      );

      setVerticals(
        response.data || []
      );

    } catch (error) {

      console.error(
        "Vertical fetch error:",
        error
      );

      showToast(
        "error",
        error.response?.data?.message ||
        "Failed to load verticals"
      );

      setVerticals([]);

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchVerticals();

  }, [department?.id]);


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

      verticalName: "",

      status: "active"

    });

    setActiveActionMenu(null);

    setShowModal(true);

  };


  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (vertical) => {

    setEditingId(
      vertical.verticalId
    );

    setFormData({

      verticalName:
        vertical.verticalName || "",

      status:
        vertical.status || "active"

    });

    setActiveActionMenu(null);

    setShowModal(true);

  };


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {

    setShowModal(false);

    setEditingId(null);

    setFormData({

      verticalName: "",

      status: "active"

    });

  };


  // =====================================================
  // ADD / UPDATE VERTICAL
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    const verticalName =
      formData.verticalName.trim();


    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (!verticalName) {

      showToast(
        "error",
        "Vertical name is required"
      );

      return;

    }


    if (!department?.id) {

      showToast(
        "error",
        "Department not selected"
      );

      return;

    }


    try {

      setLoading(true);


      // =================================================
      // UPDATE
      // =================================================

      if (editingId) {

        const payload = {

          verticalName,

          status:
            formData.status

        };


        await api.put(

          `/verticals/${editingId}`,

          payload

        );


        showToast(

          "success",

          "Vertical updated successfully"

        );

      }


      // =================================================
      // CREATE
      // =================================================

      else {

        const payload = {

          verticalName,

          status:
            formData.status ||
            "active"

        };


        // ------------------------------------------------
        // CREATE VERTICAL
        // ------------------------------------------------

        const response =
          await api.post(

            "/verticals",

            payload

          );


        console.log(
          "Created Vertical:",
          response.data
        );


        const newVertical =
          response.data;


        if (!newVertical?.id) {

          throw new Error(
            "Vertical ID was not returned"
          );

        }


        // ------------------------------------------------
        // MAP VERTICAL TO DEPARTMENT
        // ------------------------------------------------

        await api.post(

          `/departments/${department.id}/verticals/${newVertical.id}`

        );


        showToast(

          "success",

          "Vertical added successfully"

        );

      }


      closeModal();

      await fetchVerticals();

    } catch (error) {

      console.error(
        "Vertical save error:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );


      showToast(

        "error",

        error.response?.data?.message ||

        error.response?.data ||

        error.message ||

        "Operation failed"

      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // SOFT DELETE
  // =====================================================

  const handleDelete = async (
    verticalId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this Vertical?"
      );


    if (!confirmed) {

      return;

    }


    try {

      setLoading(true);


      await api.delete(

        `/verticals/${verticalId}`

      );


      showToast(

        "success",

        "Vertical deleted successfully"

      );


      await fetchVerticals();

    } catch (error) {

      console.error(

        "Vertical delete error:",

        error

      );


      showToast(

        "error",

        error.response?.data?.message ||

        error.response?.data ||

        "Failed to delete Vertical"

      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredVerticals =
    verticals.filter(
      (vertical) => {

        const searchText =
          search
            .toLowerCase()
            .trim();


        if (!searchText) {

          return true;

        }


        return (

          vertical.verticalName
            ?.toLowerCase()
            .includes(searchText)

          ||

          String(
            vertical.verticalId || ""
          )
            .toLowerCase()
            .includes(searchText)

          ||

          vertical.status
            ?.toLowerCase()
            .includes(searchText)

        );

      }
    );


  // =====================================================
  // SORT
  // SAME STYLE AS BUSINESS UNIT
  // =====================================================

  const sortedVerticals =
    [...filteredVerticals].sort(
      (a, b) => {

        switch (sort) {

          // ---------------------------------------------
          // A-Z
          // ---------------------------------------------

          case "a-z":

            return (
              a.verticalName || ""
            ).localeCompare(
              b.verticalName || ""
            );


          // ---------------------------------------------
          // Z-A
          // ---------------------------------------------

          case "z-a":

            return (
              b.verticalName || ""
            ).localeCompare(
              a.verticalName || ""
            );


          // ---------------------------------------------
          // NEWEST
          // ---------------------------------------------

          case "newest":

            return (
              Number(
                b.verticalId || 0
              ) -
              Number(
                a.verticalId || 0
              )
            );


          // ---------------------------------------------
          // OLDEST
          // ---------------------------------------------

          case "oldest":

            return (
              Number(
                a.verticalId || 0
              ) -
              Number(
                b.verticalId || 0
              )
            );


          default:

            return 0;

        }

      }
    );


  // =====================================================
  // NO DEPARTMENT
  // =====================================================

  if (!department) {

    return (

      <div className="department-layout">

        <Sidebar />


        <div className="department-content">

          <div className="department-empty">

            <h3>
              Department not selected
            </h3>


            <p>
              Please select a department
              from Department page.
            </p>


            {/* <button
              type="button"
              className="save-btn"
              onClick={() =>
                navigate("/departments")
              }
            >

              Back to Departments

            </button> */}

          </div>

        </div>

      </div>

    );

  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div className="department-layout">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="department-content">


        {/* HEADER */}
        <header className="page-header">

          <div className="header-title">
            <h2>Department Verticals</h2>
            <p>Verticals mapped to <strong>{department.name}</strong></p>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="add-department-btn"
              onClick={openAddModal}
            >
              <FaPlus />
              <span>Add Vertical</span>
            </button>
          </div>

        </header>


        {/* =================================================
            TOAST
        ================================================= */}

        {toast && (

          <div
            className={
              `department-toast ${toast.type}`
            }
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

        <div className="department-table-card">


          {/* =================================================
              TABLE HEADER
          ================================================= */}

          <div className="table-header-toolbar">


            <div className="table-title">

              <h3>

                {department.name}
                {" "} - Verticals

              </h3>


              <span>

                Total:{" "}

                <strong>
                  {sortedVerticals.length}
                </strong>{" "}

                records

              </span>

            </div>


            {/* =================================================
                SEARCH + SORT
            ================================================= */}

            <div className="toolbar-actions">


              {/* SEARCH */}

              <div className="search-wrapper">


                <FaSearch
                  className="search-icon"
                />


                <input
                  type="text"
                  placeholder="Search verticals..."
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


              {/* =================================================
                  EXACT BUSINESS UNIT STYLE SORT
              ================================================= */}

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


          {/* =================================================
              LOADING
          ================================================= */}

          {loading &&
          verticals.length === 0 ? (

            <div className="department-loading">

              Loading verticals...

            </div>

          )


          /* =================================================
             EMPTY
          ================================================= */

          : sortedVerticals.length === 0 ? (

            <div className="department-empty">

              <FaSearch />


              <h3>
                No Verticals found
              </h3>


              <p>

                {search

                  ? "Try a different search term."

                  : "Add a Vertical to get started."

                }

              </p>

            </div>

          )


          /* =================================================
             TABLE
          ================================================= */

          : (

            <div className="department-table-wrapper">


              <table className="department-table">


                <thead>

                  <tr>

                    <th>
                      S.No
                    </th>


    


                    <th>
                      Vertical Name
                    </th>


                    <th>
                      Status
                    </th>


                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>


                  {sortedVerticals.map(

                    (vertical, index) => (

                      <tr
                        key={
                          vertical.id
                        }
                      >


                        {/* S.NO */}

                        <td
                          data-label="S.No"
                        >

                          {index + 1}

                        </td>


                

                

                        {/* VERTICAL NAME */}

                        <td
                          data-label="Vertical Name"
                        >

                          <span
                            className="department-name"
                          >

                            {
                              vertical.verticalName
                            }

                          </span>

                        </td>


                        {/* STATUS */}

                        <td
                          data-label="Status"
                        >

                          <span
                            className={
                              `status-badge ${
                                vertical.status
                                  ?.toLowerCase() ===
                                "active"
                                  ? "active"
                                  : "inactive"
                              }`
                            }
                          >

                            {
                              vertical.status
                                ?.toUpperCase()
                            }

                          </span>

                        </td>


                        {/* =================================================
                            ACTION
                        ================================================= */}

                        <td
                          data-label="Actions"
                        >


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
                                  `vertical-${vertical.verticalId}`

                                    ? null

                                    : `vertical-${vertical.verticalId}`

                                )
                              }
                            >

                              <FaEllipsisV />

                            </button>


                            {activeActionMenu ===
                              `vertical-${vertical.verticalId}` && (

                              <div
                                className="action-dropdown-menu table-menu"
                              >


                                {/* UPDATE */}

                                <button
                                  type="button"
                                  className="action-menu-item"
                                  onClick={() => {

                                    openEditModal(
                                      vertical
                                    );

                                    setActiveActionMenu(
                                      null
                                    );

                                  }}
                                >

                                  <FaEdit />

                                  Update

                                </button>


                                {/* DELETE */}

                                <button
                                  type="button"
                                  className="action-menu-item delete"
                                  onClick={() => {

                                    setActiveActionMenu(
                                      null
                                    );

                                    handleDelete(
                                      vertical.verticalId
                                    );

                                  }}
                                  style={{
                                    color:
                                      "#dc2626"
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


        </div>


      </div>


      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showModal && (

        <div
          className="department-modal-overlay"
          onClick={(e) => {

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

            <div
              className="department-modal-header"
            >

              <div>

                <h2>

                  {editingId

                    ? "Edit Vertical"

                    : "Add Vertical"

                  }

                </h2>


                <p>

                  {editingId

                    ? "Update vertical details"

                    : `Add vertical to ${department.name}`

                  }

                </p>

              </div>


              <button
                type="button"
                className="modal-close-btn"
                onClick={closeModal}
                disabled={loading}
              >

                <FaTimes />

              </button>

            </div>


            {/* FORM */}

            <form
              className="department-form"
              onSubmit={handleSubmit}
            >


              {/* VERTICAL NAME */}

              <div className="form-field">


                <label>

                  Vertical Name

                  <span>
                    *
                  </span>

                </label>


                <input
                  type="text"
                  name="verticalName"
                  placeholder="Enter vertical name"
                  value={
                    formData.verticalName
                  }
                  onChange={
                    handleChange
                  }
                  disabled={loading}
                  required
                  autoFocus
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
                  disabled={loading}
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

              <div
                className="department-form-actions"
              >


                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
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

                      : "Save"

                  }

                </button>


              </div>


            </form>


          </div>


        </div>

      )}


    </div>

  );

}


export default DepartmentVertical;