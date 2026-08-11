import React from "react";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">

      <h2 className="allocation-title">
        Allocation List
      </h2>

      <div className="top-section">

        <button className="create-rfh">
          + Create Temp RFH
        </button>

        <div className="last-rfh">
          <span>Last Allocated Form No</span>
          <strong>TRFH-0001</strong>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;