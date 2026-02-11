const router = require('express').Router();
const { getNearbyMechanics } = require('../controllers/mechanicController');
const Mechanic = require('../models/Mechanic');

// nearby mechanics
router.post('/nearby', getNearbyMechanics);

// ✅ get mechanic using USER ID
router.get('/user/:userId', async (req, res) => {
  try {
    const mechanic = await Mechanic.findOne({
      userId: req.params.userId
    });

    res.json(mechanic);
  } catch (err) {
    res.status(500).json({ message: "Error fetching mechanic" });
  }
});

module.exports = router;
