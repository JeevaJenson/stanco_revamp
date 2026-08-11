import { useState, useEffect } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import api from "../services/api";
import "./login.css";

function Login() {
  const [employeeID, setEmployeeID] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success" | "error", message: string }

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setToast(null);

    if (!employeeID.trim() || !password) {
      showToast("error", "Emp ID or Password are required");
      return;
    }

    console.log("Submitting login for Employee ID:", employeeID);
    setLoading(true);

    try {
      const response = await api.post("/login", {
        empID: employeeID.trim(),
        employeeId: employeeID.trim(),
        password: password,
      });

      console.log("Login response:", response.data);

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      showToast("success", "Login successful");

    } catch (error) {
      console.error("Error occurred while logging in:", error);
      let msg = "Emp ID or Password are wrong";
      if (!error.response) {
        msg = "Cannot connect to backend server. Make sure it is running on port 8080.";
      } else if (error.response?.data?.message) {
        msg = error.response.data.message;
      } else if (typeof error.response?.data === "string") {
        msg = error.response.data;
      }
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {toast && (
        <div className="toast-container">
          <div className={`toast-box ${toast.type}`}>
            <span className="toast-message">{toast.message}</span>
            <button
              type="button"
              className="toast-close-btn"
              onClick={() => setToast(null)}
              aria-label="Close notification"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="login-container">

        <div className="logo-section">
          <div className="logo-text">
            <span className="pro">Pro</span>
            <span className="hire">Hire</span>
          </div>

          <div className="tagline">
            Right Person Right Job
          </div>
        </div>

        <form onSubmit={handleLogin}>

          <div className="input-box">
            <FaUser className="input-icon" />

            <input
              type="text"
              placeholder="employee ID"
              value={employeeID}
              onChange={(e) => setEmployeeID(e.target.value)}
            />
          </div>

          <div className="input-box">
            <FaLock className="input-icon" />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;