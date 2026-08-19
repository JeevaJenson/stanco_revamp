import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaUserPlus,
  FaTrash,
  FaEnvelope,
  FaIdBadge,
  FaUsers,
  FaPhoneAlt,
  FaPlus,
  FaEdit,
  FaTimes,
  FaSave,
  FaSearch,
  FaCheck,
  FaEllipsisV,
} from "react-icons/fa";

import api from "../services/api";
import Sidebar from "./Sidebar";
import "../style/UserManagement.css";

const ROLE_OPTIONS = {
  super_admin: [
    {
      label: "Admin",
      roleType: "admin",
    },
  ],

  admin: [
    {
      label: "Hiring Manager",
      roleType: "delivery_lead",
    },
  ],

  delivery_lead: [
    {
      label: "Recruiter",
      roleType: "recruiter",
    },
  ],

  recruiter: [],
};

const ALL_ROLE_OPTIONS = [
  {
    label: "Admin",
    roleType: "admin",
  },
  {
    label: "Hiring Manager",
    roleType: "delivery_lead",
  },
  {
    label: "Recruiter",
    roleType: "recruiter",
  },
];

const DROPDOWN_DESIGNATIONS = [
  { label: "Admin", value: "Admin" },
  { label: "Hiring Manager", value: "Hiring Manager" },
  { label: "Recruiter", value: "Recruiter" }
];

const EMPTY_USER = {
  empID: "",
  name: "",
  designation: "",
  business: "",
  department: "",
  lobDivision: "",
  email: "",
  mobileNo: "",
  roleType: "",
  profileStatus: "active",
  password: "",
  team: "",
  colorCode: "",
};

const EMPTY_TEAM = {
  name: "",
  status: 1,
};

