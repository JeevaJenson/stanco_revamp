import { useEffect, useState} from "react";

import { useNavigate,useLocation} from "react-router-dom";

import {
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
  FaChevronRight,
  FaBars,
  FaTimes} from "react-icons/fa";

import LogoutModal from "./LogoutModal";

import "../style/Sidebar.css";


function Sidebar() {

  const navigate = useNavigate();

  const location = useLocation();


  // =====================================================
  // USER MANAGEMENT ROUTES
  // =====================================================

  const userManagementRoutes = [

    "/users",

    "/teams",

    "/business-units",

    "/departments",

    "/user-management",

    "/verticals"

  ];


  // =====================================================
  // CHECK USER MANAGEMENT ACTIVE
  // =====================================================

  const isUserMgmtActive =
    userManagementRoutes.some(
      (route) =>

        location.pathname === route ||

        location.pathname.startsWith(
          `${route}/`
        )
    );


  // =====================================================
  // STATES
  // =====================================================

  const [userMgmtOpen, setUserMgmtOpen] =
    useState(isUserMgmtActive);


  const [mobileOpen, setMobileOpen] =
    useState(false);


  const [showLogoutModal, setShowLogoutModal] =
    useState(false);


  // =====================================================
  // KEEP USER MANAGEMENT OPEN
  // =====================================================

  useEffect(() => {

    if (isUserMgmtActive) {

      setUserMgmtOpen(true);

    }

  }, [isUserMgmtActive]);


  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleNavigate = (path) => {

    navigate(path);

    setMobileOpen(false);

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleSignOut = () => {

    setShowLogoutModal(true);

  };


  const handleLogoutConfirm = () => {

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    setShowLogoutModal(false);

    navigate("/");

  };


  // =====================================================
  // EXACT ACTIVE ROUTE
  // =====================================================

  const isActive = (path) => {

    return location.pathname === path;

  };


  // =====================================================
  // DEPARTMENT ACTIVE
  // =====================================================

  const isDepartmentActive =

    location.pathname === "/departments"

    ||

    location.pathname.startsWith(
      "/departments/"
    )

    ||

    location.pathname.startsWith(
      "/verticals/"
    );


  // =====================================================
  // COMPONENT
  // =====================================================

  return (

    <>

      {/* =================================================
          MOBILE MENU BUTTON
      ================================================= */}

      <button
        type="button"
        className="sidebar-mobile-toggle"
        onClick={() =>
          setMobileOpen(
            (previous) => !previous
          )
        }
        aria-label="Toggle Sidebar Navigation"
      >

        {mobileOpen ? (

          <FaTimes size={18} />

        ) : (

          <FaBars size={18} />

        )}

      </button>


      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {mobileOpen && (

        <div
          className="sidebar-mobile-overlay"
          onClick={() =>
            setMobileOpen(false)
          }
        />

      )}


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`dm-sidebar ${
          mobileOpen
            ? "mobile-open"
            : ""
        }`}
      >


        {/* =================================================
            TOP SECTION
        ================================================= */}

        <div className="sidebar-top-section">


          {/* =================================================
              BRAND
          ================================================= */}

          <div
            className="sidebar-brand-header"
            onClick={() =>
              handleNavigate("/dashboard")
            }
            title="proHire"
          >

            <div className="brand-logo-icon">

              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >

                <rect
                  x="3"
                  y="6"
                  width="18"
                  height="15"
                  rx="3"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                />

                <path
                  d="M8 6V4.5C8 3.67157 8.67157 3 9.5 3H14.5C15.3284 3 16 3.67157 16 4.5V6"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                />

                <path
                  d="M8 13.5L10.5 16L16 10"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

              </svg>

            </div>


            <div className="brand-name-styled">

              <span className="brand-pro">
                pro
              </span>

              <span className="brand-hire">
                Hire
              </span>

            </div>

          </div>


          {/* =================================================
              NAVIGATION
          ================================================= */}

          <nav className="sidebar-nav-menu">


            {/* =================================================
                DASHBOARD
            ================================================= */}

            <div
              className={`sidebar-menu-item ${
                isActive("/dashboard")
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleNavigate("/dashboard")
              }
            >

              <FaHome className="nav-icon" />

              <span>
                Dashboard
              </span>

            </div>


            {/* =================================================
                USER MANAGEMENT
            ================================================= */}

            <div className="sidebar-accordion-group">


              {/* USER MANAGEMENT HEADER */}

              <div
                className={`sidebar-menu-item has-submenu ${
                  isUserMgmtActive
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setUserMgmtOpen(
                    (previous) =>
                      !previous
                  )
                }
              >

                <div className="item-label-content">

                  <FaUsers className="nav-icon" />

                  <span>
                    User Management
                  </span>

                </div>


                <span className="accordion-chevron">

                  {userMgmtOpen ? (

                    <FaChevronDown
                      size={11}
                    />

                  ) : (

                    <FaChevronRight
                      size={11}
                    />

                  )}

                </span>

              </div>


              {/* =================================================
                  USER MANAGEMENT SUBMENU
              ================================================= */}

              {userMgmtOpen && (

                <div className="sidebar-submenu-list">


                  {/* =================================================
                      USERS
                  ================================================= */}

                  <div
                    className={`sidebar-submenu-item ${
                      isActive("/users") ||
                      isActive(
                        "/user-management"
                      )
                        ? "sub-active"
                        : ""
                    }`}
                    onClick={() =>
                      handleNavigate(
                        "/users"
                      )
                    }
                  >

                    <FaUser className="sub-nav-icon" />

                    <span>
                      Users
                    </span>

                  </div>


                  {/* =================================================
                      TEAMS
                  ================================================= */}

                  <div
                    className={`sidebar-submenu-item ${
                      isActive("/teams")
                        ? "sub-active"
                        : ""
                    }`}
                    onClick={() =>
                      handleNavigate(
                        "/teams"
                      )
                    }
                  >

                    <FaUserFriends className="sub-nav-icon" />

                    <span>
                      Teams
                    </span>

                  </div>


                  {/* =================================================
                      BUSINESS UNIT
                  ================================================= */}

                  <div
                    className={`sidebar-submenu-item ${
                      isActive(
                        "/business-units"
                      )
                        ? "sub-active"
                        : ""
                    }`}
                    onClick={() =>
                      handleNavigate(
                        "/business-units"
                      )
                    }
                  >

                    <FaBuilding className="sub-nav-icon" />

                    <span>
                      Business Unit
                    </span>

                  </div>


                  {/* =================================================
                      DEPARTMENT
                  ================================================= */}

                  <div
                    className={`sidebar-submenu-item ${
                      isDepartmentActive
                        ? "sub-active"
                        : ""
                    }`}
                    onClick={() =>
                      handleNavigate(
                        "/departments"
                      )
                    }
                  >

                    <FaSitemap className="sub-nav-icon" />

                    <span>
                      Department
                    </span>

                  </div>


                </div>

              )}

            </div>


            {/* =================================================
                ALLOCATION LIST
            ================================================= */}

            <div
              className={`sidebar-menu-item ${
                isActive(
                  "/allocation-list"
                )
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleNavigate(
                  "/allocation-list"
                )
              }
            >

              <FaListAlt className="nav-icon" />

              <span>
                Allocation List
              </span>

            </div>


            {/* =================================================
                CANDIDATE DATABASE
            ================================================= */}

            <div
              className={`sidebar-menu-item ${
                isActive(
                  "/candidate-database"
                )
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleNavigate(
                  "/candidate-database"
                )
              }
            >

              <FaDatabase className="nav-icon" />

              <span>
                Candidate Database
              </span>

            </div>


            {/* =================================================
                ALLOCATION REPORT
            ================================================= */}

            <div
              className={`sidebar-menu-item ${
                isActive(
                  "/allocation-report"
                )
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleNavigate(
                  "/allocation-report"
                )
              }
            >

              <FaChartPie className="nav-icon" />

              <span>
                Allocation Report
              </span>

            </div>


            {/* =================================================
                RECRUITER REPORT
            ================================================= */}

            <div
              className={`sidebar-menu-item ${
                isActive(
                  "/recruiter-report"
                )
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleNavigate(
                  "/recruiter-report"
                )
              }
            >

              <FaChartLine className="nav-icon" />

              <span>
                Recruiter Report
              </span>

            </div>


          </nav>

        </div>


        {/* =================================================
            SIGN OUT
        ================================================= */}

        <div className="sidebar-bottom-section">

          <div
            className="sidebar-menu-item signout-item"
            onClick={
              handleSignOut
            }
          >

            <FaSignOutAlt className="nav-icon" />

            <span>
              Sign Out
            </span>

          </div>

        </div>


      </aside>


      {/* =================================================
          LOGOUT MODAL
      ================================================= */}

      <LogoutModal
        isOpen={
          showLogoutModal
        }
        onClose={() =>
          setShowLogoutModal(
            false
          )
        }
        onConfirm={
          handleLogoutConfirm
        }
      />

    </>

  );

}


export default Sidebar;