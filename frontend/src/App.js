// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProviderDashboard from './pages/ProviderDashboard';
import ReceiverDashboard from './pages/ReceiverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MapsPage from './components/MapsPage';
import Campaign from './pages/Campaign';
import OngoingCampaigns from './pages/OngoingCampaigns';
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/receiver-dashboard" element={<ReceiverDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/maps" element={<MapsPage />} />
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/ongoing-campaigns" element={<OngoingCampaigns />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
