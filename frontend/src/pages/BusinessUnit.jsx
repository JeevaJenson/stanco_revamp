import React, { useEffect, useState } from "react";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSearch,
  FaSyncAlt,
  FaEllipsisV
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
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("a-z");
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    setPage(1);
  }, [search]);

  const [activeActionMenu, setActiveActionMenu] = useState(null);

  useEffect(() => {
    const closeMenu = () => setActiveActionMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

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

  const sortedBusinessUnits = [...filteredBusinessUnits].sort((a, b) => {
    switch (sort) {
      case "a-z":
        return (a.businessName || "").localeCompare(b.businessName || "");
      case "z-a":
        return (b.businessName || "").localeCompare(a.businessName || "");
      case "newest":
        return b.id - a.id;
      case "oldest":
        return a.id - b.id;
      default:
        return 0;
    }
  });

  const currentBusinessUnits = sortedBusinessUnits.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.max(
    1,
    Math.ceil(sortedBusinessUnits.length / ITEMS_PER_PAGE)
  );

  const startIndex = sortedBusinessUnits.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(page * ITEMS_PER_PAGE, sortedBusinessUnits.length);


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


        {/* HEADER */}
        <header className="page-header">

          <div className="header-title">
            <h2>Business Unit</h2>
            <p>Manage your business units</p>
          </div>

          <div className="header-actions">
            <button
              className="add-business-btn"
              onClick={openAddModal}
            >
              <FaPlus />
              <span>Add Business Unit</span>
            </button>
          </div>

        </header>


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

          <div className="table-header-toolbar">

            <div className="table-title">
              <h3>Business Units</h3>

              <span>
                Total: <strong>{filteredBusinessUnits.length}</strong> records
              </span>
            </div>

            <div className="toolbar-actions">

              <div className="search-wrapper">

                <FaSearch className="search-icon" />

                <input
                  type="text"
                  placeholder="Search business units..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {search && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => setSearch("")}
                  >
                    ×
                  </button>
                )}

              </div>

              <select
                className="sort-select-dropdown"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="a-z">Sort A-Z</option>
                <option value="z-a">Sort Z-A</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>

          

            </div>

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
                          Actions
                        </th>

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


                            {/* S.NO */}

                            <td data-label="S.No">

                              {(page - 1) * ITEMS_PER_PAGE + index + 1}

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

                                {business.status?.toUpperCase()}

                              </span>

                            </td>


                            {/* CREATED BY */}

                            <td data-label="Created By">

                              {business.createdBy ||
                                "-"}

                            </td>


                           


                             {/* ACTIONS */}

                             <td data-label="Actions">

                               <div className="table-actions-wrapper" onClick={(e) => e.stopPropagation()}>
                                 <button
                                   type="button"
                                   className="btn-dots-action"
                                   onClick={() =>
                                     setActiveActionMenu(
                                       activeActionMenu === `bu-${business.id}`
                                         ? null
                                         : `bu-${business.id}`
                                     )
                                   }
                                 >
                                   <FaEllipsisV />
                                 </button>

                                 {activeActionMenu === `bu-${business.id}` && (
                                   <div className="action-dropdown-menu table-menu">
                                     <button
                                       type="button"
                                       className="action-menu-item"
                                       onClick={() => {
                                         openEditModal(business);
                                         setActiveActionMenu(null);
                                       }}
                                     >
                                       <FaEdit /> Update
                                     </button>
                                     <button
                                       type="button"
                                       className="action-menu-item delete"
                                       onClick={() => {
                                         handleDelete(business.id);
                                         setActiveActionMenu(null);
                                       }}
                                       style={{ color: "#dc2626" }}
                                     >
                                       <FaTrash /> Delete
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

              {filteredBusinessUnits.length > 0 && (
                <div className="business-pagination">

                  <span className="pagination-info">
                    Showing <strong>{startIndex}</strong> to{" "}
                    <strong>{endIndex}</strong> of{" "}
                    <strong>{filteredBusinessUnits.length}</strong> records
                  </span>

                  <div className="pagination-buttons">
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    >
                      &lt; Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={page === p ? "active" : ""}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    >
                      Next &gt;
                    </button>
                  </div>

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