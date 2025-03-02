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

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/campaigns/public');
        setCampaigns(response.data.campaigns);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError('Failed to fetch campaigns.');
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    const fetchProviderDonations = async () => {
      if (!token) return;
      try {
        const response = await axios.get('http://localhost:5000/api/donations/provider', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProviderDonations(response.data.donations);
      } catch (err) {
        console.error("Error fetching provider donations:", err);
      }
    };
    fetchProviderDonations();
  }, [token]);

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

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setJoinError("You must be logged in to join a campaign.");
      return;
    }
    try {
      const payload = {
        campaignId: selectedCampaign._id,
        donationId: joinData.donationId,
        quantity: parseInt(joinData.quantity, 10)
      };
      await axios.post('http://localhost:5000/api/campaigns/join', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setJoinSuccess("Successfully joined the campaign!");
      const res = await axios.get('http://localhost:5000/api/campaigns/public');
      setCampaigns(res.data.campaigns);
      setSelectedCampaign(null);
    } catch (err) {
      console.error("Error joining campaign:", err);
      setJoinError("Failed to join the campaign.");
    }
  };

  return (
    <div style={{ padding: '2em', fontFamily: 'Arial, sans-serif', color: 'black' }}>
      <h1 style={{ textAlign: 'center' ,color: 'black' }}>Ongoing Campaigns</h1>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
      {campaigns.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px' }}>No ongoing campaigns found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {campaigns.map((campaign) => (
            <li
              key={campaign._id}
              style={{
                border: '1px solid #ddd',
                padding: '1.5em',
                marginBottom: '1em',
                borderRadius: '10px',
                boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f9f9f9'
              }}
            >
              <h2 style={{ marginBottom: '0.5em' }}>{campaign.title}</h2>
              <p>{campaign.description}</p>
              <p><strong>Target Quantity:</strong> {campaign.targetQuantity} | <strong>Current:</strong> {campaign.currentQuantity}</p>
              <p><strong>Status:</strong> {campaign.status}</p>
              <p><strong>Expires At:</strong> {new Date(campaign.expiresAt).toLocaleString()}</p>
              {token && (
                <button 
                  onClick={() => handleJoinClick(campaign)} 
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    padding: '10px 15px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginTop: '10px'
                  }}
                >
                  Join Campaign
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {selectedCampaign && (
        <div style={{
          border: "1px solid #666", 
          padding: "1.5em", 
          borderRadius: "10px", 
          marginTop: "1em", 
          backgroundColor: "#f1f1f1",
          boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ marginBottom: '10px' }}>Join Campaign: {selectedCampaign.title}</h3>
          {providerDonations.length > 0 ? (
            <form onSubmit={handleJoinSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label>Select Donation:</label>
                <select
                  name="donationId"
                  value={joinData.donationId}
                  onChange={handleJoinChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '5px'
                  }}
                >
                  <option value="">--Select Donation--</option>
                  {providerDonations.map((donation) => (
                    <option key={donation._id} value={donation._id}>
                      {donation.foodDetails.foodType} (Qty: {donation.foodDetails.quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Quantity to Contribute:</label>
                <input
                  type="number"
                  name="quantity"
                  value={joinData.quantity}
                  onChange={handleJoinChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '5px'
                  }}
                />
              </div>
              <button type="submit" style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}>
                Submit Join Request
              </button>
              <button 
                type="button" 
                onClick={() => setSelectedCampaign(null)}
                style={{
                  marginLeft: '10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: '10px 15px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Cancel
              </button>
            </form>
          ) : (
            <p style={{ color: 'red' }}>You have no available donations.</p>
          )}
          {joinError && <p style={{ color: "red" }}>{joinError}</p>}
          {joinSuccess && <p style={{ color: "green" }}>{joinSuccess}</p>}
        </div>
      )}
    </div>
  );
};

export default OngoingCampaigns;
