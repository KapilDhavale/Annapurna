import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";

const AdminDashboard = () => {
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
      <h1>Admin Dashboard</h1>
      <LogoutButton /> {/* Reusable Logout Button */}
      <p>Overview of all donations:</p>
      {donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <ul>
          {donations.map((donation) => (
            <li key={donation._id}>
              <strong>{donation.foodDetails.foodType}</strong> -{" "}
              {donation.foodDetails.description} <br />
              Quantity: {donation.foodDetails.quantity} | Status:{" "}
              {donation.status} <br />
              Donor: {donation.donor?.username || "N/A"} | Pickup:{" "}
              {donation.pickupLocation.address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
