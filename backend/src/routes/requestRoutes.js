const router = require('express').Router();

const {
  createRequest,
  getUserRequests,
  getMechanicRequests
} = require('../controllers/requestController');

router.post('/', createRequest);
router.get('/user/:userId', getUserRequests);
router.get('/mechanic/:mechanicId', getMechanicRequests);

module.exports = router;
