const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
  userId: String,
  mechanicId: String,
  mechanicName: String,
  problemType: String,
  description: String,
  status: {
    type: String,
    default: "pending"
  },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ServiceRequest", ServiceRequestSchema);
