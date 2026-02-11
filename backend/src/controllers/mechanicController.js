const Mechanic = require('../models/Mechanic');

exports.getNearbyMechanics = async (req, res) => {
  const mechanics = await Mechanic.find({ isAvailable: true });
  res.json(mechanics);
};
