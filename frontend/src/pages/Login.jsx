import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";

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
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Login</button>
      </form>

      <p>Don't have an account?</p>
      <button onClick={() => navigate("/register")} style={{ marginTop: "10px" }}>
        Register Here
      </button>
    </div>
  );
};

export default Login;
