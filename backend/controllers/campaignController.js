const Campaign = require('../models/Campaign');
const FoodDonation = require('../models/FoodDonation'); // For reference if needed

// Create a new campaign
exports.createCampaign = async (req, res) => {
  try {
    const { title, description, targetQuantity, expiresAt, location } = req.body;
    
    // Create a new campaign, setting the creator from the authenticated user (using req.user.id)
    const campaign = new Campaign({
      title,
      description,
      targetQuantity,
      expiresAt,
      location, // Expected format: { type: "Point", coordinates: [lng, lat], address: "..." }
      campaignCreator: req.user.id,
    });
    
    await campaign.save();
    res.status(201).json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all active campaigns
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: 'active' });
    res.json({ success: true, campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a specific campaign by ID
exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    res.json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update campaign details
exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    
    // Update allowed fields
    const { title, description, expiresAt, status } = req.body;
    if (title) campaign.title = title;
    if (description) campaign.description = description;
    if (expiresAt) campaign.expiresAt = expiresAt;
    if (status) campaign.status = status;
    
    await campaign.save();
    res.json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Join a campaign by contributing a donation
exports.joinCampaign = async (req, res) => {
  try {
    const { campaignId, donationId, quantity } = req.body;
    
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    
    // Use the instance method to add the contribution using req.user.id
    await campaign.addContribution(req.user.id, donationId, quantity);
    
    res.json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
