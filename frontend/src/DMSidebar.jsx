import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronRight,
  FaUserFriends,
  FaBuilding,
  FaSitemap,
  FaUser,
  FaListAlt,
  FaDatabase,
  FaChartPie,
  FaChartLine,
  FaUsersCog
} from "react-icons/fa";
import "./DMSidebar.css";

function DMSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [userMgmtOpen, setUserMgmtOpen] = useState(true);
  const [activeSubItem, setActiveSubItem] = useState("users");

  const handleSubItemClick = (subItemKey, path) => {
    setActiveSubItem(subItemKey);
    if (path) {
      navigate(path);
    }
  };

  return (
    <aside className="dm-sidebar">
      {/* Brand Header */}
      <div
        className="sidebar-brand-header"
        onClick={() => navigate("/dashboard")}
        style={{ cursor: "pointer" }}
      >
        <div className="brand-logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="6" width="18" height="15" rx="3" stroke="#2563eb" strokeWidth="2.2" />
            <path d="M8 6V4.5C8 3.67157 8.67157 3 9.5 3H14.5C15.3284 3 16 3.67157 16 4.5V6" stroke="#2563eb" strokeWidth="2.2" />
            <path d="M8 13.5L10.5 16L16 10" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="brand-text-block">
          <div className="brand-name">
            pro<span className="brand-accent">Hire</span>
          </div>
          <div className="brand-tagline">Right Person Right Job</div>
        </div>
      </div>

      {/* Admin Profile Section */}
      <div className="sidebar-user-card">
        <div className="user-avatar-circle">
          <span>{user.name ? user.name.charAt(0).toUpperCase() : "A"}</span>
        </div>

        <div className="user-details">
          <h3 className="user-name">{user.name || "HEPL ADMIN"}</h3>
          <p className="user-role">{user.roleType || "Super Admin"}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav-menu">
        <div
          className={`sidebar-menu-item ${location.pathname === "/dashboard" ? "active" : ""}`}
          onClick={() => navigate("/dashboard")}
        >
          <FaListAlt className="nav-icon" />
          <span>Allocation List</span>
        </div>

        <div className="sidebar-menu-item">
          <FaDatabase className="nav-icon" />
          <span>Candidate Database</span>
        </div>

        <div className="sidebar-menu-item">
          <FaChartPie className="nav-icon" />
          <span>Allocation Report</span>
        </div>

        <div className="sidebar-menu-item">
          <FaChartLine className="nav-icon" />
          <span>Recruiter Report</span>
        </div>

        {/* User Management Accordion */}
        <div className="sidebar-accordion-group">
          <div
            className={`sidebar-menu-item has-submenu ${userMgmtOpen ? "submenu-open" : ""}`}
            onClick={() => setUserMgmtOpen(!userMgmtOpen)}
          >
            <div className="item-label-content">
              <FaUsersCog className="nav-icon" />
              <span>User Management</span>
            </div>
            <span className="accordion-chevron">
              {userMgmtOpen ? <FaChevronDown size={11} /> : <FaChevronRight size={11} />}
            </span>
          </div>

          {userMgmtOpen && (
            <div className="sidebar-submenu-list">
              <div
                className={`sidebar-submenu-item ${location.pathname === "/users" || activeSubItem === "users" ? "sub-active" : ""}`}
                onClick={() => handleSubItemClick("users", "/users")}
              >
                <FaUser className="sub-nav-icon" />
                <span>Users</span>
              </div>

              <div
                className={`sidebar-submenu-item ${activeSubItem === "teams" ? "sub-active" : ""}`}
                onClick={() => handleSubItemClick("teams")}
              >
                <FaUserFriends className="sub-nav-icon" />
                <span>Teams</span>
              </div>

              <div
                className={`sidebar-submenu-item ${activeSubItem === "business_unit" ? "sub-active" : ""}`}
                onClick={() => handleSubItemClick("business_unit")}
              >
                <FaBuilding className="sub-nav-icon" />
                <span>Business Unit</span>
              </div>

              <div
                className={`sidebar-submenu-item ${activeSubItem === "department" ? "sub-active" : ""}`}
                onClick={() => handleSubItemClick("department")}
              >
                <FaSitemap className="sub-nav-icon" />
                <span>Department</span>
              </div>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

export default DMSidebar;