const mongoose = require('mongoose');

const MechanicSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: { type: String, unique: true },
  password: String,

  type: {
    type: String,
    default: "mechanic"
  },

  specialties: [String],

  location: {
    lat: Number,
    lng: Number,
    address: String
  },

  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 }
});

module.exports = mongoose.model("Mechanic", MechanicSchema);
