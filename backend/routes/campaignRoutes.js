const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { protect } = require('../middleware/auth');

// Public route for viewing ongoing campaigns
router.get('/public', campaignController.getCampaigns);

// Protected routes for campaign management
router.post('/', protect, campaignController.createCampaign);
router.get('/', protect, campaignController.getCampaigns);
router.get('/:id', protect, campaignController.getCampaignById);
router.put('/:id', protect, campaignController.updateCampaign);
router.post('/join', protect, campaignController.joinCampaign);

module.exports = router;
