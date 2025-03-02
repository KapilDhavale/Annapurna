// frontend/src/pages/OngoingCampaigns.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OngoingCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [providerDonations, setProviderDonations] = useState([]);
  const [error, setError] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [joinData, setJoinData] = useState({
    donationId: "",
    quantity: ""
  });
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState("");

  // Get token from localStorage (if logged in)
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Fetch campaigns from the public endpoint
        const response = await axios.get('http://localhost:5000/api/campaigns/public');
        setCampaigns(response.data.campaigns);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError('Failed to fetch campaigns.');
      }
    };

    fetchCampaigns();
  }, []);

  // Fetch provider's available donations (if logged in and if the endpoint exists)
  useEffect(() => {
    const fetchProviderDonations = async () => {
      if (!token) return;
      try {
        // This endpoint must be created on the backend
        const response = await axios.get('http://localhost:5000/api/donations/provider', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProviderDonations(response.data.donations);
      } catch (err) {
        console.error("Error fetching provider donations:", err);
        // Optionally set an error message or leave providerDonations empty
      }
    };

    fetchProviderDonations();
  }, [token]);

  // When a provider clicks "Join Campaign", set that campaign as selected
  const handleJoinClick = (campaign) => {
    setSelectedCampaign(campaign);
    setJoinData({ donationId: "", quantity: "" });
    setJoinError("");
    setJoinSuccess("");
  };

  const handleJoinChange = (e) => {
    const { name, value } = e.target;
    setJoinData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit join campaign request
  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setJoinError("You must be logged in to join a campaign.");
      return;
    }
    try {
      const payload = {
        campaignId: selectedCampaign._id,
        donationId: joinData.donationId, // Selected donation ID from dropdown
        quantity: parseInt(joinData.quantity, 10)
      };
      await axios.post('http://localhost:5000/api/campaigns/join', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setJoinSuccess("Successfully joined the campaign!");
      // Refresh campaigns to reflect updated progress
      const res = await axios.get('http://localhost:5000/api/campaigns/public');
      setCampaigns(res.data.campaigns);
      setSelectedCampaign(null);
    } catch (err) {
      console.error("Error joining campaign:", err);
      setJoinError("Failed to join the campaign.");
    }
  };

  return (
    <div style={{ padding: '2em' }}>
      <h1>Ongoing Campaigns</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {campaigns.length === 0 ? (
        <p>No ongoing campaigns found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {campaigns.map((campaign) => (
            <li
              key={campaign._id}
              style={{
                border: '1px solid #ccc',
                padding: '1em',
                marginBottom: '1em',
                borderRadius: '5px',
              }}
            >
              <h2>{campaign.title}</h2>
              <p>{campaign.description}</p>
              <p>
                <strong>Target Quantity:</strong> {campaign.targetQuantity} |{' '}
                <strong>Current:</strong> {campaign.currentQuantity}
              </p>
              <p>
                <strong>Status:</strong> {campaign.status}
              </p>
              <p>
                <strong>Expires At:</strong> {new Date(campaign.expiresAt).toLocaleString()}
              </p>
              {/* Show join button only if user is logged in */}
              {token && (
                <button onClick={() => handleJoinClick(campaign)}>
                  Join Campaign
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Join form for a selected campaign */}
      {selectedCampaign && (
        <div style={{ border: "1px solid #666", padding: "1em", borderRadius: "5px", marginTop: "1em" }}>
          <h3>Join Campaign: {selectedCampaign.title}</h3>
          {providerDonations.length > 0 ? (
            <form onSubmit={handleJoinSubmit}>
              <div>
                <label>Select Donation:</label>
                <select
                  name="donationId"
                  value={joinData.donationId}
                  onChange={handleJoinChange}
                  required
                >
                  <option value="">--Select Donation--</option>
                  {providerDonations.map((donation) => (
                    <option key={donation._id} value={donation._id}>
                      {donation.foodDetails.foodType} (Qty: {donation.foodDetails.quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Quantity to Contribute:</label>
                <input
                  type="number"
                  name="quantity"
                  value={joinData.quantity}
                  onChange={handleJoinChange}
                  required
                />
              </div>
              <button type="submit">Submit Join Request</button>
              <button type="button" onClick={() => setSelectedCampaign(null)}>
                Cancel
              </button>
            </form>
          ) : (
            <div>
              <p>You have no available donations. Please create a donation on your dashboard first.</p>
              <button onClick={() => setSelectedCampaign(null)}>Close</button>
            </div>
          )}
          {joinError && <p style={{ color: "red" }}>{joinError}</p>}
          {joinSuccess && <p style={{ color: "green" }}>{joinSuccess}</p>}
        </div>
      )}
    </div>
  );
};

export default OngoingCampaigns;
