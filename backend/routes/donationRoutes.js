const express = require('express');
const router = express.Router();
const {
  createDonation,
  getDonations,
  updateDonationStatus,
  getDonationsNear,
  assignDriver,
} = require('../controllers/donationController');
const { protect } = require('../middleware/auth');

// Donation creation (protected route)
router.post('/', protect, createDonation);

// Retrieve all donations (authenticated users)
router.get('/', protect, getDonations);

// Update donation status
router.put('/:id', protect, updateDonationStatus);

// Get donations near a specific location
router.get('/near', protect, getDonationsNear);

// Assign a driver to a donation
router.put('/assign/:donationId', protect, assignDriver);

module.exports = router;
