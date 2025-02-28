const express = require('express');
const router = express.Router();
const { createDonation, getDonations, updateDonationStatus, getDonationsNear, assignDriver } = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Donation creation (providers only)
router.post('/', protect, roleMiddleware(['provider']), createDonation);

// Retrieve all donations (authenticated users)
router.get('/', protect, getDonations);

// Update donation status
router.put('/:id', protect, updateDonationStatus);

// Get donations near a specific location
router.get('/near', protect, getDonationsNear);

// Assign a driver to a donation (this endpoint might be used by admin or logistics systems)
router.put('/assign/:donationId', protect, assignDriver);

module.exports = router;
