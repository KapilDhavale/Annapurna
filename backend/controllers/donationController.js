const FoodDonation = require('../models/FoodDonation');
const { sendSMS } = require('../utils/twilioNotification');


// Create a new donation
exports.createDonation = async (req, res) => {
  const { foodDetails, pickupLocation } = req.body;
  
  if (!pickupLocation || !pickupLocation.coordinates || !pickupLocation.address) {
    return res.status(400).json({ error: "Invalid pickupLocation format" });
  }

  try {
    const donation = new FoodDonation({
      donor: req.user._id,
      foodDetails,
      pickupLocation: {
        type: 'Point',
        coordinates: pickupLocation.coordinates,
        address: pickupLocation.address
      }
    });
    await donation.save();

    // Send SMS notification to a sample phone number (update this as needed)
    const message = `New Donation Alert!\nFood: ${foodDetails.foodType}\nQuantity: ${foodDetails.quantity}\nPickup: ${pickupLocation.address}`;
    await sendSMS("+919082251379", message); // Replace with the recipient's phone number

    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Retrieve all donations (with donor info)
exports.getDonations = async (req, res) => {
  try {
    const donations = await FoodDonation.find().populate('donor', 'username email');
    res.json(donations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update the status of a donation
exports.updateDonationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  // Allowed status values as defined in the schema
  const allowedStatuses = ['pending', 'matched', 'picked', 'delivered', 'expired', 'cancelled'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }
  
  try {
    const donation = await FoodDonation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    res.json(donation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Retrieve donations near a specified location
exports.getDonationsNear = async (req, res) => {
  const { lat, lon, radius } = req.query;
  
  if (!lat || !lon || !radius) {
    return res.status(400).json({ error: "Please provide lat, lon, and radius as query parameters" });
  }
  
  try {
    const donations = await FoodDonation.find({
      pickupLocation: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lon), parseFloat(lat)] },
          $maxDistance: parseInt(radius)
        }
      }
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
    // Update assigned driver, change status to "picked", and record pickup time
    donation.assignedDriver = driverId;
    donation.status = "picked";
    donation.pickupTime = new Date();
    await donation.save();
    res.json(donation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
