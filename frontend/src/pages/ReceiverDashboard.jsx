import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";

const ReceiverDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [location, setLocation] = useState({ lat: null, lon: null });

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
            setDonations(response.data);
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

  // Accept a donation
  const handleAcceptDonation = (donationId) => {
    axios
      .put(
        `http://localhost:5000/api/donations/${donationId}`, 
        { status: "matched" }, // Update status to matched
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        alert("Donation accepted successfully!");
        setDonations((prevDonations) =>
          prevDonations.map((donation) =>
            donation._id === donationId ? { ...donation, status: "matched" } : donation
          )
        );
      })
      .catch((error) => {
        console.error("Error accepting donation:", error.response ? error.response.data : error.message);
      });
  };

  return (
    <div>
      <h1>Receiver Dashboard</h1>
      <LogoutButton />
      <p>Welcome, Receiver! Explore available donations near you:</p>
      <p>
        Your Coordinates: <strong>Lat:</strong> {location.lat} | <strong>Lon:</strong> {location.lon}
      </p>
      {donations.length === 0 ? (
        <p>No available donations nearby.</p>
      ) : (
        <ul>
          {donations.map((donation) => (
            <li key={donation._id}>
              <strong>{donation.foodDetails.foodType}</strong>:{" "}
              {donation.foodDetails.description} <br />
              Quantity: {donation.foodDetails.quantity} | Status:{" "}
              {donation.status} <br />
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
