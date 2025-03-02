const FoodDonation = require('../models/FoodDonation');
const { sendSMS } = require('../utils/twilioNotification');

// Create a new donation
exports.createDonation = async (req, res) => {
  const { foodDetails, pickupLocation } = req.body;

  if (!pickupLocation || !pickupLocation.coordinates || !pickupLocation.address) {
    return res.status(400).json({ error: "Invalid pickupLocation format" });
  }

  try {
    // Assume the client sends coordinates as [latitude, longitude]
    // Swap them to store as [longitude, latitude]
    const originalCoordinates = pickupLocation.coordinates;
    const correctedCoordinates = [
      parseFloat(originalCoordinates[1]),
      parseFloat(originalCoordinates[0])
    ];

    const donation = new FoodDonation({
      donor: req.user.id, // Use req.user.id (from token)
      foodDetails,
      pickupLocation: {
        type: 'Point',
        coordinates: correctedCoordinates,
        address: pickupLocation.address,
      },
    });
    await donation.save();

    // Send SMS notification
    const message = `New Donation Alert!\nFood: ${foodDetails.foodType}\nQuantity: ${foodDetails.quantity}\nPickup: ${pickupLocation.address}`;
    await sendSMS("+919082251379", message);

    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Retrieve all donations (created by the logged-in provider)
exports.getDonations = async (req, res) => {
  try {
    const donations = await FoodDonation.find({ donor: req.user.id })
      .populate('donor', 'username email');
    res.json(donations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update donation status
exports.updateDonationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['pending', 'matched', 'picked', 'delivered', 'expired', 'cancelled'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const donation = await FoodDonation.findByIdAndUpdate(id, { status }, { new: true });
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    res.json(donation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Retrieve donations near a location
exports.getDonationsNear = async (req, res) => {
  const { lat, lon, radius } = req.query;
  if (!lat || !lon || !radius) {
    return res.status(400).json({ error: "Please provide lat, lon, and radius as query parameters" });
  }
  try {
    // Coordinates are in [lon, lat] order.
    const donations = await FoodDonation.find({
      status: { $in: ["pending", "matched"] },
      pickupLocation: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lon), parseFloat(lat)] },
          $maxDistance: parseInt(radius),
        },
      },
    }).populate('donor', 'username email');
    res.json(donations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Assign a driver to a donation
exports.assignDriver = async (req, res) => {
  const { donationId } = req.params;
  const { driverId } = req.body;

  if (!driverId) {
    return res.status(400).json({ error: "driverId is required" });
  }

  try {
    const donation = await FoodDonation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    donation.assignedDriver = driverId;
    donation.status = "picked";
    donation.pickupTime = new Date();
    await donation.save();

    res.json(donation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fetch donations for the logged-in provider
exports.getProviderDonations = async (req, res) => {
  try {
    // Use req.user.id (set by your auth middleware) to filter donations
    const donations = await FoodDonation.find({ donor: req.user.id });
    res.json({ success: true, donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
