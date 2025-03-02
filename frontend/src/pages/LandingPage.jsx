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
          <button className="nav-button" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>

        {/* Mobile Menu (if needed) */}
        {menuOpen && (
          <div className="mobile-menu">
            <button onClick={() => navigate("/home")}>Home</button>
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button onClick={() => navigate("/login")}>Log Out</button>
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

      {/* Features Section */}
      <section id="features">
        <div id="feature-head">FEATURES</div>
        <div className="feature-grid">
          <div className="feature-box">
            <img
              src="/secure-img.png"
              alt="Real-Time Donation Tracking"
              className="feature-icon"
            />
            Real-Time Donation Tracking
          </div>
          <div className="feature-box">
            <img
              src="/integrity-bg.png"
              alt="Verified Beneficiary Network"
              className="feature-icon"
            />
            Verified Beneficiary Network
          </div>
          <div className="feature-box">
            <img
              src="/user-access-img.png"
              alt="Secure Payment Integration"
              className="feature-icon"
            />
            Secure Payment Integration
          </div>
          <div className="feature-box">
            <img
              src="/transparency-img.png"
              alt="Automated Matching System"
              className="feature-icon"
            />
            Automated Matching System
          </div>
          <div className="feature-box">
            <img
              src="/doc-retrieval-img.png"
              alt="Impact Reporting & Analytics"
              className="feature-icon"
            />
            Impact Reporting & Analytics
          </div>
          <div className="feature-box">
            <img
              src="/ethereum-security-img.png"
              alt="User-Friendly Interface"
              className="feature-icon"
            />
            User-Friendly Interface
          </div>
        </div>

        {/* Maps Section */}
        <div className="map-container">
          <iframe
            title="Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345096867!2d144.9537353153177!3d-37.81627927975166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5774c0f2f2f2f2f!2sMelbourne%20Central!5e0!3m2!1sen!2sau!4v1617739802348!5m2!1sen!2sau"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

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
