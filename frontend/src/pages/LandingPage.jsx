// frontend/src/pages/LandingPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LandingPage.css"; // Update the CSS filename if necessary
import { FaBell } from "react-icons/fa";
import logo_dark from "../images/logo_dark.png";
import hero from "../images/hero.jpg";
import About from "../components/About.jsx";

const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleButtonClick = () => {
    navigate("/login");
  };

  return (
    <div>
      {/* Navbar Section */}
      <nav className="navbar">
        <div className="nav-left">
          <img
            src={logo_dark}
            alt="Logo"
            className="logo"
            style={{ width: "150px", height: "auto" }}
          />
        </div>

        {/* Right Side - Icons and Links */}
        <div className="nav-icons">
          {/* Public link for Ongoing Campaigns */}
          {/* <Link to="/ongoing-campaigns" className="ongoing-campaigns-link">
            Ongoing Campaigns
          </Link> */}
          <FaBell className="icon" />
          <button className="nav-button" onClick={() => navigate("/register")}>
            Register
          </button>
          <button  id="landing-btn" className="nav-button" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>

        {/* Mobile Menu (if needed) */}
        {menuOpen && (
          <div className="mobile-menu">
            <button onClick={() => navigate("/home")}>Home</button>
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button id="landing-btn" onClick={() => navigate("/login")}>Log Out</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="container">
        <img src={hero} alt="homepage" className="image" />
        <div className="home-darkcover">
          <div className="title">
            Serving Hope, 
            <div> One Plate at a Time</div>
          </div>
        </div>
      </div>

      <About />


      {/* Support Center */}
      <section className="support-center">
        <div id="support-head">SUPPORT CENTER</div>
        <div id="support-para">
          Explore our resources or contact us for personalized support
        </div>
        <div className="support-grid">
          <div className="support-box">
            <img
              src="/chat-logo.png"
              alt="Chat Now"
              className="support-icon"
            />
            <h2>Chat Now</h2>
            <p>
              <i>Click to open live chat</i>
            </p>
          </div>
          <div className="support-box">
            <img
              src="/email-logo.png"
              alt="Email Us"
              className="support-icon"
            />
            <h2>Email Us</h2>
            <p>
              <i>Send us a message, and we’ll respond shortly</i>
            </p>
          </div>
          <div className="support-box">
            <img
              src="/faq-img.png"
              alt="Browse FAQs"
              className="support-icon"
            />
            <h2>Browse FAQs</h2>
            <p>
              <i>Get answers to common questions</i>
            </p>
          </div>
          <div className="support-box">
            <img
              src="/call-img.png"
              alt="Call Us"
              className="support-icon"
            />
            <h2>Call Us</h2>
            <p>
              <i>Talk to our support team directly</i>
            </p>
          </div>
        </div>
        <footer className="footer">
          <a href="#">About Us</a>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact Us</a>
        </footer>
      </section>
    </div>
  );
};

export default LandingPage;
