// frontend/src/pages/ProviderDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import {jwtDecode} from "jwt-decode"; // Fixed import; no destructuring needed
import { FaBell, FaUserCircle } from "react-icons/fa";
import logo_dark from "../images/logo_dark.png";
import donation from "../images/donation.jpg";
import "./ProviderDashboard.css";

const ProviderDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [formData, setFormData] = useState({
    foodType: "",
    description: "",
    quantity: "",
    expiryDate: "",
    packaged: false,
    address: "",
    latitude: "",
    longitude: "",
  });
  // State for profile dropdown
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigate = useNavigate();

  // Decode token to get username
  let userName = "Provider";
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userName = decoded.username || userName;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/donations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setDonations(response.data);
      })
      .catch((error) => {
        console.error(
          "Error fetching donations:",
          error.response ? error.response.data : error.message
        );
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const donationData = {
      foodDetails: {
        foodType: formData.foodType,
        description: formData.description,
        quantity: parseInt(formData.quantity, 10),
        expiryDate: formData.expiryDate,
        packaged: formData.packaged,
      },
      pickupLocation: {
        type: "Point",
        coordinates: [
          parseFloat(formData.longitude),
          parseFloat(formData.latitude),
        ],
        address: formData.address,
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/donations",
        donationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Append new donation to list
      setDonations([...donations, response.data]);
      setFormData({
        foodType: "",
        description: "",
        quantity: "",
        expiryDate: "",
        packaged: false,
        address: "",
        latitude: "",
        longitude: "",
      });
    } catch (error) {
      console.error(
        "Error creating donation:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div>
      {/* Navbar Section */}
      <nav className="navbar">
        <div className="nav-left">
          <img src={logo_dark} alt="Logo" className="logo" />
        </div>
        {/* Right Side - Icons and Buttons */}
        <div className="nav-icons">
          <button
            id="create-campaign-btn"
            className="nav-button create-campaign-button"
            onClick={() => navigate("/campaign")}
          >
            Create Campaign
          </button>
          <button
            id="ongoing-campaign-btn"
            className="nav-button ongoing-campaigns-button"
            onClick={() => navigate("/ongoing-campaigns")}
          >
            Ongoing Campaigns
          </button>
          <FaBell className="icon" />
          <div className="profile-dropdown-container">
            <FaUserCircle
              className="icon"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
            />
            {profileDropdownOpen && (
              <div className="profile-dropdown">
                <LogoutButton />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Content Section with Background Image and Overlay */}
      <div className="content-container">
        <img src={donation} alt="Background" className="image" />
        <div className="overlay">
          <div id="provider-main">
         <p>
  Welcome, <span className="highlighted-text">{userName}</span>! Manage your donations below:
</p>


          <h2>Create a Donation</h2>
          <form onSubmit={handleSubmit} className="donation-form">
            <input
              type="text"
              name="foodType"
              placeholder="Food Type"
              value={formData.foodType}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />
            <label className="packaged-label">
              <input
                type="checkbox"
                name="packaged"
                checked={formData.packaged}
                onChange={handleChange}
              />
              Packaged
            </label>
            <input
              type="text"
              name="address"
              placeholder="Pickup Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="latitude"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="longitude"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
            />
            <button type="submit">Create Donation</button>
          </form>
          </div>
        </div>
      </div>

      {/* My Donations Section */}
      {/* My Donations Section */}
<div className="donations-container">
  <h1>My Donations</h1>
  {donations.length === 0 ? (
    <p>No donations found. Create a donation to get started.</p>
  ) : (
    <ul className="donation-list">
      {[...donations]
        .sort((a, b) => {
          // Sort so that available donations (status "pending") appear on top.
          if (a.status === "pending" && b.status !== "pending") return -1;
          if (a.status !== "pending" && b.status === "pending") return 1;
          return 0;
        })
        .map((donation) => {
          const statusClass =
            donation.status === "pending" ? "available" : "collected";
          const statusLabel =
            donation.status === "pending" ? "AVAILABLE" : "COLLECTED";
          return (
            <li key={donation._id} className={`donation-item ${statusClass}`}>
              <div className="donation-info">
                <h3>{donation.foodDetails.foodType}</h3>
                <p>{donation.foodDetails.description}</p>
                <p>
                  <strong>Quantity:</strong> {donation.foodDetails.quantity}
                </p>
                <p>
                  <strong>Status:</strong> {statusLabel}
                </p>
                <p>
                  <strong>Pickup:</strong> {donation.pickupLocation.address}
                </p>
              </div>
            </li>
          );
        })}
    </ul>
  )}
</div>

    </div>
  );
};

export default ProviderDashboard;
