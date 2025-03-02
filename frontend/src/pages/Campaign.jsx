import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { jwtDecode } from 'jwt-decode';

const Campaign = () => {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetQuantity, setTargetQuantity] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [address, setAddress] = useState('');
  const [result, setResult] = useState('');

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

    console.log('Campaign Data:', campaignData);
    console.log('Using Token:', token);

    try {
      const response = await fetch('http://localhost:5000/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(campaignData),
      });

      const data = await response.json();
      console.log('Server Response:', data);
      setResult(JSON.stringify(data, null, 2));

      if (response.ok) {
        window.alert('Campaign created successfully!');
      } else {
        window.alert('Failed to create campaign: ' + data.message);
      }
    } catch (error) {
      console.error('Error during campaign creation:', error);
      window.alert('Error: ' + error.message);
    }
  };

  const containerStyle = {
    maxWidth: '700px',
    margin: '3em auto',
    padding: '2em',
    background: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    fontFamily: 'Poppins, sans-serif',
    color: 'black',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  };

  const labelStyle = {
    fontWeight: '600',
    color: 'black',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
    color: 'black',
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '100px',
  };

  const buttonStyle = {
    background: '#007bff',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    padding: '12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background 0.3s ease-in-out',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', color: 'black' }}>Create Campaign</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <label style={labelStyle}>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={textareaStyle} />
        </label>

        <label style={labelStyle}>
          Target Quantity:
          <input type="number" value={targetQuantity} onChange={(e) => setTargetQuantity(e.target.value)} required style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Expires At (Date & Time):
          <input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} required style={inputStyle} />
        </label>

        <h3 style={{ color: 'black' }}>Location</h3>
        <label style={labelStyle}>
          Longitude:
          <input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} required style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Latitude:
          <input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} required style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Address:
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required style={inputStyle} />
        </label>

        <button type="submit" style={buttonStyle}>Create Campaign</button>
      </form>
    </div>
  );
};

export default Campaign;
