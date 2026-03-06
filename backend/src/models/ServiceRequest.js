const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
  userId: String,
  userName: String,      // Added: to show mechanic who called
  userMobile: String,    // Added: for mechanic to contact user
  mechanicId: String,
  mechanicName: String,
  problemType: String,
  description: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'cancelled'], // Added enum for safety
    default: "pending"
  },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  locationLink: String,  // Added: Google Maps URL
  distanceKm: String,    // Added: distance calculated on frontend
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ServiceRequest", ServiceRequestSchema);