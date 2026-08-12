import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import DMSidebar from "../DMSidebar";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-layout">
      <DMSidebar />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-title">
            <h2>Welcome back{user.name ? `, ${user.name}` : ""}!</h2>
            <p>Employee ID: {user.empID || "EMP-001"} | Role: {user.roleType || "Admin"}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <div className="dashboard-body">
          <div className="top-section">
            <button
              className="create-rfh"
              onClick={() => navigate("/rfh/create")}
            >
              + Create Temp RFH
            </button>
            <div className="last-rfh">
              <span>Last Allocated Form No</span>
              <strong>TRFH-0001</strong>
            </div>
          </div>

          <div className="dashboard-cards-grid">
            <div className="dash-card">
              <h3>Allocation Overview</h3>
              <p className="metric">12</p>
              <span className="subtext">Active Allocations</span>
            </div>
            <div className="dash-card">
              <h3>Candidates</h3>
              <p className="metric">48</p>
              <span className="subtext">In Pipeline</span>
            </div>
            <div className="dash-card">
              <h3>Pending Actions</h3>
              <p className="metric">3</p>
              <span className="subtext">Requires Review</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
