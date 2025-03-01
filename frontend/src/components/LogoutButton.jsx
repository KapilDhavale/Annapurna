import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Clears entire localStorage
    console.log("LocalStorage cleared:", localStorage); // Logs to verify if it's empty
    navigate("/login"); // Redirects to login page
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
