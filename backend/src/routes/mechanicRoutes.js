const router = require('express').Router();
const { getNearbyMechanics } = require('../controllers/mechanicController');

router.post('/nearby', getNearbyMechanics);

module.exports = router;
