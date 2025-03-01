import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import { jwtDecode } from "jwt-decode";
import { OlaMaps } from "../OlaMapsWebSDKNew/olamaps-web-sdk.umd.js";
import "./ReceiverDashboard.css"; // Import the updated CSS

const ReceiverDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "available", "collected"
  const [expandedIds, setExpandedIds] = useState([]);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef([]);
  const mapContainer = useRef(null);
  const sdkRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Receiver's fixed coordinates.
  const receiverCoords = [72.8860212, 19.0812583];

  let userName = "Receiver";
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userName = decoded.username || userName;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  // Fetch donations using a static location.
  useEffect(() => {
    const staticLocation = { lat: 19.0735, lon: 72.9165 };
    setLocation(staticLocation);

    axios
      .get(
        `http://localhost:5000/api/donations/near?lat=${staticLocation.lat}&lon=${staticLocation.lon}&radius=5000`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then((response) => {
        const uniqueDonations = response.data.filter(
          (donation, index, self) =>
            index === self.findIndex((d) => d._id === donation._id)
        );
        setDonations(uniqueDonations);
      })
      .catch((error) => {
        console.error("Error fetching donations:", error);
      });
  }, []);

  // Initialize the map.
  useEffect(() => {
    if (mapContainer.current) {
      const olaMaps = new OlaMaps({
        apiKey: "YGuadG6FTveiEwrUpGDETfXoOhDxpR2y8Upv6xdM",
      });
      sdkRef.current = olaMaps;

      const myMap = olaMaps.init({
        style:
          "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
        container: mapContainer.current,
        center: receiverCoords,
        zoom: 15,
      });
      mapInstanceRef.current = myMap;

      myMap.on("load", () => {
        olaMaps
          .addMarker({ offset: [0, 6], anchor: "bottom", color: "blue" })
          .setLngLat(receiverCoords)
          .addTo(myMap);
        setMapLoaded(true);
      });

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }
      };
    }
  }, []);

  // Add red markers for available (pending) donations.
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !sdkRef.current) return;
    const olaMaps = sdkRef.current;
    const myMap = mapInstanceRef.current;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    donations.forEach((donation) => {
      // Backend "pending" means the food is available.
      if (
        donation.status === "pending" &&
        donation.pickupLocation?.coordinates?.length === 2
      ) {
        const [lon, lat] = donation.pickupLocation.coordinates;
        const popup = olaMaps
          .addPopup({ offset: [0, -30], anchor: "bottom" })
          .setHTML(
            `<div><strong>${donation.foodDetails.foodType}</strong>: ${donation.foodDetails.description}</div>`
          );

        const marker = olaMaps
          .addMarker({ offset: [0, 6], anchor: "bottom", color: "red" })
          .setLngLat([lon, lat])
          .setPopup(popup)
          .addTo(myMap);

        markersRef.current.push(marker);
      }
    });
  }, [donations, mapLoaded]);

  // Accept donation logic.
  const handleAcceptDonation = (donationId) => {
    axios
      .put(
        `http://localhost:5000/api/donations/${donationId}`,
        { status: "matched" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then(() => {
        alert("Donation accepted successfully!");
        setDonations((prev) =>
          prev.map((donation) =>
            donation._id === donationId
              ? { ...donation, status: "matched" }
              : donation
          )
        );
      })
      .catch((error) => console.error("Error accepting donation:", error));
  };

  // Toggle expanded state for a donation card.
  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  // Filter donations.
  const filteredDonations = donations.filter((donation) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "available")
      return donation.status === "pending";
    if (filterStatus === "collected")
      return donation.status === "matched";
    return true;
  });
  // Sort so that available donations are on top.
  const sortedDonations = [...filteredDonations].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    return 0;
  });

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Receiver Dashboard</h1>
        <LogoutButton />
      </header>
      <section className="dashboard-intro">
        <p>
          Welcome, {userName}! Explore available donations near you:
        </p>
        <p>
          <strong>Your Coordinates:</strong> Lat: {location.lat} | Lon: {location.lon}
        </p>
      </section>
      <section className="filter-section">
        <label htmlFor="statusFilter">Filter Donations:</label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="collected">Collected</option>
        </select>
      </section>
      <section className="dashboard-main">
        <div className="map-wrapper" ref={mapContainer} id="map"></div>
        <div className="donations-wrapper">
          {sortedDonations.length === 0 ? (
            <p>No available donations nearby.</p>
          ) : (
            <ul className="donation-list">
              {sortedDonations.map((donation) => {
                const statusClass =
                  donation.status === "pending" ? "available" : "collected";
                const statusLabel =
                  donation.status === "pending" ? "AVAILABLE" : "COLLECTED";
                return (
                  <li
                    key={donation._id}
                    className={`donation-item ${statusClass}`}
                    onClick={() => toggleExpand(donation._id)}
                  >
                    <div className="donation-header">
                      <div className="donation-title">
                        <h2>{donation.foodDetails.foodType}</h2>
                        <span className={`status-badge ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <span className="toggle-icon">
                        {expandedIds.includes(donation._id) ? "-" : "+"}
                      </span>
                    </div>
                    {expandedIds.includes(donation._id) && (
                      <div className="donation-details">
                        <p>{donation.foodDetails.description}</p>
                        <p>
                          <strong>Quantity:</strong>{" "}
                          {donation.foodDetails.quantity}
                        </p>
                        <p>
                          <strong>Pickup:</strong> {donation.pickupLocation.address}
                        </p>
                        {donation.status === "pending" && (
                          <button
                            className="accept-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcceptDonation(donation._id);
                            }}
                          >
                            Accept Donation
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default ReceiverDashboard;
