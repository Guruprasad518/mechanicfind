const ServiceRequest = require('../models/ServiceRequest');

/* ==============================
   CREATE SERVICE REQUEST
============================== */
exports.createRequest = async (req, res) => {
  try {
    const request = new ServiceRequest(req.body);

    await request.save();

    res.json(request);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error creating request"
    });
  }
};


/* ==============================
   GET USER REQUESTS
============================== */
exports.getUserRequests = async (req, res) => {
  try {

    const requests = await ServiceRequest.find({
      userId: req.params.userId
    });

    res.json(requests);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching user requests"
    });
  }
};


/* ==============================
   GET MECHANIC REQUESTS
============================== */
exports.getMechanicRequests = async (req, res) => {
  try {

    const mechanicId = req.params.mechanicId;

    console.log("Searching requests for mechanic:", mechanicId);

    const requests = await ServiceRequest.find({
      mechanicId: mechanicId
    });

    console.log("Requests found:", requests.length);

    res.json(requests);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching mechanic requests"
    });
  }
};
