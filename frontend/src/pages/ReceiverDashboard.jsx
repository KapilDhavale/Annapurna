import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import { jwtDecode } from "jwt-decode";
import { OlaMaps } from "../OlaMapsWebSDKNew/olamaps-web-sdk.umd.js";

const ReceiverDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [selectedDonation, setSelectedDonation] = useState(null);
  // This ref will hold an array of red marker instances.
  const markersRef = useRef([]);
  // A state to track when the map is loaded.
  const [mapLoaded, setMapLoaded] = useState(false);

  // Receiver's (blue) marker coordinates as [longitude, latitude].
  const receiverCoords = [72.8860212, 19.0812583];

  // Get logged-in user's name from JWT token.
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

  // Fetch nearby donations using a static location (DBIT College in Vidyavihar).
  // The API returns donations within a 5000-meter (5 km) radius.
  useEffect(() => {
    const staticLocation = { lat: 19.0735, lon: 72.9165 };
    setLocation(staticLocation);
    console.log("Using static location:", staticLocation);

    axios
      .get(
        `http://localhost:5000/api/donations/near?lat=${staticLocation.lat}&lon=${staticLocation.lon}&radius=5000`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then((response) => {
        console.log("Fetched Donations:", response.data);
        const uniqueDonations = response.data.filter(
          (donation, index, self) =>
            index === self.findIndex((d) => d._id === donation._id)
        );
        console.log("Unique Donations:", uniqueDonations);
        setDonations(uniqueDonations);
      })
      .catch((error) => {
        console.error(
          "Error fetching donations:",
          error.response ? error.response.data : error.message
        );
      });
  }, []);

  // ----------------------------
  // Map Initialization
  // ----------------------------
  const mapContainer = useRef(null);
  const sdkRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapContainer.current) {
      console.log("Initializing OlaMaps on ReceiverDashboard...");
      const olaMaps = new OlaMaps({
        apiKey: "YGuadG6FTveiEwrUpGDETfXoOhDxpR2y8Upv6xdM",
      });
      sdkRef.current = olaMaps;

      const myMap = olaMaps.init({
        style:
          "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
        container: mapContainer.current,
        center: receiverCoords, // Receiver's fixed location.
        zoom: 15,
      });
      mapInstanceRef.current = myMap;

      myMap.on("load", () => {
        console.log("Map loaded successfully on ReceiverDashboard.");
        // Add the receiver's blue marker.
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

  // ----------------------------
  // Add Red Markers for Each Pending Donation
  // ----------------------------
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !sdkRef.current) {
      console.log("Map not loaded or SDK missing, skipping marker update.");
      return;
    }
    const olaMaps = sdkRef.current;
    const myMap = mapInstanceRef.current;

    console.log("Updating red markers for pending donations...");

    // Remove any existing red markers.
    markersRef.current.forEach((marker) => {
      console.log("Removing marker:", marker);
      marker.remove();
    });
    markersRef.current = [];

    // Loop through donations and add a red marker for each pending donation.
    donations.forEach((donation) => {
      if (
        donation.status === "pending" &&
        donation.pickupLocation &&
        donation.pickupLocation.coordinates &&
        donation.pickupLocation.coordinates.length === 2
      ) {
        console.log("Processing donation:", donation._id);
        // Database stores coordinates as [longitude, latitude].
        const [lon, lat] = donation.pickupLocation.coordinates;
        console.log(`Donation ${donation._id} coordinates: lat=${lat}, lon=${lon}`);

        const popupContent = `<div><strong>${donation.foodDetails.foodType}</strong>: ${donation.foodDetails.description}</div>`;
        console.log("Popup content:", popupContent);
        const popup = olaMaps
          .addPopup({ offset: [0, -30], anchor: "bottom" })
          .setHTML(popupContent);

        const marker = olaMaps
          .addMarker({ offset: [0, 6], anchor: "bottom", color: "red" })
          .setLngLat([lon, lat])
          .setPopup(popup)
          .addTo(myMap);

        console.log("Added red marker for donation:", donation._id);
        markersRef.current.push(marker);
      } else {
        console.log("Skipping donation", donation._id, "status:", donation.status);
      }
    });
    console.log("Total red markers added:", markersRef.current.length);
  }, [donations, mapLoaded]);

  // ----------------------------
  // Accept Donation Logic
  // ----------------------------
  const handleAcceptDonation = (donationId) => {
    axios
      .put(
        `http://localhost:5000/api/donations/${donationId}`,
        { status: "matched" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then((response) => {
        alert("Donation accepted successfully!");
        setDonations((prevDonations) =>
          prevDonations.map((donation) =>
            donation._id === donationId
              ? { ...donation, status: "matched" }
              : donation
          )
        );
      })
      .catch((error) => {
        console.error(
          "Error accepting donation:",
          error.response ? error.response.data : error.message
        );
      });
  };

  // ----------------------------
  // Render UI
  // ----------------------------
  return (
    <div>
      <h1>Receiver Dashboard</h1>
      <LogoutButton />
      <p>Welcome, {userName}! Explore available donations near you:</p>
      <p>
        Your Coordinates: <strong>Lat:</strong> {location.lat} |{" "}
        <strong>Lon:</strong> {location.lon}
      </p>
      {/* Map container */}
      <div
        ref={mapContainer}
        id="map"
        style={{ width: "100%", height: "400px", marginBottom: "1rem" }}
      ></div>

      {/* List of Donations */}
      {donations.length === 0 ? (
        <p>No available donations nearby.</p>
      ) : (
        <ul>
          {donations.map((donation) => (
            <li key={donation._id} style={{ marginBottom: "1rem" }}>
              <strong>{donation.foodDetails.foodType}</strong>:{" "}
              {donation.foodDetails.description}
              <br />
              Quantity: {donation.foodDetails.quantity} | Status: {donation.status}
              <br />
              Pickup: {donation.pickupLocation.address}
              <br />
              {donation.status === "pending" && (
                <button onClick={() => handleAcceptDonation(donation._id)}>
                  Accept Donation
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReceiverDashboard;
