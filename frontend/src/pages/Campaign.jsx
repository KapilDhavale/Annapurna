// frontend/src/pages/Campaign.jsx
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import {jwtDecode} from 'jwt-decode';

const Campaign = () => {
  const { token } = useContext(AuthContext); // Ensure AuthContext provides the token
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetQuantity, setTargetQuantity] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [address, setAddress] = useState('');
  const [result, setResult] = useState('');

  // Log and decode the JWT token when the component mounts or token changes
  useEffect(() => {
    if (token) {
      console.log('JWT Token:', token);
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded JWT:', decoded);
      } catch (error) {
        console.error('Failed to decode JWT:', error);
      }
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build campaign data from form fields
    const campaignData = {
      title,
      description,
      targetQuantity: parseInt(targetQuantity, 10),
      expiresAt,
      location: {
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address,
      },
    };

    // Log the campaign data and token to help debug
    console.log('Campaign Data:', campaignData);
    console.log('Using Token:', token);

    try {
      const response = await fetch('http://localhost:5000/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(campaignData),
      });

      const data = await response.json();
      console.log('Server Response:', data);
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error during campaign creation:', error);
      setResult('Error: ' + error.message);
    }
  };

  return (
    <div style={{ margin: '2em' }}>
      <h1>Create Campaign</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <br />

        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <br />

        <label>
          Target Quantity:
          <input
            type="number"
            value={targetQuantity}
            onChange={(e) => setTargetQuantity(e.target.value)}
            required
          />
        </label>
        <br />

        <label>
          Expires At (Date & Time):
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            required
          />
        </label>
        <br />

        <h3>Location</h3>
        <label>
          Longitude:
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
          />
        </label>
        <br />

        <label>
          Latitude:
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
          />
        </label>
        <br />

        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <br />

        <button type="submit">Create Campaign</button>
      </form>

      <h2>Result</h2>
      <pre>{result}</pre>
    </div>
  );
};

export default Campaign;
