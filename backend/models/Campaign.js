const mongoose = require('mongoose');

// Sub-schema for contributions
const ContributionSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodDonation',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  contributedAt: {
    type: Date,
    default: Date.now,
  },
});

// Main Campaign schema with a location tied to a specific area
const CampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  // The provider who initiates the campaign
  campaignCreator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Goal in terms of food quantity (e.g., servings)
  targetQuantity: {
    type: Number,
    required: true,
  },
  // Aggregated quantity from all contributions
  currentQuantity: {
    type: Number,
    default: 0,
  },
  // Array to store contributions from various providers
  contributions: [ContributionSchema],
  // Campaign status
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'expired'],
    default: 'active',
  },
  // Location details to tie the campaign to a specific area
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // Format: [longitude, latitude]
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  // Timestamps for creation and expiration
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// Create a geospatial index on the location field for efficient queries
CampaignSchema.index({ location: '2dsphere' });

// Instance method to add a new contribution
CampaignSchema.methods.addContribution = async function (provider, donation, quantity) {
  const contribution = { provider, donation, quantity, contributedAt: new Date() };
  this.contributions.push(contribution);
  this.currentQuantity += quantity;

  // Automatically mark as completed if the target is met or exceeded
  if (this.currentQuantity >= this.targetQuantity) {
    this.status = 'completed';
  }
  
  return this.save();
};

module.exports = mongoose.model('Campaign', CampaignSchema);