function UserManagement({ initialTab = "users" }) {
  const location = useLocation();

  const routeTab =
    location.pathname === "/teams"
      ? "teams"
      : "users";

  const [activeTab, setActiveTab] = useState(
    routeTab || initialTab
  );

  useEffect(() => {
    setActiveTab(routeTab);
  }, [routeTab]);

  /* =========================
     USER STATE
  ========================= */

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);

  const [newUser, setNewUser] = useState(EMPTY_USER);
  const [editingUser, setEditingUser] = useState(null);

  /* =========================
     TEAM STATE
  ========================= */

  const [teams, setTeams] = useState([]);
  const [activeTeams, setActiveTeams] = useState([]);
  const [newTeam, setNewTeam] = useState(EMPTY_TEAM);
  const [editingTeam, setEditingTeam] = useState(null);

  /* =========================
     MODAL STATE
  ========================= */

  const [showUserModal, setShowUserModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);


  /* =========================
     SEARCH / SORT
  ========================= */

  const [userSearch, setUserSearch] = useState("");
  const [teamSearch, setTeamSearch] = useState("");

  const [userSort, setUserSort] = useState("a-z");
  const [teamSort, setTeamSort] = useState("a-z");

  /* =========================
     PAGINATION
  ========================= */

  const [userPage, setUserPage] = useState(1);
  const [teamPage, setTeamPage] = useState(1);

  const USERS_PER_PAGE = 9;
  const TEAMS_PER_PAGE = 9;

  /* =========================
     TOAST
  ========================= */

  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({
      type,
      message,
    });
  };

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast]);

  const [activeActionMenu, setActiveActionMenu] = useState(null);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveActionMenu(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const [businessList, setBusinessList] = useState([
    { label: "CKLP", value: "CKLP" },
    { label: "STANCO", value: "STANCO" }
  ]);
  const [departmentList, setDepartmentList] = useState([
    { label: "IT", value: "IT" },
    { label: "Human Resources", value: "Human Resources" },
    { label: "Business", value: "Business" }
  ]);

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [busRes, deptRes] = await Promise.all([
          api.get("/business-masters"),
          api.get("/departments")
        ]);
        
        const activeBuses = (busRes.data || [])
          .filter(b => String(b.status || "active").toLowerCase() === "active")
          .map(b => ({ label: b.businessName, value: b.businessName }));
        if (activeBuses.length > 0) setBusinessList(activeBuses);

        const activeDepts = (deptRes.data || [])
          .filter(d => String(d.status || "active").toLowerCase() === "active")
          .map(d => ({ label: d.name, value: d.name }));
        if (activeDepts.length > 0) setDepartmentList(activeDepts);
      } catch (err) {
        console.error("Error loading dropdown data:", err);
      }
    };
    loadDropdownData();
  }, []);

  /* =========================
     CURRENT USER
  ========================= */

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const creatorRole = (
    currentUser?.roleType ||
    ""
  ).toLowerCase();

  /* =========================
     ROLE OPTIONS
  ========================= */

  const roleOptions =
    ROLE_OPTIONS[creatorRole] || [];

  /* =========================
     LOAD USERS
  ========================= */

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      const response = await api.get("/users");

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);

      const message =
        error?.response?.data?.message ||
        "Unable to load users";

      showToast("error", message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const [allResponse, activeResponse] = await Promise.all([
        api.get("/teams"),
        api.get("/teams/active"),
      ]);

      const allTeams = Array.isArray(allResponse.data)
        ? allResponse.data
        : [];

      const activeTeamData = Array.isArray(activeResponse.data)
        ? activeResponse.data
        : [];

      setTeams(allTeams);
      setActiveTeams(activeTeamData);
    } catch (error) {
      console.error("Failed to load teams:", error);

      const message =
        error?.response?.data?.message ||
        "Unable to load teams";

      showToast("error", message);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, []);

  /* =========================
     USER FORM CHANGE
  ========================= */

  const handleUserChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setNewUser((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================
     CREATE USER
  ========================= */

  const handleCreateUser = async (event) => {
    event.preventDefault();

    if (!newUser.empID.trim()) {
      showToast(
        "error",
        "Employee ID is required"
      );
      return;
    }

    if (!newUser.name.trim()) {
      showToast(
        "error",
        "Name is required"
      );
      return;
    }

    if (!newUser.designation.trim()) {
      showToast(
        "error",
        "Designation is required"
      );
      return;
    }

    if (!newUser.email.trim()) {
      showToast(
        "error",
        "Email is required"
      );
      return;
    }

    if (!newUser.team.trim()) {
      showToast(
        "error",
        "Active team is required"
      );
      return;
    }

    const derivedMobile = newUser.mobileNo?.trim() || "0000000000";
    const derivedPassword = newUser.password || "Stanco@123";
    let derivedRole = "recruiter";
    if (newUser.designation === "Admin") derivedRole = "admin";
    else if (newUser.designation === "Hiring Manager") derivedRole = "delivery_lead";

    try {
      setCreatingUser(true);

      const payload = {
        empID: newUser.empID.trim(),
        name: newUser.name.trim(),
        designation: newUser.designation.trim(),

        business:
          newUser.business?.trim() || null,

        department:
          newUser.department?.trim() || null,

        lobDivision:
          newUser.lobDivision?.trim() || null,

        email:
          newUser.email
            .trim()
            .toLowerCase(),

        mobileNo: derivedMobile,

        roleType: derivedRole,

        profileStatus:
          newUser.profileStatus || "active",

        password: derivedPassword,

        team:
          newUser.team.trim() || "",

        colorCode:
          newUser.colorCode.trim() || "",
      };

      const response = await api.post(
        "/users",
        payload
      );

      const createdUser = response.data;

      setUsers((previous) => [
        createdUser,
        ...previous,
      ]);

      /*
       * Refresh teams from users
       */
      await fetchUsers();

      setNewUser(EMPTY_USER);
      setShowUserModal(false);

      showToast(
        "success",
        "User created successfully"
      );
    } catch (error) {
      console.error(
        "Create user error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to create user";

      showToast(
        "error",
        typeof message === "string"
          ? message
          : "Failed to create user"
      );
    } finally {
      setCreatingUser(false);
    }
  };

  /* =========================
     USER UPDATE
  ========================= */

  const handleUpdateUser = async (event) => {
    event.preventDefault();

    if (!editingUser?.id) {
      showToast("error", "User ID is missing");
      return;
    }

    if (
      !editingUser.empID?.trim() ||
      !editingUser.name?.trim() ||
      !editingUser.designation?.trim() ||
      !editingUser.email?.trim() ||
      !editingUser.team?.trim()
    ) {
      showToast("error", "Please fill all required fields");
      return;
    }

    let derivedRole = editingUser.roleType || "recruiter";
    if (editingUser.designation === "Admin") derivedRole = "admin";
    else if (editingUser.designation === "Hiring Manager") derivedRole = "delivery_lead";
    else if (editingUser.designation === "Recruiter") derivedRole = "recruiter";

    try {
      setCreatingUser(true);

      const payload = {
        empID: editingUser.empID.trim(),
        name: editingUser.name.trim(),
        designation: editingUser.designation.trim(),
        business: editingUser.business?.trim() || null,
        department: editingUser.department?.trim() || null,
        lobDivision: editingUser.lobDivision?.trim() || null,
        email: editingUser.email.trim().toLowerCase(),
        mobileNo: editingUser.mobileNo?.trim() || "0000000000",
        roleType: derivedRole,
        profileStatus: editingUser.profileStatus || "active",
        team: editingUser.team?.trim() || "",
        colorCode: editingUser.colorCode?.trim() || "",
      };

      if (editingUser.password?.trim()) {
        payload.password = editingUser.password.trim();
      }

      const response = await api.put(
        `/users/${editingUser.id}`,
        payload
      );

      setUsers((previous) =>
        previous.map((user) =>
          user.id === editingUser.id ? response.data : user
        )
      );

      setEditingUser(null);
      await fetchUsers();
      showToast("success", "User updated successfully");
    } catch (error) {
      console.error("Update user error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to update user";

      showToast(
        "error",
        typeof message === "string"
          ? message
          : "Failed to update user"
      );
    } finally {
      setCreatingUser(false);
    }
  };

  /* =========================
     USER DELETE
  ========================= */

  const handleDeleteUser = async (
    user
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/users/${user.id}`);

      setUsers((previous) =>
        previous.filter(
          (item) => item.id !== user.id
        )
      );

      await fetchUsers();

      showToast(
        "success",
        "User deleted successfully"
      );
    } catch (error) {
      console.error(
        "Delete user error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Failed to delete user";

      showToast("error", message);
    }
  };

  /* =========================
     OPEN CREATE USER
  ========================= */

  const openCreateUser = () => {
    if (creatorRole === "recruiter") {
      showToast(
        "error",
        "Recruiter cannot create users"
      );
      return;
    }

    if (roleOptions.length === 0) {
      showToast(
        "error",
        "You are not authorized to create users"
      );
      return;
    }

    setNewUser({
      ...EMPTY_USER,
      roleType: roleOptions[0]?.roleType || "",
    });

    setShowUserModal(true);
  };

  /* =========================
     TEAM FUNCTIONS
  ========================= */

  const handleTeamChange = (event) => {
    const { name, value } = event.target;

    setNewTeam((previous) => ({
      ...previous,
      [name]: name === "status" ? Number(value) : value,
    }));
  };

  const handleAddTeam = async (event) => {
    event.preventDefault();

    const name = newTeam.name.trim();

    if (!name) {
      showToast("error", "Team name is required");
      return;
    }

    try {
      const response = await api.post("/teams", {
        name,
        status: Number(newTeam.status ?? 1),
      });

      setTeams((previous) => [
        response.data,
        ...previous,
      ]);

      await fetchTeams();

      setNewTeam(EMPTY_TEAM);
      setShowTeamModal(false);

      showToast(
        "success",
        `Team "${name}" added successfully`
      );
    } catch (error) {
      console.error("Create team error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to create team";

      showToast(
        "error",
        typeof message === "string"
          ? message
          : "Failed to create team"
      );
    }
  };

  const handleUpdateTeam = async (event) => {
    event.preventDefault();

    if (!editingTeam?.id) {
      showToast("error", "Team ID is missing");
      return;
    }

    const name = editingTeam.name?.trim();

    if (!name) {
      showToast("error", "Team name is required");
      return;
    }

    try {
      const response = await api.put(
        `/teams/${editingTeam.id}`,
        {
          name,
          status: Number(editingTeam.status ?? 1),
        }
      );

      setTeams((previous) =>
        previous.map((team) =>
          team.id === editingTeam.id
            ? response.data
            : team
        )
      );

      setEditingTeam(null);

      await fetchTeams();
      await fetchUsers();

      showToast(
        "success",
        "Team updated successfully"
      );
    } catch (error) {
      console.error("Update team error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to update team";

      showToast(
        "error",
        typeof message === "string"
          ? message
          : "Failed to update team"
      );
    }
  };

  const handleDeleteTeam = async (team) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete team "${team.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/teams/${team.id}`);

      await fetchTeams();
      await fetchUsers();

      showToast(
        "success",
        `Team "${team.name}" deleted successfully`
      );
    } catch (error) {
      console.error("Delete team error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to delete team";

      showToast(
        "error",
        typeof message === "string"
          ? message
          : "Failed to delete team"
      );
    }
  };

  /* =========================
     USER SEARCH
  ========================= */

  const filteredUsers = useMemo(() => {
    const query =
      userSearch
        .trim()
        .toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) =>
      [
        user.name,
        user.empID,
        user.email,
        user.department,
        user.designation,
        user.team,
        user.roleType,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      )
    );
  }, [users, userSearch]);

  /* =========================
     USER SORT
  ========================= */

  const sortedUsers = useMemo(() => {
    const result = [
      ...filteredUsers,
    ];

    switch (userSort) {
      case "a-z":
        return result.sort((a, b) =>
          String(a.name || "")
            .toLowerCase()
            .localeCompare(
              String(b.name || "")
                .toLowerCase()
            )
        );

      case "z-a":
        return result.sort((a, b) =>
          String(b.name || "")
            .toLowerCase()
            .localeCompare(
              String(a.name || "")
                .toLowerCase()
            )
        );

      case "newest":
        return result.sort(
          (a, b) =>
            Number(b.id || 0) -
            Number(a.id || 0)
        );

      case "oldest":
        return result.sort(
          (a, b) =>
            Number(a.id || 0) -
            Number(b.id || 0)
        );

      default:
        return result;
    }
  }, [filteredUsers, userSort]);

  /* =========================
     TEAM SEARCH
  ========================= */

  const filteredTeams = useMemo(() => {
    const query =
      teamSearch
        .trim()
        .toLowerCase();

    if (!query) {
      return teams;
    }

    return teams.filter((team) =>
      [
        team.name,
        team.status,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      )
    );
  }, [teams, teamSearch]);

  /* =========================
     TEAM SORT
  ========================= */

  const sortedTeams = useMemo(() => {
    const result = [
      ...filteredTeams,
    ];

    switch (teamSort) {
      case "a-z":
        return result.sort((a, b) =>
          String(a.name || "")
            .toLowerCase()
            .localeCompare(
              String(b.name || "")
                .toLowerCase()
            )
        );

      case "z-a":
        return result.sort((a, b) =>
          String(b.name || "")
            .toLowerCase()
            .localeCompare(
              String(a.name || "")
                .toLowerCase()
            )
        );

      case "newest":
        return result.sort(
          (a, b) =>
            Number(b.id || 0) -
            Number(a.id || 0)
        );

      case "oldest":
        return result.sort(
          (a, b) =>
            Number(a.id || 0) -
            Number(b.id || 0)
        );

      default:
        return result;
    }
  }, [filteredTeams, teamSort]);

  /* =========================
     PAGINATION
  ========================= */

  const totalUserPages = Math.max(
    1,
    Math.ceil(
      sortedUsers.length /
        USERS_PER_PAGE
    )
  );

  const totalTeamPages = Math.max(
    1,
    Math.ceil(
      sortedTeams.length /
        TEAMS_PER_PAGE
    )
  );

  const currentUsers = sortedUsers.slice(
    (userPage - 1) *
      USERS_PER_PAGE,
    userPage * USERS_PER_PAGE
  );

  const currentTeams = sortedTeams.slice(
    (teamPage - 1) *
      TEAMS_PER_PAGE,
    teamPage * TEAMS_PER_PAGE
  );

  const teamStartIndex =
    filteredTeams.length === 0
      ? 0
      : (teamPage - 1) * TEAMS_PER_PAGE + 1;

  const teamEndIndex = Math.min(
    teamPage * TEAMS_PER_PAGE,
    filteredTeams.length
  );

  useEffect(() => {
    setUserPage(1);
  }, [userSearch]);

  useEffect(() => {
    setTeamPage(1);
  }, [teamSearch]);

  /* =========================
     AVATAR
  ========================= */

  const getAvatarLetter = (name) => {
    return (
      name?.trim()?.charAt(0)
        ?.toUpperCase() || "U"
    );
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="user-mgmt-layout">
      <Sidebar />

      <main className="user-mgmt-main">

        {/* =====================
            TOAST
        ====================== */}

        {toast && (
          <div className="user-toast-container">
            <div
              className={`user-toast-box ${toast.type}`}
            >
              <span>
                {toast.message}
              </span>

              <button
                type="button"
                className="user-toast-close"
                onClick={() =>
                  setToast(null)
                }
              >
                ×
              </button>
            </div>
          </div>
        )}

  
        {/* =================================================
            USERS
        ================================================= */}

        {activeTab === "users" && (
          <>
            <div className="user-mgmt-header">
              <div>
                <h2>
                  User Management
                </h2>

                <p>
                  Manage users and user
                  roles in the system
                </p>
              </div>

              {creatorRole !==
                "recruiter" &&
                roleOptions.length >
                  0 && (
                  <button
                    type="button"
                    className="add-btn"
                    onClick={
                      openCreateUser
                    }
                  >
                    <FaUserPlus />
                    <span>
                      Add User
                    </span>
                  </button>
                )}
            </div>

            {/* USER TABLE */}

            <div className="user-table-card">

              <div className="table-header-toolbar">
                <div className="table-title">
                  <h3>
                    Registered Users
                  </h3>

                  <span>
                    Total:{" "}
                    <strong>
                      {
                        filteredUsers.length
                      }
                    </strong>{" "}
                    records
                  </span>
                </div>

                <div className="toolbar-actions">

                  <div className="search-wrapper">
                    <FaSearch className="search-icon" />

                    <input
                      type="text"
                      placeholder="Search users..."
                      value={
                        userSearch
                      }
                      onChange={(event) =>
                        setUserSearch(
                          event.target
                            .value
                        )
                      }
                    />

                    {userSearch && (
                      <button
                        type="button"
                        className="clear-search-btn"
                        onClick={() =>
                          setUserSearch(
                            ""
                          )
                        }
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <select
                    className="sort-select-dropdown"
                    value={userSort}
                    onChange={(event) =>
                      setUserSort(
                        event.target
                          .value
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

              <div className="users-table-wrapper">

                {loadingUsers ? (
                  <div className="table-loading">
                    Loading users...
                  </div>
                ) : (
                  <table className="modern-users-table">

                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>EMP ID</th>
                        <th>NAME</th>
                        <th>DESIGNATION</th>
                        <th>EMAIL</th>
                        <th>TEAM</th>
                        <th>STATUS</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>

                    <tbody>

                      {currentUsers.length ===
                      0 ? (
                        <tr>
                          <td
                            colSpan="8"
                            style={{
                              textAlign:
                                "center",
                              padding:
                                "40px",
                            }}
                          >
                            <FaUsers
                              size={32}
                            />

                            <div>
                              No users
                              found
                            </div>
                          </td>
                        </tr>
                      ) : (
                        currentUsers.map(
                          (
                            user,
                            index
                          ) => {
                            const userId =
                              user.id ||
                              user.empID;

                            return (
                              <tr
                                key={
                                  userId
                                }
                              >

                                <td>
                                  {(userPage -
                                    1) *
                                    USERS_PER_PAGE +
                                    index +
                                    1}
                                </td>

                                <td>
                                  <span className="user-empid-badge">
                                    <FaIdBadge />
                                    {
                                      user.empID
                                    }
                                  </span>
                                </td>

                                <td>
                                  <div className="user-name-cell">

                                    <div className="user-table-avatar">
                                      {getAvatarLetter(
                                        user.name
                                      )}
                                    </div>

                                    <span>
                                      {
                                        user.name
                                      }
                                    </span>
                                  </div>
                                </td>

                                <td>
                                  {
                                    user.designation ||
                                    "-"
                                  }
                                </td>

                                <td>
                                  <a
                                    href={`mailto:${user.email}`}
                                    className="user-table-email"
                                  >
                                    <FaEnvelope />
                                    {
                                      user.email
                                    }
                                  </a>
                                </td>

                                <td>
                                  {
                                    user.team ||
                                    "-"
                                  }
                                </td>

                                <td>
                                  <span
                                    className={`status-btn ${
                                      String(
                                        user.profileStatus ||
                                          "active"
                                      ).toLowerCase() === "active"
                                        ? "active-btn"
                                        : "inactive-btn"
                                    }`}
                                  >
                                    <span className="status-dot" />

                                    {String(
                                      user.profileStatus ||
                                        "active"
                                    ).toLowerCase() === "active"
                                      ? "Active"
                                      : "Inactive"}
                                  </span>
                                </td>

                                <td>
                                  <div className="table-actions-wrapper" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      type="button"
                                      className="btn-dots-action"
                                      onClick={() =>
                                        setActiveActionMenu(
                                          activeActionMenu === `user-${user.id || user.empID}`
                                            ? null
                                            : `user-${user.id || user.empID}`
                                        )
                                      }
                                    >
                                      <FaEllipsisV />
                                    </button>

                                    {activeActionMenu === `user-${user.id || user.empID}` && (
                                      <div className="action-dropdown-menu table-menu">
                                        <button
                                          type="button"
                                          className="action-menu-item"
                                          onClick={() => {
                                            setEditingUser({
                                              ...user,
                                              password: "",
                                            });
                                            setActiveActionMenu(null);
                                          }}
                                        >
                                          <FaEdit /> Update
                                        </button>
                                        <button
                                          type="button"
                                          className="action-menu-item delete"
                                          onClick={() => {
                                            handleDeleteUser(user);
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
                            );
                          }
                        )
                      )}

                    </tbody>
                  </table>
                )}

              </div>

              {/* USER PAGINATION */}

              {totalUserPages >
                1 && (
                <div className="table-pagination-bar">

                  <button
                    type="button"
                    className="pagination-btn"
                    disabled={
                      userPage ===
                      1
                    }
                    onClick={() =>
                      setUserPage(
                        (page) =>
                          Math.max(
                            page - 1,
                            1
                          )
                      )
                    }
                  >
                    Previous
                  </button>

                  <span className="pagination-info">
                    Page{" "}
                    <strong>
                      {userPage}
                    </strong>{" "}
                    of{" "}
                    <strong>
                      {
                        totalUserPages
                      }
                    </strong>
                  </span>

                  <button
                    type="button"
                    className="pagination-btn"
                    disabled={
                      userPage ===
                      totalUserPages
                    }
                    onClick={() =>
                      setUserPage(
                        (page) =>
                          Math.min(
                            page + 1,
                            totalUserPages
                          )
                      )
                    }
                  >
                    Next
                  </button>

                </div>
              )}

            </div>
          </>
        )}

        {/* =================================================
            TEAMS
        ================================================= */}

        {activeTab === "teams" && (
          <>
            <div className="user-mgmt-header">

              <div>
                <h2>
                  Teams Management
                </h2>

                <p>
                  Manage teams and team
                  configurations
                </p>
              </div>

              <button
                type="button"
                className="add-btn"
                onClick={() => {
                  setNewTeam(
                    EMPTY_TEAM
                  );

                  setShowTeamModal(
                    true
                  );
                }}
              >
                <FaPlus />
                <span>
                  Add Team
                </span>
              </button>

            </div>

            <div className="user-table-card">

              <div className="table-header-toolbar">

                <div className="table-title">
                  <h3>
                    Registered Teams
                  </h3>

                  <span>
                    Total:{" "}
                    <strong>
                      {
                        filteredTeams.length
                      }
                    </strong>{" "}
                    records
                  </span>
                </div>

                <div className="toolbar-actions">

                  <div className="search-wrapper">

                    <FaSearch className="search-icon" />

                    <input
                      type="text"
                      placeholder="Search teams..."
                      value={
                        teamSearch
                      }
                      onChange={(event) =>
                        setTeamSearch(
                          event.target
                            .value
                        )
                      }
                    />

                    {teamSearch && (
                      <button
                        type="button"
                        className="clear-search-btn"
                        onClick={() =>
                          setTeamSearch(
                            ""
                          )
                        }
                      >
                        ×
                      </button>
                    )}

                  </div>

                  <select
                    className="sort-select-dropdown"
                    value={teamSort}
                    onChange={(event) =>
                      setTeamSort(
                        event.target
                          .value
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

              <div className="users-table-wrapper">

                <table className="modern-teams-table">

                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>TEAM NAME</th>
                      <th>STATUS</th>
                      <th>CREATED BY</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>

                  <tbody>

                    {currentTeams.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          style={{
                            textAlign:
                              "center",
                            padding:
                              "40px",
                          }}
                        >
                          <FaUsers
                            size={32}
                          />

                          <div>
                            No teams
                            found
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentTeams.map(
                        (
                          team,
                          index
                        ) => (
                          <tr
                            key={
                              team.id ||
                              team.name
                            }
                          >

                            <td>
                              {(teamPage -
                                1) *
                                TEAMS_PER_PAGE +
                                index +
                                1}
                            </td>

                            <td>
                              <span className="team-badge-pill">
                                {
                                  team.name
                                }
                              </span>
                            </td>

                            <td>
                              <span
                                className={`status-btn ${
                                  Number(team.status) === 1
                                    ? "active-btn"
                                    : "inactive-btn"
                                }`}
                              >
                                <span className="status-dot" />
                                {Number(team.status) === 1
                                  ? "ACTIVE"
                                  : "INACTIVE"}
                              </span>
                            </td>

        
                            <td>
                              {team.createdBy || "-"}
                            </td>

                            <td>
                              <div className="table-actions-wrapper" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  className="btn-dots-action"
                                  onClick={() =>
                                    setActiveActionMenu(
                                      activeActionMenu === `team-${team.id || team.name}`
                                        ? null
                                        : `team-${team.id || team.name}`
                                    )
                                  }
                                >
                                  <FaEllipsisV />
                                </button>

                                {activeActionMenu === `team-${team.id || team.name}` && (
                                  <div className="action-dropdown-menu table-menu">
                                    <button
                                      type="button"
                                      className="action-menu-item"
                                      onClick={() => {
                                        setEditingTeam({ ...team });
                                        setActiveActionMenu(null);
                                      }}
                                    >
                                      <FaEdit /> Update
                                    </button>
                                    <button
                                      type="button"
                                      className="action-menu-item delete"
                                      onClick={() => {
                                        handleDeleteTeam(team);
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
                      )
                    )}

                  </tbody>
                </table>

              </div>

              {filteredTeams.length > 0 && (
                <div className="table-pagination-bar">

                  <span className="pagination-info">
                    Showing <strong>{teamStartIndex}</strong> to{" "}
                    <strong>{teamEndIndex}</strong> of{" "}
                    <strong>{filteredTeams.length}</strong> records
                  </span>

                  <div className="pagination-buttons">
                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={teamPage === 1}
                      onClick={() =>
                        setTeamPage((page) => Math.max(page - 1, 1))
                      }
                    >
                      &lt; Previous
                    </button>

                    {Array.from({ length: totalTeamPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`pagination-page-btn ${
                          teamPage === p ? "active" : ""
                        }`}
                        onClick={() => setTeamPage(p)}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={teamPage === totalTeamPages}
                      onClick={() =>
                        setTeamPage((page) =>
                          Math.min(page + 1, totalTeamPages)
                        )
                      }
                    >
                      Next &gt;
                    </button>
                  </div>

                </div>
              )}

            </div>
          </>
        )}

        {/* =================================================
            ADD USER MODAL
        ================================================= */}

        {showUserModal && (
          <div
            className="mgmt-modal-backdrop"
            onClick={() =>
              setShowUserModal(false)
            }
          >

            <div
              className="mgmt-modal-card"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="mgmt-modal-header">

                <div className="mgmt-modal-title-group">
                  <FaUserPlus />
                  <h3>
                    Add New User
                  </h3>
                </div>

                <button
                  type="button"
                  className="mgmt-modal-close"
                  onClick={() =>
                    setShowUserModal(
                      false
                    )
                  }
                >
                  <FaTimes />
                </button>

              </div>

              <form
                className="mgmt-modal-form"
                onSubmit={
                  handleCreateUser
                }
              >

                <div className="modal-grid-2col">

                  <div className="form-field-group">
                    <label className="field-label">
                      Employee ID <span className="req-star">*</span>
                    </label>

                    <input
                      className="form-control-input"
                      name="empID"
                      value={
                        newUser.empID
                      }
                      onChange={
                        handleUserChange
                      }
                      placeholder="EMP001"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">
                      Full Name <span className="req-star">*</span>
                    </label>

                    <input
                      className="form-control-input"
                      name="name"
                      value={
                        newUser.name
                      }
                      onChange={
                        handleUserChange
                      }
                      placeholder="Enter your full name"
                    />
                  </div>

                </div>

                <div className="modal-grid-2col">

                  <div className="form-field-group">
                    <label className="field-label">
                      Email <span className="req-star">*</span>
                    </label>

                    <input
                      type="email"
                      className="form-control-input"
                      name="email"
                      value={
                        newUser.email
                      }
                      onChange={
                        handleUserChange
                      }
                      placeholder="user@stanco.com"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">
                      Designation <span className="req-star">*</span>
                    </label>

                    <select
                      className="form-control-input"
                      name="designation"
                      value={
                        newUser.designation
                      }
                      onChange={
                        handleUserChange
                      }
                    >
                      <option value="">
                        Select Designation
                      </option>
                      {DROPDOWN_DESIGNATIONS.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                <div className="modal-grid-2col">

                  <div className="form-field-group">
                    <label className="field-label">
                      Team <span className="req-star">*</span>
                    </label>

                    <select
                      className="form-control-select"
                      name="team"
                      value={
                        newUser.team
                      }
                      onChange={
                        handleUserChange
                      }
                    >
                      <option value="">
                        Select Team
                      </option>

                      {activeTeams.map(
                        (team) => (
                          <option
                            key={
                              team.id
                            }
                            value={
                              team.name
                            }
                          >
                            {
                              team.name
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="form-field-group"></div>

                </div>

                <div className="mgmt-modal-actions">

                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() =>
                      setShowUserModal(
                        false
                      )
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-modal-save"
                    disabled={
                      creatingUser
                    }
                  >
                    <FaSave />

                    {creatingUser
                      ? "Creating..."
                      : "Create User"}
                  </button>

                </div>

              </form>

            </div>
          </div>
        )}

        {/* =================================================
            UPDATE USER MODAL
        ================================================= */}

        {editingUser && (
          <div
            className="mgmt-modal-backdrop"
            onClick={() =>
              setEditingUser(null)
            }
          >
            <div
              className="mgmt-modal-card"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="mgmt-modal-header">

                <div className="mgmt-modal-title-group">
                  <FaEdit />
                  <h3>
                    Update User
                  </h3>
                </div>

                <button
                  type="button"
                  className="mgmt-modal-close"
                  onClick={() =>
                    setEditingUser(
                      null
                    )
                  }
                >
                  <FaTimes />
                </button>

              </div>

              <form
                className="mgmt-modal-form"
                onSubmit={handleUpdateUser}
              >
                <div className="modal-grid-2col">

                  <div className="form-field-group">
                    <label className="field-label">Employee ID <span className="req-star">*</span></label>
                    <input
                      className="form-control-input"
                      value={editingUser.empID || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          empID: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Name <span className="req-star">*</span></label>
                    <input
                      className="form-control-input"
                      value={editingUser.name || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                </div>

                <div className="modal-grid-2col">

                  <div className="form-field-group">
                    <label className="field-label">Email <span className="req-star">*</span></label>
                    <input
                      type="email"
                      className="form-control-input"
                      value={editingUser.email || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Designation <span className="req-star">*</span></label>
                    <select
                      className="form-control-input"
                      value={editingUser.designation || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          designation: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Designation</option>
                      {DROPDOWN_DESIGNATIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                <div className="modal-grid-2col">

                  <div className="form-field-group">
                    <label className="field-label">Team <span className="req-star">*</span></label>
                    <select
                      className="form-control-select"
                      value={editingUser.team || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          team: e.target.value,
                        })
                      }
                    >
                      <option value="">
                        Select Team
                      </option>

                      {activeTeams.map((team) => (
                        <option
                          key={team.id}
                          value={team.name}
                        >
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Profile Status <span className="req-star">*</span></label>
                    <select
                      className="form-control-input"
                      value={editingUser.profileStatus || "active"}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          profileStatus: e.target.value,
                        })
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                </div>

                <div className="mgmt-modal-actions">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() => setEditingUser(null)}
                    disabled={creatingUser}
                  >
                    <FaTimes />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-modal-save"
                    disabled={creatingUser}
                  >
                    <FaSave />
                    {creatingUser ? "Updating..." : "Update User"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* =================================================
            ADD TEAM MODAL
        ================================================= */}

        {showTeamModal && (
          <div
            className="mgmt-modal-backdrop"
            onClick={() =>
              setShowTeamModal(
                false
              )
            }
          >

            <div
              className="mgmt-modal-card"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="mgmt-modal-header">

                <div className="mgmt-modal-title-group">
                  <FaPlus />
                  <h3>
                    Add New Team
                  </h3>
                </div>

                <button
                  type="button"
                  className="mgmt-modal-close"
                  onClick={() =>
                    setShowTeamModal(
                      false
                    )
                  }
                >
                  <FaTimes />
                </button>

              </div>

              <form
                className="mgmt-modal-form"
                onSubmit={
                  handleAddTeam
                }
              >

                <div className="modal-grid-2col">

                  <div className="form-field-group">
                    <label className="field-label">
                      Team Name <span className="req-star">*</span>
                    </label>

                    <input
                      className="form-control-input"
                      name="name"
                      value={newTeam.name}
                      onChange={handleTeamChange}
                      placeholder="CKPL"
                      autoFocus
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">
                      Status <span className="req-star">*</span>
                    </label>

                    <select
                      className="form-control-select"
                      name="status"
                      value={String(newTeam.status)}
                      onChange={handleTeamChange}
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>

                </div>

                <div className="mgmt-modal-actions">

                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() =>
                      setShowTeamModal(
                        false
                      )
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-modal-save"
                  >
                    <FaCheck />
                    Add Team
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

        {/* =================================================
            UPDATE TEAM MODAL
        ================================================= */}

        {editingTeam && (
          <div
            className="mgmt-modal-backdrop"
            onClick={() =>
              setEditingTeam(null)
            }
          >

            <div
              className="mgmt-modal-card"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="mgmt-modal-header">

                <div className="mgmt-modal-title-group">
                  <FaEdit />
                  <h3>
                    Update Team
                  </h3>
                </div>

                <button
                  type="button"
                  className="mgmt-modal-close"
                  onClick={() =>
                    setEditingTeam(
                      null
                    )
                  }
                >
                  <FaTimes />
                </button>

              </div>

              <form
                className="mgmt-modal-form"
                onSubmit={
                  handleUpdateTeam
                }
              >

                <div className="modal-grid-2col">

                  <div className="form-field-group">
                    <label className="field-label">
                      Team Name <span className="req-star">*</span>
                    </label>

                    <input
                      className="form-control-input"
                      value={editingTeam.name || ""}
                      onChange={(event) =>
                        setEditingTeam({
                          ...editingTeam,
                          name: event.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">
                      Status <span className="req-star">*</span>
                    </label>

                    <select
                      className="form-control-select"
                      value={String(
                        editingTeam.status ?? 1
                      )}
                      onChange={(event) =>
                        setEditingTeam({
                          ...editingTeam,
                          status: Number(
                            event.target.value
                          ),
                        })
                      }
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>

                </div>

                <div className="mgmt-modal-actions">

                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() =>
                      setEditingTeam(
                        null
                      )
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-modal-save"
                  >
                    <FaSave />
                    Update Team
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