import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode

const ReceiverDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [location, setLocation] = useState({ lat: null, lon: null });

  // Get logged-in user's name from JWT token
  let userName = "Receiver";
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
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLocation({ lat, lon });

        console.log(`Receiver's Coordinates: Latitude: ${lat}, Longitude: ${lon}`);

        // Fetch nearby donations
        axios
          .get(`http://localhost:5000/api/donations/near?lat=${lat}&lon=${lon}&radius=5000`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            console.log("Nearby Donations:", response.data);
            // Remove duplicate donations by _id
            const uniqueDonations = response.data.filter((donation, index, self) =>
              index === self.findIndex((d) => d._id === donation._id)
            );
            setDonations(uniqueDonations);
          })
          .catch((error) => {
            console.error(
              "Error fetching donations:",
              error.response ? error.response.data : error.message
            );
          });
      },
      (error) => console.error("Error fetching location:", error)
    );
  }, []);

  // Accept a donation and update its status to "matched"
  const handleAcceptDonation = (donationId) => {
    axios
      .put(
        `http://localhost:5000/api/donations/${donationId}`,
        { status: "matched" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        alert("Donation accepted successfully!");
        // Update donation list with the new status
        setDonations((prevDonations) =>
          prevDonations.map((donation) =>
            donation._id === donationId ? { ...donation, status: "matched" } : donation
          )
        );
      })
      .catch((error) => {
        console.error(
          "Error accepting donation:",
          error.response ? error.response.data : error.message
        );
      });
  };

  return (
    <div>
      <h1>Receiver Dashboard</h1>
      <LogoutButton />
      <p>Welcome, {userName}! Explore available donations near you:</p>
      <p>
        Your Coordinates: <strong>Lat:</strong> {location.lat} | <strong>Lon:</strong> {location.lon}
      </p>
      {donations.length === 0 ? (
        <p>No available donations nearby.</p>
      ) : (
        <ul>
          {donations.map((donation) => (
            <li key={donation._id}>
              <strong>{donation.foodDetails.foodType}</strong>: {donation.foodDetails.description} <br />
              Quantity: {donation.foodDetails.quantity} | Status: {donation.status} <br />
              Pickup: {donation.pickupLocation.address} <br />
              {donation.status === "pending" && (
                <button onClick={() => handleAcceptDonation(donation._id)}>
                  Accept Donation
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReceiverDashboard;
