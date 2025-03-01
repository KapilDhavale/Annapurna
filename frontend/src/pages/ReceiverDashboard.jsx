import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";

const ReceiverDashboard = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/donations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const available = response.data.filter(
          (donation) => donation.status === "pending" || donation.status === "matched"
        );
        setDonations(available);
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
      <h1>Receiver Dashboard</h1>
      <LogoutButton /> {/* Reusable Logout Button */}
      <p>Welcome, Receiver! Explore available donations near you:</p>
      {donations.length === 0 ? (
        <p>No available donations at this time.</p>
      ) : (
        <ul>
          {donations.map((donation) => (
            <li key={donation._id}>
              <strong>{donation.foodDetails.foodType}</strong>:{" "}
              {donation.foodDetails.description} <br />
              Quantity: {donation.foodDetails.quantity} | Status:{" "}
              {donation.status} <br />
              Pickup: {donation.pickupLocation.address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReceiverDashboard;
