import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";

const ProviderDashboard = () => {
  const [donations, setDonations] = useState([]);

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
      <h1>Provider Dashboard</h1>
      <LogoutButton /> {/* Reusable Logout Button */}
      <p>Welcome, Provider! Manage your donations below:</p>
      {donations.length === 0 ? (
        <p>No donations found. Create a donation to get started.</p>
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

export default ProviderDashboard;
