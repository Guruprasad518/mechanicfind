const router = require('express').Router();
const {
  createRequest,
  getUserRequests
} = require('../controllers/requestController');

router.post('/', createRequest);
router.get('/user/:userId', getUserRequests);

module.exports = router;
