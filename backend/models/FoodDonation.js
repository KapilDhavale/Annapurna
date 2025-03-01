const mongoose = require('mongoose');

const FoodDonationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  foodDetails: {
    foodType: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    packaged: { type: Boolean, default: false },
  },
  pickupLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    address: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['pending', 'matched', 'scheduled', 'picked', 'delivered', 'expired', 'cancelled'],
    default: 'pending',
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  donationTime: { 
    type: Date, 
    default: Date.now, 
  },
  scheduledPickupTime: { 
    type: Date, 
    default: null, 
  },
  actualPickupTime: { 
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

// Delete the model from the cache if it exists so that the new schema is used
if (mongoose.models.FoodDonation) {
  delete mongoose.models.FoodDonation;
}

module.exports = mongoose.model('FoodDonation', FoodDonationSchema);
