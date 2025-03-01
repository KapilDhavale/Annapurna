import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase(), password }), // ✅ Convert email to lowercase
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        const decoded = jwtDecode(data.token);
        console.log("Decoded token:", decoded);
        login(data.token);

        if (decoded.role === "provider") {
          navigate("/provider-dashboard");
        } else if (decoded.role === "receiver") {
          navigate("/receiver-dashboard");
        } else if (decoded.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          setError("Unauthorized user role");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during login.");
    }
  };

  return (
     <div className="login">
      <div id="anna">LOGIN</div>
      <div className="login-overlay"></div>
      <form id="login-form" onSubmit={handleLogin}>
        <div className="form-content">
          <div className="input-container">
            <label id="login-label">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <label id="login-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="alert">{error}</p>}
        </div>
        <button id="login-btn" type="submit">Login</button>
        <p id="registerPrompt">
          Don't have an account?{" "}
          <button type="button" id="link-button-login" onClick={() => navigate("/register")}>
            Register here
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
