// frontend/src/pages/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // Optional: add CSS for styling

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Annapurna</h1>
        <p>Reducing Food Waste & Managing Surplus Food</p>
      </header>
      
      <section className="landing-hero">
        {/* Replace with an actual image URL or import an image */}
        <img 
          src="https://via.placeholder.com/600x300?text=Delicious+Food" 
          alt="Delicious Food" 
          className="hero-image"
        />
        <div className="hero-text">
          <h2>Welcome to Annapurna</h2>
          <p>
            Join us in our mission to transform surplus food into meals for those in need.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn">Sign Up</Link>
            <Link to="/login" className="btn">Login</Link>
          </div>
        </div>
      </section>
      
      <section className="landing-features">
        <h2>Our Features</h2>
        <ul>
          <li>Role-Based Access Control (RBAC)</li>
          <li>Food Donation Management</li>
          <li>Real-Time SMS Notifications</li>
          <li>Geolocation Based Search</li>
        </ul>
      </section>
      
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} Annapurna. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
