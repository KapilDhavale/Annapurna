import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import logo_dark from "../images/logo_dark.png";
import { FaBell } from "react-icons/fa";
import NgoDashboard from "./NgoDashboard"; // NGO location cards component
import AnalysisLineBarCharts from "../components/AnalysisLineBarCharts"; // New charts component
import AnalysisPieChartRestaurant from "../components/AnalysisPieCartRestaurant"; // New pie chart component
import { fakeNgoData } from "../data/ngodata"; // Common NGO data

const AdminDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState(null);

  // Fetch donations (or use fake data for donations if API is unavailable)
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/donations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
  }, []);

  return (
    <div>
      {/* Navbar Section */}
      <nav className="navbar">
        <div className="nav-left">
          <img
            src={logo_dark}
            alt="Logo"
            className="logo"
            style={{ width: "100px", height: "auto" }}
          />
          <span>Admin Dashboard</span>
        </div>
        <div className="nav-icons">
          <FaBell className="icon" />
        </div>
      </nav>

      <LogoutButton />
      <h1>Admin Dashboard</h1>
      <p>Overview of all donations:</p>
      {donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <ul>
          {donations.map((donation) => (
            <li key={donation._id}>
              <strong>{donation.foodDetails.foodType}</strong> - {donation.foodDetails.description} <br />
              Quantity: {donation.foodDetails.quantity} | Status: {donation.status} <br />
              Donor: {donation.donor?.username || "N/A"} | Pickup: {donation.pickupLocation.address} <br />
              Receiver: {donation.receiver?.name} | Contact: {donation.receiver?.contact}
            </li>
          ))}
        </ul>
      )}

      {/* NGO Locations Section */}
      <h2>NGO Locations</h2>
      <div className="ngo-bars">
        {fakeNgoData.map((ngo, index) => (
          <div
            key={index}
            className="ngo-bar"
            onClick={() => setSelectedNgo(ngo)}
          >
            <div className="ngo-info">
              <div className="ngo-name">{ngo.ngoName}</div>
              <div className="ngo-location">{ngo.location}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Display selected NGO details */}
      {selectedNgo && (
        <div className="ngo-details">
          <h2>{selectedNgo.ngoName}</h2>
          <p>
            <strong>Location:</strong> {selectedNgo.location}
          </p>
          <p>
            <strong>Number of Restaurants:</strong> {selectedNgo.restaurants.length}
          </p>

          <div>
            {/* Right side: Charts */}
            <div className="details-right">
              <AnalysisLineBarCharts
                restaurants={selectedNgo.restaurants}
                measure="donationCount" // Change to "quantity" if needed
                title="Restaurant Donation Count Distribution"
              />
              <AnalysisPieChartRestaurant
                restaurants={selectedNgo.restaurants}
                measure="donationCount" // You can change this to "quantity" if desired
                title="Restaurant Donation Count Distribution"
              />
            </div>
          </div>

          <div className="details-container" style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
            
            {/* Left side: Restaurant Cards */}
            <div className="details-left">
              <h3>Restaurants:</h3>
              <div className="restaurant-cards">
                {selectedNgo.restaurants.map((restaurant, i) => (
                  <div key={i} className="restaurant-card">
                    <p><strong>Name:</strong> {restaurant.name}</p>
                    <p><strong>Location:</strong> {restaurant.location}</p>
                    <p><strong>Donation:</strong> {restaurant.donation}</p>
                    <p><strong>Quantity:</strong> {restaurant.quantity}</p>
                    <p><strong>No. of Donations:</strong> {restaurant.donationCount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
