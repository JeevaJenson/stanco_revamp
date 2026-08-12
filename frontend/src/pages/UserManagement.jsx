import { useState, useEffect } from "react";
import {
  FaTrash,
  FaEnvelope,
  FaIdBadge,
  FaBuilding,
  FaUsers,
  FaCheck
} from "react-icons/fa";
import api from "../services/api";
import DMSidebar from "../DMSidebar";
import "./UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // New User Form State: only empid, name, email, department, team
  const [newUser, setNewUser] = useState({
    empID: "",
    name: "",
    email: "",
    department: "",
    team: "",
  });

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load existing users from backend if available
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        if (response.data && Array.isArray(response.data)) {
          setUsers(response.data);
        }
      } catch (err) {
        console.warn("Backend /api/users fetch fallback or offline:", err);
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

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();

    if (!newUser.empID.trim() || !newUser.name.trim() || !newUser.email.trim() || !newUser.department || !newUser.team) {
      showToast("error", "Please fill in all required fields (Emp ID, Name, Email, Dept, Team).");
      return;
    }

    setLoading(true);

    const userPayload = {
      empID: newUser.empID.trim().toUpperCase(),
      name: newUser.name.trim(),
      email: newUser.email.trim().toLowerCase(),
      department: newUser.department,
      team: newUser.team,
      designation: "Team Member",
      roleType: "Team Member",
      password: "Password@123",
      profileStatus: "Active",
      business: "IT Services",
    };

    try {
      // Post to backend API
      const response = await api.post("/users", userPayload).catch((err) => {
        console.warn("API post error (using local state fallback):", err);
        return { data: { ...userPayload, id: Date.now() } };
      });

      const added = response.data || { ...userPayload, id: Date.now() };
      setUsers((prev) => [added, ...prev]);

      showToast("success", `User ${newUser.name} (${newUser.empID}) added successfully!`);

      // Reset form
      setNewUser({
        empID: "",
        name: "",
        email: "",
        department: "",
        team: "",
      });
    } catch (err) {
      console.error("Error creating user:", err);
      showToast("error", "Failed to add user.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (id, userName) => {
    if (window.confirm(`Are you sure you want to remove user "${userName}"?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setSelectedUserIds((prev) => prev.filter((userId) => userId !== id));
      showToast("success", `User "${userName}" removed.`);
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

  return (
    <div className="user-mgmt-layout">
      <DMSidebar />

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

        {/* Top Header Title Banner */}
        <div className="user-form-banner-card">
          <h1 className="user-form-banner-title">USER MANAGEMENT (STANCO)</h1>
        </div>

        {/* Form Container */}
        <div className="user-form-page-wrapper">
          <form onSubmit={handleAddUserSubmit} className="user-rfh-style-form">
            {/* Section 1: Emp ID & Name */}
            <div className="form-band-section">
              <div className="form-grid-2col">
                <div className="form-field-group">
                  <label htmlFor="empID" className="field-label">
                    Employee ID (Emp ID) <span className="req-star">*</span>
                  </label>
                  <input
                    id="empID"
                    type="text"
                    name="empID"
                    className="form-control-input"
                    placeholder="e.g. EMP-1001"
                    value={newUser.empID}
                    onChange={handleInputChange}
                    required
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

            {/* Section 2: Email */}
            <div className="form-band-section">
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
            </div>

            {/* Section 3: Department & Teams */}
            <div className="form-band-section">
              <div className="form-grid-2col">
                <div className="form-field-group">
                  <label htmlFor="department" className="field-label">
                    Department (Dept) <span className="req-star">*</span>
                  </label>
                  <select
                    id="department"
                    name="department"
                    className="form-control-select"
                    value={newUser.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Select Department --</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="IT Operations">IT Operations</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Recruitment">Recruitment</option>
                    <option value="Management">Management</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label htmlFor="team" className="field-label">
                    Teams <span className="req-star">*</span>
                  </label>
                  <select
                    id="team"
                    name="team"
                    className="form-control-select"
                    value={newUser.team}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Select Team --</option>
                    <option value="Frontend Squad">Frontend Squad</option>
                    <option value="Full Stack Team">Full Stack Team</option>
                    <option value="Backend Team">Backend Team</option>
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                    <option value="Recruitment Team">Recruitment Team</option>
                    <option value="HR Operations">HR Operations</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Sales Core">Sales Core</option>
                    <option value="Management Team">Management Team</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Form Submit Button */}
            <div className="form-action-row">
              <button
                type="submit"
                className="btn-form-submit"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>

          {/* Registered Users Section (Box format) */}
          {users.length > 0 && (
            <div className="registered-users-section">
              <div className="section-header-row">
                <h2>Registered Users ({users.length})</h2>
                {selectedUserIds.length > 0 && (
                  <button
                    type="button"
                    className="btn-bulk-delete"
                    onClick={handleBulkDelete}
                  >
                    <FaTrash size={11} /> Delete Selected ({selectedUserIds.length})
                  </button>
                )}
              </div>

              <div className="users-cards-grid">
                {users.map((u) => (
                  <div className={`user-box-card ${selectedUserIds.includes(u.id || u.empID) ? "selected" : ""}`} key={u.id || u.empID}>
                    <div className="user-box-header">
                      <div className="user-box-profile">
                        <label className="card-select-checkbox" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(u.id || u.empID)}
                            onChange={() => handleToggleSelectUser(u.id || u.empID)}
                          />
                          <span className="card-custom-check">
                            {selectedUserIds.includes(u.id || u.empID) && <FaCheck size={8} />}
                          </span>
                        </label>

                        <div
                          className="user-box-avatar"
                          style={{ backgroundColor: getAvatarColor(u.name) }}
                        >
                          {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="user-box-identity">
                          <h3 className="user-box-name">{u.name}</h3>
                          <span className="user-box-empid">
                            <FaIdBadge className="empid-icon" />
                            {u.empID}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-card-delete"
                        title="Delete User"
                        onClick={() => handleDeleteUser(u.id, u.name)}
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="user-box-details">
                      <div className="user-detail-row">
                        <span className="detail-label">
                          <FaBuilding className="detail-icon" />
                          <span>Department</span>
                        </span>
                        <span className="detail-value dept-value">{u.department || "-"}</span>
                      </div>

                      <div className="user-detail-row">
                        <span className="detail-label">
                          <FaUsers className="detail-icon" />
                          <span>Team</span>
                        </span>
                        <span className="detail-value team-value">{u.team || "-"}</span>
                      </div>

                      <div className="user-detail-row">
                        <span className="detail-label">
                          <FaEnvelope className="detail-icon" />
                          <span>Email</span>
                        </span>
                        <a href={`mailto:${u.email}`} className="detail-value email-value" title={u.email}>
                          {u.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserManagement;
