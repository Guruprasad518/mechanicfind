const ServiceRequest = require('../models/ServiceRequest');

exports.createRequest = async (req, res) => {
  const request = new ServiceRequest(req.body);
  await request.save();
  res.json(request);
};

exports.getUserRequests = async (req, res) => {
  const requests = await ServiceRequest.find({
    userId: req.params.userId
  });

  res.json(requests);
};
