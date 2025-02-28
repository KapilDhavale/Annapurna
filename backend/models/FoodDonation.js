const mongoose = require('mongoose');

const FoodDonationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the User model
    required: true,
  },
  foodDetails: {
    foodType: { type: String, required: true }, // e.g., "Vegetarian Meal", "Dairy Products"
    description: { type: String, required: true }, // Additional info about the food
    quantity: { type: Number, required: true }, // Number of servings or kilograms
    expiryDate: { type: Date, required: true }, // When the food is expected to expire
    packaged: { type: Boolean, default: false }, // Whether the food is properly packaged
  },
  pickupLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // Format: [longitude, latitude]
      required: true,
    },
    address: { type: String, required: true }, // Human-readable address
  },
  status: {
    type: String,
    enum: ['pending', 'matched', 'picked', 'delivered', 'expired', 'cancelled'],
    default: 'pending',
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assigned receiver (NGO, individual, etc.)
    default: null,
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The driver picking up the donation (if applicable)
    default: null,
  },
  donationTime: { 
    type: Date, 
    default: Date.now, 
  },
  pickupTime: { 
    type: Date, 
    default: null, 
  },
  deliveryTime: { 
    type: Date, 
    default: null, 
  },
});

// Create a geospatial index on pickupLocation for efficient location queries
FoodDonationSchema.index({ pickupLocation: '2dsphere' });

module.exports = mongoose.model('FoodDonation', FoodDonationSchema);
