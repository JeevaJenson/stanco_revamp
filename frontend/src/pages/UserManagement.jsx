import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaTrash,
  FaEnvelope,
  FaIdBadge,
  FaBuilding,
  FaUsers,
  FaCheck,
  FaPhoneAlt,
  FaUser,
  FaPlus,
  FaUserFriends,
  FaEllipsisV,
  FaEdit,
  FaTimes,
  FaSave,
  FaSearch,
  FaSortAlphaDown,
  FaSortAlphaUp
} from "react-icons/fa";
import api from "../services/api";
import Sidebar from "./Sidebar";
import "../style/UserManagement.css";

const DB_MOCK_USERS = [
  {
    id: 1,
    empID: "900001",
    name: "admin",
    email: "admin@gmail.com",
    mobileNo: "1234567891",
    department: "HR",
    designation: "Recruiter",
    profileStatus: "Active",
    business: null,
    team: "CKPL"
  },
  {
    id: 2,
    empID: "900002",
    name: "kavi",
    email: "kavi@gmail.com",
    mobileNo: "1234567891",
    department: "CKPL",
    designation: "Developer",
    profileStatus: "Active",
    business: null,
    team: "CKPL"
  },
  {
    id: 3,
    empID: "900003",
    name: "Test User",
    email: "test@gmail.com",
    mobileNo: "9876543210",
    department: "HR",
    designation: "Recruiter",
    profileStatus: "Active",
    business: null,
    team: "CKPL"
  },
  {
    id: 4,
    empID: "as123",
    name: "admin",
    email: "as123@gmail.com",
    mobileNo: "1234567891",
    department: "HR",
    designation: "Recruiter",
    profileStatus: "Active",
    business: null,
    team: "CKPL"
  },
  {
    id: 5,
    empID: "ADMIN001",
    name: "System Administrator",
    email: "admin@stanco.com",
    mobileNo: "9876543210",
    department: "Management",
    designation: "Administrator",
    profileStatus: "Active",
    business: "STANCO",
    team: "STANCO"
  },
  {
    id: 6,
    empID: "ADMIN005",
    name: "test admin",
    email: "admin005@gmail.com",
    mobileNo: "9876543210",
    department: "Admin",
    designation: "Admin",
    profileStatus: "Active",
    business: "STANCO",
    team: "STANCO"
  },
  {
    id: 7,
    empID: "112233",
    name: "hgfd",
    email: "vcx@gmail.com",
    mobileNo: "345678768",
    department: "Admin",
    designation: "Admin",
    profileStatus: "Active",
    business: "STANCO",
    team: "STANCO"
  },
  {
    id: 8,
    empID: "ADMIN12",
    name: "barani",
    email: "barani@gmail.com",
    mobileNo: "345678768",
    department: "Admin",
    designation: "Admin",
    profileStatus: "Active",
    business: "STANCO",
    team: "STANCO"
  },
  {
    id: 9,
    empID: "EMP006",
    name: "senthil",
    email: "senthil@gmail.com",
    mobileNo: "7654345676",
    department: "Admin",
    designation: "Admin",
    profileStatus: "Active",
    business: "STANCO",
    team: "STANCO"
  },
  {
    id: 10,
    empID: "EMP007",
    name: "pavithra",
    email: "pavithra@gmail.com",
    mobileNo: "8765456787",
    department: "Admin",
    designation: "Admin",
    profileStatus: "Active",
    business: "STANCO",
    team: "STANCO"
  }
];

