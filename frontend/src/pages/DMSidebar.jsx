import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaApple,
  FaHome,
  FaUsers,
  FaUser,
  FaUserFriends,
  FaBuilding,
  FaSitemap,
  FaListAlt,
  FaDatabase,
  FaChartPie,
  FaChartLine,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight
} from "react-icons/fa";
import "../style/DMSidebar.css";

function DMSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isUserMgmtActive =
    location.pathname === "/users" ||
    location.pathname === "/teams" ||
    location.pathname === "/user-management";

  const [userMgmtOpen, setUserMgmtOpen] = useState(isUserMgmtActive);

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <aside className="dm-sidebar">
      <div className="sidebar-top-section">
        {/* Brand Header */}
        <div
          className="sidebar-brand-header"
          onClick={() => navigate("/dashboard")}
          title="proHire"
        >
          <div className="brand-logo-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="6" width="18" height="15" rx="3" stroke="#ffffff" strokeWidth="2.2" />
              <path d="M8 6V4.5C8 3.67157 8.67157 3 9.5 3H14.5C15.3284 3 16 3.67157 16 4.5V6" stroke="#ffffff" strokeWidth="2.2" />
              <path d="M8 13.5L10.5 16L16 10" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="brand-name-styled">
            <span className="brand-pro">pro</span>
            <span className="brand-hire">Hire</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav-menu">
          {/* Dashboard */}
          <div
            className={`sidebar-menu-item ${location.pathname === "/dashboard" ? "active" : ""}`}
            onClick={() => navigate("/dashboard")}
          >
            <FaHome className="nav-icon" />
            <span>Dashboard</span>
          </div>

          {/* User Management Accordion */}
          <div className="sidebar-accordion-group">
            <div
              className={`sidebar-menu-item has-submenu ${isUserMgmtActive ? "active" : ""}`}
              onClick={() => setUserMgmtOpen(!userMgmtOpen)}
            >
              <div className="item-label-content">
                <FaUsers className="nav-icon" />
                <span>User Management</span>
              </div>
              <span className="accordion-chevron">
                {userMgmtOpen ? <FaChevronDown size={11} /> : <FaChevronRight size={11} />}
              </span>
            </div>

            {userMgmtOpen && (
              <div className="sidebar-submenu-list">
                <div
                  className={`sidebar-submenu-item ${location.pathname === "/users" || location.pathname === "/user-management" ? "sub-active" : ""}`}
                  onClick={() => navigate("/users")}
                >
                  <FaUser className="sub-nav-icon" />
                  <span>Users</span>
                </div>

                <div
                  className={`sidebar-submenu-item ${location.pathname === "/teams" ? "sub-active" : ""}`}
                  onClick={() => navigate("/teams")}
                >
                  <FaUserFriends className="sub-nav-icon" />
                  <span>Teams</span>
                </div>

                <div
                  className="sidebar-submenu-item"
                  onClick={() => navigate("/users")}
                >
                  <FaBuilding className="sub-nav-icon" />
                  <span>Business Unit</span>
                </div>

                <div
                  className="sidebar-submenu-item"
                  onClick={() => navigate("/users")}
                >
                  <FaSitemap className="sub-nav-icon" />
                  <span>Department</span>
                </div>
              </div>
            )}
          </div>

          {/* Allocation List */}
          <div
            className={`sidebar-menu-item ${location.pathname === "/allocation-list" ? "active" : ""}`}
            onClick={() => navigate("/dashboard")}
          >
            <FaListAlt className="nav-icon" />
            <span>Allocation List</span>
          </div>

          {/* Candidate Database */}
          <div className="sidebar-menu-item">
            <FaDatabase className="nav-icon" />
            <span>Candidate Database</span>
          </div>

          {/* Allocation Report */}
          <div className="sidebar-menu-item">
            <FaChartPie className="nav-icon" />
            <span>Allocation Report</span>
          </div>

          {/* Recruiter Report */}
          <div className="sidebar-menu-item">
            <FaChartLine className="nav-icon" />
            <span>Recruiter Report</span>
          </div>
        </nav>
      </div>

      {/* Bottom Pinned Sign Out Section */}
      <div className="sidebar-bottom-section">
        <div className="sidebar-menu-item signout-item" onClick={handleSignOut}>
          <FaSignOutAlt className="nav-icon" />
          <span>Sign Out</span>
        </div>
      </div>
    </aside>
  );
}

export default DMSidebar;