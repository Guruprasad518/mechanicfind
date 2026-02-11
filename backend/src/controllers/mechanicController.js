const Mechanic = require('../models/Mechanic');

exports.getNearbyMechanics = async (req, res) => {
  const mechanics = await Mechanic.find({ isAvailable: true });

  // ✅ add latitude & longitude for frontend
  const formattedMechanics = mechanics.map(m => ({
    ...m._doc,
    latitude: m.location?.lat,
    longitude: m.location?.lng
  }));

  res.json(formattedMechanics);
};
