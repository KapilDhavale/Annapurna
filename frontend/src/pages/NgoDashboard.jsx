import React, { useState } from "react";
import "./NgoDashboard.css"; // Your CSS file
import { fakeNgoData } from "../data/ngodata"; // Adjust path if needed

const NgoDashboard = () => {
  const [selectedNgo, setSelectedNgo] = useState(null);

  return (
    <div className="ngo-dashboard">
      <h1>NGO Dashboard</h1>
      <p>Click on any NGO to see its details.</p>

      {/* Display each NGO as a clickable bar */}
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
      )}
    </div>
  );
};

export default NgoDashboard;
