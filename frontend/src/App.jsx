import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    console.log("Username:", username);
    console.log("Password:", password);

    // API call can be added here
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* Logo */}
        <div className="logo-section">
          <div className="logo-text">
            <span className="pro">Pro</span>
            <span className="hire">Hire</span>
          </div>

          <div className="tagline">
            Right Person Right Job
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>

          {/* Username */}
          <div className="input-box">
            <FaUser className="input-icon" />

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="input-box">
            <FaLock className="input-icon" />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <button type="submit" className="login-button">
            Log in
          </button>

        </form>

      </div>

    </div>
  );
}

export default App;

