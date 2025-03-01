// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useSearchParams } from "react-router-dom";
// import { OlaMaps } from "../OlaMapsWebSDKNew/olamaps-web-sdk.umd.js";
// import polyline from "polyline";

// const MapsPage = () => {
//   const [searchParams] = useSearchParams();
//   const bookingId = searchParams.get("bookingId");
//   console.log("Retrieved bookingId from URL:", bookingId);

//   // We'll store the origin and destination from the booking
//   const [origin, setOrigin] = useState({ lat: "", lng: "" });
//   const [destination, setDestination] = useState({ lat: "", lng: "" });
//   const [routeData, setRouteData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   const mapContainer = useRef(null);
//   const olaMapsRef = useRef(null);
//   const routeLayerRef = useRef(null);

//   // Fetch the booking details from backend to get the stored coordinates.
//   useEffect(() => {
//     async function fetchBookingData() {
//       if (!bookingId) {
//         setError("No booking ID provided.");
//         return;
//       }
//       try {
//         const response = await fetch(`http://localhost:3000/api/bookings/${bookingId}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`
//           }
//         });
//         if (!response.ok) {
//           throw new Error("Failed to fetch booking details.");
//         }
//         const booking = await response.json();
//         // Assume booking has pickupLat, pickupLng, dropoffLat, dropoffLng.
//         if (!booking.pickupLat || !booking.pickupLng || !booking.dropoffLat || !booking.dropoffLng) {
//           throw new Error("Booking does not have valid coordinates.");
//         }
//         setOrigin({ lat: booking.pickupLat, lng: booking.pickupLng });
//         setDestination({ lat: booking.dropoffLat, lng: booking.dropoffLng });
//         console.log("Booking coordinates set:", booking.pickupLat, booking.pickupLng, booking.dropoffLat, booking.dropoffLng);
//       } catch (err) {
//         console.error("Error fetching booking data:", err);
//         setError(err.message);
//       }
//     }
//     fetchBookingData();
//   }, [bookingId]);

//   // Once we have the origin and destination, call the Ola routing API for an optimized route.
//   const fetchRoute = useCallback(async (myMap) => {
//     if (!origin.lat || !origin.lng || !destination.lat || !destination.lng) {
//       setError("Booking does not have valid origin/destination coordinates.");
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     try {
//       const queryParams = new URLSearchParams({
//         origin: `${origin.lat},${origin.lng}`,
//         destination: `${destination.lat},${destination.lng}`,
//         // If you have waypoints, include them here (otherwise leave blank)
//         waypoints: "",
//         api_key: "YGuadG6FTveiEwrUpGDETfXoOhDxpR2y8Upv6xdM"
//       }).toString();

//       const apiUrl = `https://api.olamaps.io/routing/v1/directions?${queryParams}`;
//       console.log("Fetching route from API:", apiUrl);

//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           "X-Request-Id": "12345",
//           Origin: "http://localhost:3001",
//         },
//       });
//       if (!response.ok) {
//         throw new Error(`Error fetching route: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log("Route Data Received:", data);
//       if (!data.routes || !data.routes[0]?.overview_polyline) {
//         throw new Error("No valid routes found.");
//       }
//       // Decode the optimized polyline from Ola's API.
//       const decodedCoordinates = polyline
//         .decode(data.routes[0].overview_polyline)
//         .map(([lat, lng]) => [lng, lat]); // GeoJSON expects [lng, lat]
//       console.log("Decoded Coordinates:", decodedCoordinates);
//       setRouteData(decodedCoordinates);
//       plotRoute(myMap, decodedCoordinates);
//     } catch (error) {
//       console.error("Fetch error:", error);
//       setError("Failed to fetch the route. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [origin, destination]);

//   useEffect(() => {
//     try {
//       console.log("Initializing OlaMaps...");
//       // Create an instance of OlaMaps and initialize the map using the init() method.
//       const olaMaps = new OlaMaps({ apiKey: "YGuadG6FTveiEwrUpGDETfXoOhDxpR2y8Upv6xdM" });
//       const myMap = olaMaps.init({
//         style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
//         container: mapContainer.current,
//         center: [origin.lng || 0, origin.lat || 0], // Default center; will adjust when route is fetched
//         zoom: 12,
//       });
//       olaMapsRef.current = myMap;

//       myMap.on("load", () => {
//         console.log("Map style loaded successfully.");
//         // Only fetch route if origin and destination are set.
//         if (origin.lat && destination.lat) {
//           fetchRoute(myMap);
//         }
//       });

//       // Optional: Handle missing style images.
//       myMap.on("styleimagemissing", (e) => {
//         if (e.id === "pedestrian_polygon") {
//           const canvas = document.createElement("canvas");
//           canvas.width = 1;
//           canvas.height = 1;
//           myMap.addImage("pedestrian_polygon", canvas);
//         }
//       });

//       return () => {
//         console.log("Cleaning up map resources...");
//         if (routeLayerRef.current) {
//           if (myMap.getLayer("route")) myMap.removeLayer("route");
//           if (myMap.getSource("route")) myMap.removeSource("route");
//         }
//       };
//     } catch (err) {
//       console.error("Error initializing map:", err);
//       setError("Failed to initialize the map.");
//     }
//   }, [fetchRoute, origin, destination]);

//   const plotRoute = (myMap, coordinates) => {
//     try {
//       console.log("Plotting route on map...");
//       if (!myMap.isStyleLoaded()) {
//         myMap.on("style.load", () => plotRoute(myMap, coordinates));
//         return;
//       }
//       if (routeLayerRef.current) {
//         if (myMap.getLayer("route")) myMap.removeLayer("route");
//         if (myMap.getSource("route")) myMap.removeSource("route");
//       }
//       myMap.addSource("route", {
//         type: "geojson",
//         data: {
//           type: "Feature",
//           geometry: { type: "LineString", coordinates },
//         },
//       });
//       myMap.addLayer({
//         id: "route",
//         type: "line",
//         source: "route",
//         layout: { "line-join": "round", "line-cap": "round" },
//         paint: { "line-color": "#007aff", "line-width": 4 },
//       });
//       console.log("Route successfully plotted!");
//       routeLayerRef.current = "route";
//     } catch (error) {
//       console.error("Error plotting route:", error);
//       setError("Failed to plot the route.");
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-xl font-semibold mb-4">Shipment Tracking Map</h2>
//       <div ref={mapContainer} style={{ height: "500px" }}></div>
//       {loading && <p>Loading route...</p>}
//       {error && <p className="text-red-500">{error}</p>}
//     </div>
//   );
// };

// export default MapsPage;
