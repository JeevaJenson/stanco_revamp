import React from "react";
import "./DMSidebar.css";

function DMSidebar() {
  return (
    <div className="dm-sidebar">

     <div className="prohire-logo">

  <div className="prohire-icon">
    <span className="green-shape"></span>
    <span className="blue-shape"></span>
  </div>

  <div className="prohire-text">
    <div className="prohire-name">Pro Hire</div>
    <div className="prohire-tagline">Help People Help</div>
  </div>

</div>

      <div className="admin-section">
        <div className="admin-icon">●</div>

        <div>
          <h3>HEPL ADMIN</h3>
          <p>HEPL Admin</p>
        </div>
      </div>

      <div className="menu">

       <div className="menu-item">
  ✎ <span>Allocation List</span>
</div>

<div className="menu-item">
  ♙ <span>Candidate Database</span>
</div>

<div className="menu-item">
  ▤ <span>Allocation Report</span>
</div>

<div className="menu-item">
  ▤ <span>Recruiter Report</span>
</div>

<div className="menu-item">
  ♙ <span>User List</span>
</div>
       
      </div>

    </div>
  );
}

export default DMSidebar;