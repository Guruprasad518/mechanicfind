const router = require('express').Router();

const {
  createRequest,
  getUserRequests,
  getMechanicRequests,
  updateRequestStatus // Added this
} = require('../controllers/requestController');

// Existing Routes
router.post('/', createRequest);
router.get('/user/:userId', getUserRequests);
router.get('/mechanic/:mechanicId', getMechanicRequests);

// New Route for updating status (Accept/Decline)
router.put('/:requestId', updateRequestStatus);

module.exports = router;