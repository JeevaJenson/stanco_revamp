import React from "react";
import "../style/LogoutModal.css";

function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="logout-modal-overlay" onClick={onClose}>
      <div className="logout-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="logout-icon-container">
          <div className="logout-exclamation-circle">
            <svg viewBox="0 0 24 24" className="exclamation-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <h3 className="logout-modal-title">Are you leaving?</h3>
        <p className="logout-modal-text">
          Are you sure want to log out? All your unsaved data will be lost.
        </p>
        <div className="logout-modal-actions">
          <button className="logout-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="logout-btn-confirm" onClick={onConfirm}>
            Yes <span className="arrow-icon">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