function UserManagement({ initialTab = "users" }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab); // "users" | "teams"
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("a-z"); // "a-z" | "z-a" | "newest" | "oldest"
  const [teamSortBy, setTeamSortBy] = useState("a-z"); // "a-z" | "z-a" | "newest" | "oldest"

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(9);
  const [currentTeamPage, setCurrentTeamPage] = useState(1);
  const [teamsPerPage] = useState(9);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    setCurrentTeamPage(1);
  }, [search]);

  // 3-dot Action Menu dropdown states
  const [openUserMenuId, setOpenUserMenuId] = useState(null);
  const [openTeamMenuId, setOpenTeamMenuId] = useState(null);

  // Edit / Update State
  const [editingUser, setEditingUser] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);

  // Current logged in user & role hierarchy mapping
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const creatorRole = (currentUser.roleType || "").toLowerCase();

  // Role hierarchy mapping matching backend UserServiceImpl
  const getDepartmentOptionsForRole = (role) => {
    switch (role) {
      case "super_admin":
        return [
          { label: "Admin", value: "Admin", roleType: "admin", badge: "Role: Admin" },
        ];
      case "admin":
        return [
          { label: "Hiring Manager", value: "Hiring Manager", roleType: "delivery_lead", badge: "Role: Delivery Lead" },
          { label: "Business Lead", value: "Business Lead", roleType: "line_business_head", badge: "Role: Line Business Head" },
          { label: "Recruiter", value: "Recruiter", roleType: "recruiter", badge: "Role: Recruiter" },
        ];
      case "delivery_lead":
      case "hiring_manager":
        return [
          { label: "Recruiter", value: "Recruiter", roleType: "recruiter", badge: "Role: Recruiter" },
        ];
      case "recruiter":
        return [];
      default:
        return [
          { label: "Admin", value: "Admin", roleType: "admin", badge: "Role: Admin" },
          { label: "Hiring Manager", value: "Hiring Manager", roleType: "delivery_lead", badge: "Role: Delivery Lead" },
          { label: "Business Lead", value: "Business Lead", roleType: "line_business_head", badge: "Role: Line Business Head" },
          { label: "Recruiter", value: "Recruiter", roleType: "recruiter", badge: "Role: Recruiter" },
        ];
    }
  };

  const departmentOptions = getDepartmentOptionsForRole(creatorRole);

  // Teams list data
  const [teams, setTeams] = useState([
    { id: 1, name: "HPEL", code: "TEAM-HPEL", memberCount: 12, status: "Active" },
    { id: 2, name: "CKPL", code: "TEAM-CKPL", memberCount: 8, status: "Active" },
    { id: 3, name: "STANCO", code: "TEAM-STANCO", memberCount: 15, status: "Active" },
    { id: 4, name: "TEST", code: "TEAM-TEST", memberCount: 4, status: "Active" },
  ]);

  // New Team Form State
  const [newTeam, setNewTeam] = useState({
    name: "",
    code: "",
    status: "Active",
  });

  // New User Form State
  const [newUser, setNewUser] = useState({
    empID: "",
    name: "",
    email: "",
    mobileNo: "",
    department: departmentOptions.length > 0 ? departmentOptions[0].value : "",
    team: "",
  });

  useEffect(() => {
    if (departmentOptions.length > 0 && !newUser.department) {
      setNewUser((prev) => ({ ...prev, department: departmentOptions[0].value }));
    }
  }, [creatorRole]);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
      setSearch("");
    }
  }, [initialTab]);

  // Load existing users from backend if available
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("error", "You are not logged in. Please log in first.");
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setUsers(response.data);
        } else {
          setUsers(DB_MOCK_USERS);
        }
      } catch (err) {
        console.warn("Backend /api/users fetch fallback, loading database mock users:", err);
        setUsers(DB_MOCK_USERS);
      }
    };
    fetchUsers();
  }, []);

  const handleToggleSelectUser = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedUserIds.length === 0) return;
    if (window.confirm(`Are you sure you want to remove ${selectedUserIds.length} selected users?`)) {
      setUsers((prev) => prev.filter((u) => !selectedUserIds.includes(u.id || u.empID)));
      setSelectedUserIds([]);
      showToast("success", `${selectedUserIds.length} users removed.`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeamInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeam((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();

    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.department) {
      showToast("error", "Please fill in all required fields (Name, Email, Ph No, Dept).");
      return;
    }

    setLoading(true);

    const generatedEmpId = newUser.empID.trim()
      ? newUser.empID.trim().toUpperCase()
      : `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

    // Determine valid roleType from departmentOptions based on role hierarchy
    const matchedOption = departmentOptions.find((opt) => opt.value === newUser.department);
    const resolvedRole = matchedOption ? matchedOption.roleType : (newUser.department === "Admin" ? "admin" : "delivery_lead");

    const userPayload = {
      empID: generatedEmpId,
      name: newUser.name.trim(),
      email: newUser.email.trim().toLowerCase(),
      mobileNo: newUser.mobileNo.trim() || "9876543210",
      department: newUser.department,
      team: newUser.team || "STANCO",
      designation: newUser.department || "Team Member",
      roleType: resolvedRole,
      password: "Password@123",
      profileStatus: "active",
      business: "STANCO",
    };

    try {
      const response = await api.post("/users", userPayload);
      const added = response.data || { ...userPayload, id: Date.now() };
      setUsers((prev) => [added, ...prev]);

      showToast("success", `User ${newUser.name} added successfully!`);
      setShowForm(false);

      // Reset form
      setNewUser({
        empID: "",
        name: "",
        email: "",
        mobileNo: "",
        department: "",
        team: "",
      });
    } catch (err) {
      console.error("Error creating user:", err);
      const errorMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : "Failed to add user to backend.");
      showToast("error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setOpenUserMenuId(null);
      setOpenTeamMenuId(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleDeleteUser = (id, userName) => {
    if (window.confirm(`Are you sure you want to remove user "${userName}"?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setSelectedUserIds((prev) => prev.filter((userId) => userId !== id));
      showToast("success", `User "${userName}" removed.`);
    }
  };

  // Update User Submit Handler
  const handleUpdateUserSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editingUser.name.trim() || !editingUser.email.trim() || !editingUser.department) {
      showToast("error", "Please fill in all required fields (Name, Email, Ph No, Dept).");
      return;
    }

    try {
      // If API update available
      if (editingUser.id) {
        await api.put(`/users/${editingUser.id}`, editingUser).catch(() => { });
      }
    } catch (err) {
      console.warn("API update fallback to local state:", err);
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id || u.empID === editingUser.empID ? { ...editingUser } : u))
    );

    showToast("success", `User "${editingUser.name}" updated successfully!`);
    setEditingUser(null);
  };

  // Add Team Submit Handler
  const handleAddTeamSubmit = (e) => {
    e.preventDefault();

    if (!newTeam.name.trim()) {
      showToast("error", "Please enter a team name.");
      return;
    }

    const teamNameClean = newTeam.name.trim().toUpperCase();

    // Check duplicate
    if (teams.some((t) => t.name.toUpperCase() === teamNameClean)) {
      showToast("error", `Team "${teamNameClean}" already exists!`);
      return;
    }

    const newTeamObj = {
      id: Date.now(),
      name: teamNameClean,
      status: "Active",
    };

    setTeams((prev) => [newTeamObj, ...prev]);
    showToast("success", `Team "${newTeamObj.name}" added successfully!`);

    setNewTeam({
      name: "",
      code: "",
      status: "Active",
    });
    setShowAddTeamModal(false);
  };

  // Update Team Submit Handler
  const handleUpdateTeamSubmit = (e) => {
    e.preventDefault();
    if (!editingTeam) return;

    if (!editingTeam.name.trim()) {
      showToast("error", "Please enter a team name.");
      return;
    }

    const oldTeamName = teams.find((t) => t.id === editingTeam.id)?.name;
    const updatedTeamObj = {
      ...editingTeam,
      name: editingTeam.name.trim().toUpperCase(),
      code: editingTeam.code ? editingTeam.code.trim().toUpperCase() : `TEAM-${editingTeam.name.trim().toUpperCase()}`,
    };

    setTeams((prev) =>
      prev.map((t) => (t.id === editingTeam.id ? updatedTeamObj : t))
    );

    // Also update any user who was in the old team
    if (oldTeamName && oldTeamName !== updatedTeamObj.name) {
      setUsers((prev) =>
        prev.map((u) => (u.team === oldTeamName ? { ...u, team: updatedTeamObj.name } : u))
      );
    }

    showToast("success", `Team "${updatedTeamObj.name}" updated successfully!`);
    setEditingTeam(null);
  };

  const handleDeleteTeam = (id, teamName) => {
    if (window.confirm(`Are you sure you want to delete team "${teamName}"?`)) {
      setTeams((prev) => prev.filter((t) => t.id !== id));
      showToast("success", `Team "${teamName}" removed.`);
    }
  };

  const getAvatarColor = (name = "U") => {
    const colors = [
      "#2563eb",
      "#7c3aed",
      "#059669",
      "#d97706",
      "#dc2626",
      "#0891b2",
      "#4f46e5",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const filteredUsers = users.filter((u) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return (
      (u.name || "").toLowerCase().includes(query) ||
      (u.email || "").toLowerCase().includes(query) ||
      (u.empID || "").toLowerCase().includes(query) ||
      (u.department || "").toLowerCase().includes(query)
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "a-z") {
      const aName = (a.name || "").toLowerCase();
      const bName = (b.name || "").toLowerCase();
      return aName.localeCompare(bName);
    }
    if (sortBy === "z-a") {
      const aName = (a.name || "").toLowerCase();
      const bName = (b.name || "").toLowerCase();
      return bName.localeCompare(aName);
    }
    if (sortBy === "newest") {
      const aId = a.id || 0;
      const bId = b.id || 0;
      return bId - aId;
    }
    if (sortBy === "oldest") {
      const aId = a.id || 0;
      const bId = b.id || 0;
      return aId - bId;
    }
    return 0;
  });

  const filteredTeams = teams.filter((t) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return (t.name || "").toLowerCase().includes(query);
  });

  const sortedTeams = [...filteredTeams].sort((a, b) => {
    if (teamSortBy === "a-z") {
      const aName = (a.name || "").toLowerCase();
      const bName = (b.name || "").toLowerCase();
      return aName.localeCompare(bName);
    }
    if (teamSortBy === "z-a") {
      const aName = (a.name || "").toLowerCase();
      const bName = (b.name || "").toLowerCase();
      return bName.localeCompare(aName);
    }
    if (teamSortBy === "newest") {
      const aId = a.id || 0;
      const bId = b.id || 0;
      return bId - aId;
    }
    if (teamSortBy === "oldest") {
      const aId = a.id || 0;
      const bId = b.id || 0;
      return aId - bId;
    }
    return 0;
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedUsers.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(sortedUsers.length / recordsPerPage);

  const indexOfLastTeam = currentTeamPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const currentTeams = sortedTeams.slice(indexOfFirstTeam, indexOfLastTeam);
  const totalTeamPages = Math.ceil(sortedTeams.length / teamsPerPage);

  return (
    <div className="user-mgmt-layout">
      <Sidebar />

      <main className="user-mgmt-main">
        {/* Floating Toast Notification */}
        {toast && (
          <div className="user-toast-container">
            <div className={`user-toast-box ${toast.type}`}>
              <span>{toast.message}</span>
              <button
                type="button"
                className="user-toast-close"
                onClick={() => setToast(null)}
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {/* Top Header Title Banner with Right Add User Button */}
        {activeTab === "users" && (
          <>
            <div className="user-mgmt-header">
              <div>
                <h2>User Management</h2>
                <p>Manage users and user roles in the system</p>
              </div>
              {creatorRole !== "recruiter" && (
                <button
                  type="button"
                  className="add-btn"
                  onClick={() => {
                    setNewUser({
                      empID: "",
                      name: "",
                      email: "",
                      mobileNo: "",
                      department: departmentOptions.length > 0 ? departmentOptions[0].value : "",
                      team: "",
                    });
                    setShowForm(true);
                    setTimeout(() => {
                      const input = document.getElementById("name");
                      if (input) input.focus();
                    }, 100);
                  }}
                >
                  <FaUserPlus />
                  <span>Add User</span>
                </button>
              )}
            </div>

            {/* Form Container Modal Popup */}
            <div className="user-form-page-wrapper">
              {showForm && (
                <div className="user-modal-overlay" onClick={() => setShowForm(false)}>
                  <div className="user-modal-card" onClick={(e) => e.stopPropagation()}>
                    <div className="user-modal-header">
                      <h2>Add New User</h2>
                      <button
                        type="button"
                        className="user-modal-close-btn"
                        onClick={() => setShowForm(false)}
                      >
                        &times;
                      </button>
                    </div>

                    <form onSubmit={handleAddUserSubmit} className="user-modal-form">
                      {/* Section 1: Emp ID & Name */}
                      <div className="form-band-section">
                        <div className="form-grid-2col">
                          <div className="form-field-group">
                            <label htmlFor="empID" className="field-label">
                              Employee ID (Emp ID)
                            </label>
                            <input
                              id="empID"
                              type="text"
                              name="empID"
                              className="form-control-input"
                              placeholder="e.g. EMP-1001 (optional, auto-generated)"
                              value={newUser.empID}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="form-field-group">
                            <label htmlFor="name" className="field-label">
                              Name <span className="req-star">*</span>
                            </label>
                            <input
                              id="name"
                              type="text"
                              name="name"
                              className="form-control-input"
                              placeholder="e.g. Senthil Kumar"
                              value={newUser.name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Email & Phone Number (Ph No) */}
                      <div className="form-band-section">
                        <div className="form-grid-2col">
                          <div className="form-field-group">
                            <label htmlFor="email" className="field-label">
                              Email Address <span className="req-star">*</span>
                            </label>
                            <input
                              id="email"
                              type="email"
                              name="email"
                              className="form-control-input"
                              placeholder="e.g. senthil.k@stanco.com"
                              value={newUser.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>

                          <div className="form-field-group">
                            <label htmlFor="mobileNo" className="field-label">
                              Phone Number (Ph No) <span className="req-star">*</span>
                            </label>
                            <input
                              id="mobileNo"
                              type="tel"
                              name="mobileNo"
                              className="form-control-input"
                              placeholder="e.g. 9876543210"
                              value={newUser.mobileNo}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Department (In which dept) */}
                      <div className="form-band-section">
                        <div className="form-grid-2col">
                          <div className="form-field-group">
                            <label htmlFor="department" className="field-label">
                              Department / Role <span className="req-star">*</span>
                            </label>
                            {departmentOptions.length > 0 ? (
                              <>
                                <select
                                  id="department"
                                  name="department"
                                  className="form-control-select"
                                  value={newUser.department}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value="">-- Select Department --</option>
                                  {departmentOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label} ({opt.badge})
                                    </option>
                                  ))}
                                </select>
                                <span style={{ fontSize: "11px", color: "#64748b", marginTop: "4px", display: "block" }}>
                                  Logged in as: <strong style={{ textTransform: "capitalize", color: "#1e293b" }}>{creatorRole || "super_admin"}</strong> &bull; Allowed to create: <strong style={{ color: "#2563eb" }}>{departmentOptions.map((o) => o.label).join(", ")}</strong>
                                </span>
                              </>
                            ) : (
                              <div style={{ padding: "10px 14px", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "6px", fontSize: "12px", border: "1px solid #fecaca" }}>
                                Your current role (<strong>{creatorRole || "Recruiter"}</strong>) is not authorized to create new users under the backend hierarchy.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Form Submit Button */}
                      <div className="form-action-row" style={{ marginTop: "24px" }}>
                        <button
                          type="submit"
                          className="btn-form-submit"
                          disabled={loading || departmentOptions.length === 0}
                        >
                          {loading ? "Submitting..." : "Submit"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Registered Users Section (Table format) */}
              <div className="user-table-card">
                <div className="table-header-toolbar">
                  <div className="table-title">
                    <h3>Registered Users</h3>
                    <span>Total: <strong>{filteredUsers.length}</strong> records</span>
                  </div>

                  <div className="toolbar-actions">
                    <div className="toolbar-search-sort-group" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="search-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                          <button
                            type="button"
                            className="clear-search-btn"
                            onClick={() => setSearch("")}
                          >
                            &times;
                          </button>
                        )}
                      </div>

                      <select
                        className="sort-select-dropdown"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        title="Sort Users"
                      >
                        <option value="a-z">Sort A-Z</option>
                        <option value="z-a">Sort Z-A</option>
                        <option value="newest">New User-Old User</option>
                        <option value="oldest">Old User-New User</option>
                      </select>
                    </div>

                    {selectedUserIds.length > 0 && (
                      <button
                        type="button"
                        className="btn-bulk-delete"
                        onClick={handleBulkDelete}
                      >
                        <FaTrash size={11} /> Delete ({selectedUserIds.length})
                      </button>
                    )}
                  </div>
                </div>

                <div className="users-table-wrapper">
                  <table className="modern-users-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>EMP ID</th>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>PH NO</th>
                        <th>DEPARTMENT</th>
                        <th>STATUS</th>
                        <th style={{ textAlign: "center" }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                              <FaUsers size={32} style={{ color: "#cbd5e1" }} />
                              <strong style={{ fontSize: "15px", color: "#475569" }}>No Users Found</strong>
                              <span style={{ fontSize: "12.5px", color: "#94a3b8" }}>Try a different search term or add a user profile.</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        currentRecords.map((u, idx) => {
                          const userKey = u.id || u.empID || u.empid;
                          const isSelected = selectedUserIds.includes(userKey);

                          return (
                            <tr key={userKey} className={isSelected ? "row-selected" : ""}>
                              <td>
                                <span className="user-index-tag">{indexOfFirstRecord + idx + 1}</span>
                              </td>
                              <td>
                                <span className="user-empid-badge">
                                  <FaIdBadge className="empid-badge-icon" />
                                  {u.empID || u.empid}
                                </span>
                              </td>
                              <td>
                                <div className="user-name-cell">
                                  <div
                                    className="user-table-avatar"
                                    style={{ backgroundColor: getAvatarColor(u.name) }}
                                  >
                                    {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                                  </div>
                                  <span className="user-table-name">{u.name}</span>
                                </div>
                              </td>
                              <td>
                                <a href={`mailto:${u.email}`} className="user-table-email" title={u.email}>
                                  <FaEnvelope className="table-email-icon" />
                                  {u.email}
                                </a>
                              </td>
                              <td>
                                <span className="user-table-phone">
                                  <FaPhoneAlt className="table-phone-icon" />
                                  {u.mobileNo || "-"}
                                </span>
                              </td>
                              <td>
                                <span className="user-dept-badge">{u.department || "-"}</span>
                              </td>
                              <td>
                                <span className="status-btn active-btn">
                                  <span className="status-dot"></span>
                                  {u.profileStatus || "Active"}
                                </span>
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <div className="table-actions-wrapper">
                                  <button
                                    type="button"
                                    className="btn-dots-action"
                                    title="Actions"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenUserMenuId(openUserMenuId === userKey ? null : userKey);
                                    }}
                                  >
                                    <FaEllipsisV />
                                  </button>

                                  {openUserMenuId === userKey && (
                                    <div className="action-dropdown-menu table-menu" onClick={(e) => e.stopPropagation()}>
                                      <button
                                        type="button"
                                        className="action-menu-item edit-item"
                                        onClick={() => {
                                          setEditingUser({ ...u });
                                          setOpenUserMenuId(null);
                                        }}
                                      >
                                        <FaEdit className="menu-item-icon" />
                                        <span>Update</span>
                                      </button>
                                      <button
                                        type="button"
                                        className="action-menu-item delete-item"
                                        onClick={() => {
                                          handleDeleteUser(u.id, u.name);
                                          setOpenUserMenuId(null);
                                        }}
                                      >
                                        <FaTrash className="menu-item-icon" />
                                        <span>Delete</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        }))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="table-pagination-bar">
                    <button
                      type="button"
                      className="pagination-btn"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                    </span>
                    <button
                      type="button"
                      className="pagination-btn"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* =========================================================
            TEAMS TAB VIEW
            ========================================================= */}
        {activeTab === "teams" && (
          <>
            {/* Top Header Title Banner with Right Add Team Button */}
            <div className="user-mgmt-header">
              <div>
                <h2>Teams Management</h2>
                <p>Manage teams and team configurations</p>
              </div>
              <button
                type="button"
                className="add-btn"
                onClick={() => {
                  setNewTeam({ name: "", code: "", status: "Active" });
                  setShowAddTeamModal(true);
                }}
              >
                <FaPlus />
                <span>Add Team</span>
              </button>
            </div>

            {/* Teams Page Wrapper */}
            <div className="user-form-page-wrapper">
              <div className="user-table-card">
                <div className="table-header-toolbar">
                  <div className="table-title">
                    <h3>Registered Teams</h3>
                    <span>Total: <strong>{filteredTeams.length}</strong> records</span>
                  </div>

                  <div className="toolbar-actions">
                    <div className="toolbar-search-sort-group" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="search-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                          type="text"
                          placeholder="Search teams..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                          <button
                            type="button"
                            className="clear-search-btn"
                            onClick={() => setSearch("")}
                          >
                            &times;
                          </button>
                        )}
                      </div>

                      <select
                        className="sort-select-dropdown"
                        value={teamSortBy}
                        onChange={(e) => setTeamSortBy(e.target.value)}
                        title="Sort Teams"
                      >
                        <option value="a-z">Sort A-Z</option>
                        <option value="z-a">Sort Z-A</option>
                        <option value="newest">New Team-Old Team</option>
                        <option value="oldest">Old Team-New Team</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="users-table-wrapper">
                  <table className="modern-teams-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>TEAM NAME</th>
                        <th>STATUS</th>
                        <th style={{ textAlign: "center" }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTeams.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                              <FaUsers size={32} style={{ color: "#cbd5e1" }} />
                              <strong style={{ fontSize: "15px", color: "#475569" }}>No Teams Found</strong>
                              <span style={{ fontSize: "12.5px", color: "#94a3b8" }}>Try a different search term or add a team.</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        currentTeams.map((team, idx) => (
                          <tr key={team.id || team.name}>
                            <td>
                              <span className="team-index-tag">{indexOfFirstTeam + idx + 1}</span>
                            </td>
                            <td>
                              <div className="team-name-cell">
                                <span className="team-badge-pill">{team.name}</span>
                              </div>
                            </td>
                            <td>
                              <span className="status-btn active-btn">
                                <span className="status-dot"></span>
                                {team.status || "Active"}
                              </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <div className="table-actions-wrapper">
                                <button
                                  type="button"
                                  className="btn-dots-action"
                                  title="Actions"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const teamKey = team.id || team.name;
                                    setOpenTeamMenuId(openTeamMenuId === teamKey ? null : teamKey);
                                  }}
                                >
                                  <FaEllipsisV />
                                </button>

                                {openTeamMenuId === (team.id || team.name) && (
                                  <div className="action-dropdown-menu table-menu" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      type="button"
                                      className="action-menu-item edit-item"
                                      onClick={() => {
                                        setEditingTeam({ ...team });
                                        setOpenTeamMenuId(null);
                                      }}
                                    >
                                      <FaEdit className="menu-item-icon" />
                                      <span>Update</span>
                                    </button>
                                    <button
                                      type="button"
                                      className="action-menu-item delete-item"
                                      onClick={() => {
                                        handleDeleteTeam(team.id, team.name);
                                        setOpenTeamMenuId(null);
                                      }}
                                    >
                                      <FaTrash className="menu-item-icon" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Controls */}
                {totalTeamPages > 1 && (
                  <div className="table-pagination-bar">
                    <button
                      type="button"
                      className="pagination-btn"
                      onClick={() => setCurrentTeamPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentTeamPage === 1}
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      Page <strong>{currentTeamPage}</strong> of <strong>{totalTeamPages}</strong>
                    </span>
                    <button
                      type="button"
                      className="pagination-btn"
                      onClick={() => setCurrentTeamPage((prev) => Math.min(prev + 1, totalTeamPages))}
                      disabled={currentTeamPage === totalTeamPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* =========================================================
            UPDATE USER MODAL
            ========================================================= */}
        {editingUser && (
          <div className="mgmt-modal-backdrop" onClick={() => setEditingUser(null)}>
            <div className="mgmt-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="mgmt-modal-header">
                <div className="mgmt-modal-title-group">
                  <FaEdit className="modal-title-icon" />
                  <h3>Update User Details</h3>
                </div>
                <button
                  type="button"
                  className="mgmt-modal-close"
                  onClick={() => setEditingUser(null)}
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleUpdateUserSubmit} className="mgmt-modal-form">
                <div className="modal-grid-2col">
                  <div className="form-field-group">
                    <label className="field-label">Emp ID</label>
                    <input
                      type="text"
                      className="form-control-input"
                      value={editingUser.empID || ""}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, empID: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">
                      Full Name <span className="req-star">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control-input"
                      value={editingUser.name || ""}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="modal-grid-2col">
                  <div className="form-field-group">
                    <label className="field-label">
                      Email Address <span className="req-star">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control-input"
                      value={editingUser.email || ""}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">
                      Phone Number (Ph No) <span className="req-star">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control-input"
                      value={editingUser.mobileNo || ""}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, mobileNo: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="modal-grid-2col">
                  <div className="form-field-group">
                    <label className="field-label">
                      Department (In which dept) <span className="req-star">*</span>
                    </label>
                    <select
                      className="form-control-select"
                      value={editingUser.department || ""}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, department: e.target.value })
                      }
                      required
                    >
                      <option value="">-- Select Department --</option>
                      <option value="Admin">Admin</option>
                      <option value="Hiring Manager">Hiring Manager</option>
                      <option value="Business Lead">Business Lead</option>
                      <option value="Recruiter">Recruiter</option>
                    </select>
                  </div>
                </div>

                <div className="mgmt-modal-actions">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-modal-save">
                    <FaSave />
                    <span>Update User</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================
            UPDATE TEAM MODAL
            ========================================================= */}
        {editingTeam && (
          <div className="mgmt-modal-backdrop" onClick={() => setEditingTeam(null)}>
            <div className="mgmt-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="mgmt-modal-header">
                <div className="mgmt-modal-title-group">
                  <FaEdit className="modal-title-icon" />
                  <h3>Update Team Details</h3>
                </div>
                <button
                  type="button"
                  className="mgmt-modal-close"
                  onClick={() => setEditingTeam(null)}
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleUpdateTeamSubmit} className="mgmt-modal-form">
                <div className="modal-grid-2col">
                  <div className="form-field-group">
                    <label className="field-label">
                      Team Name <span className="req-star">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control-input"
                      value={editingTeam.name || ""}
                      onChange={(e) =>
                        setEditingTeam({ ...editingTeam, name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="mgmt-modal-actions">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() => setEditingTeam(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-modal-save">
                    <FaSave />
                    <span>Update Team</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================
            ADD TEAM DIALOG BOX MODAL
            ========================================================= */}
        {showAddTeamModal && (
          <div className="mgmt-modal-backdrop" onClick={() => setShowAddTeamModal(false)}>
            <div className="mgmt-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="mgmt-modal-header">
                <div className="mgmt-modal-title-group">
                  <FaPlus className="modal-title-icon" />
                  <h3>Add New Team</h3>
                </div>
                <button
                  type="button"
                  className="mgmt-modal-close"
                  onClick={() => setShowAddTeamModal(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleAddTeamSubmit} className="mgmt-modal-form">
                <div className="modal-grid-2col">
                  <div className="form-field-group">
                    <label className="field-label">
                      Team Name <span className="req-star">*</span>
                    </label>
                    <input
                      id="teamNameInput"
                      name="name"
                      type="text"
                      className="form-control-input"
                      placeholder="e.g. HPEL, CKPL, STANCO, TEST"
                      value={newTeam.name || ""}
                      onChange={(e) =>
                        setNewTeam((prev) => ({ ...prev, name: e.target.value }))
                      }
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="mgmt-modal-actions">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() => setShowAddTeamModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-modal-save">
                    <FaCheck />
                    <span>OK</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserManagement;
