import { useState, useEffect } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import loginHeroImg from "../assets/login-hero.png";
import "../style/login.css";

function Login() {
  const [employeeID, setEmployeeID] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success" | "error", message: string }

  const navigate = useNavigate();

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
      showToast("error", "Employee ID and Password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        empID: employeeID.trim(),
        password: password,
        rememberMe: rememberMe
      });

      console.log("Login response:", response.data);

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      {

        showToast("success", "Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }


    } catch (error) {
      console.error("Error occurred while logging in:", error);
      let msg = "Invalid Employee ID or Password";
      if (!error.response) {
        msg = "Cannot connect to server. Please ensure backend is running on port 8080.";
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
      {/* Toast Notifications */}
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

      {/* Split-Card Container */}
      <div className="login-card-container">
        {/* Left Side: Full Hero Image */}
        <div className="illustration-section">
          <img
            src={loginHeroImg}
            alt="Job Portal Illustration"
            className="hero-image"
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="form-section">
          <div className="form-header">
            <h1 className="form-title">Login</h1>
          </div>

          <form onSubmit={handleLogin} className="login-form-body">
            {/* Employee ID Field */}
            <div className="input-group">
              <label htmlFor="employeeID" className="input-floating-label">
                Employee ID
              </label>
              <div className="input-wrapper">
                <input
                  id="employeeID"
                  type="text"
                  className="modern-input"
                  placeholder="e.g. EMP001"
                  value={employeeID}
                  onChange={(e) => setEmployeeID(e.target.value)}
                  autoComplete="username"
                  required
                />
                <FaUser className="field-icon" />
              </div>
            </div>

            {/* Password Field */}
            <div className="input-group">
              <label htmlFor="password" className="input-floating-label">
                Password
              </label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="modern-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="remember-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember</span>
              </label>

              <button
                type="button"
                className="forgot-password-link"
                onClick={() => showToast("error", "Please contact HR / Administrator to reset your password.")}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading-state">
                  <span className="spinner"></span>
                  <span>LOGGING IN...</span>
                </span>
              ) : (
                "LOG IN"
              )}
            </button>

            {/* Create Account Link */}
            <div className="create-account-text">
              Don't have an account?{" "}
              <a
                href="#admin"
                onClick={(e) => {
                  e.preventDefault();
                  showToast("error", "Employee registration is handled by administrator.");
                }}
              >
                Create an account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;