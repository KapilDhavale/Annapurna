const axios = require('axios');

const payload = {
  foodDetails: {
    foodType: "Non-Vegetarian Meal",
    description: "Grilled chicken with fresh salad",
    quantity: 75,
    expiryDate: "2025-03-05T15:30:00Z",
    packaged: true
  },
  pickupLocation: {
    coordinates: [72.8777, 19.0760],
    address: "456 Example Road, Mumbai, India"
  }
};

axios.post("http://localhost:5000/api/donations", payload, {
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzFkMjJiZjc1NTE3OWVkNjBlMzQyOSIsImlhdCI6MTc0MDc1NTU3MiwiZXhwIjoxNzQwODQxOTcyfQ.BYm_kVoCuEtNkQqMG3hVi-oEyOnWbe0qB9o1UzmyXdI"
  }
})
.then(response => {
  console.log("Donation created:", response.data);
})
.catch(error => {
  console.error("Error:", error.response ? error.response.data : error.message);
});
