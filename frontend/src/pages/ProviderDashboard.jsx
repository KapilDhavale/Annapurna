import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

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
        coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)],
        address: formData.address,
      },
    };

    try {
      const response = await axios.post("http://localhost:5000/api/donations", donationData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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
      console.error("Error creating donation:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h1>Provider Dashboard</h1>
      <LogoutButton />
      <p>Welcome, Provider! Manage your donations below:</p>

      <h2>Create a Donation</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="foodType" placeholder="Food Type" value={formData.foodType} onChange={handleChange} required />
        <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
        <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required />
        <label>
          <input type="checkbox" name="packaged" checked={formData.packaged} onChange={handleChange} />
          Packaged
        </label>
        <input type="text" name="address" placeholder="Pickup Address" value={formData.address} onChange={handleChange} required />
        <input type="text" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} required />
        <input type="text" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} required />
        <button type="submit">Create Donation</button>
      </form>

      <h2>My Donations</h2>
      {donations.length === 0 ? (
        <p>No donations found. Create a donation to get started.</p>
      ) : (
        <ul>
          {donations.map((donation) => (
            <li key={donation._id}>
              <strong>{donation.foodDetails.foodType}</strong>: {donation.foodDetails.description} <br />
              Quantity: {donation.foodDetails.quantity} | Status: {donation.status} <br />
              Pickup: {donation.pickupLocation.address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProviderDashboard;
