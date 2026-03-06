const ServiceRequest = require('../models/ServiceRequest');

/* ==============================
   CREATE SERVICE REQUEST
============================== */
exports.createRequest = async (req, res) => {
  try {
    // This now accepts the expanded body including userName, userMobile, 
    // locationLink (Google Maps URL), and distanceKm
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
    }).sort({ createdAt: -1 }); // Sorting by newest first

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
    }).sort({ createdAt: -1 });

    console.log("Requests found:", requests.length);

    res.json(requests);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching mechanic requests"
    });
  }
};

/* ==============================
   UPDATE REQUEST STATUS (New Feature)
============================== */
// This handles the 'Accept' and 'Decline' buttons from your dashboard
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { requestId } = req.params;

    const updatedRequest = await ServiceRequest.findByIdAndUpdate(
      requestId,
      { status: status },
      { new: true } // Returns the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(updatedRequest);
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({
      message: "Error updating request status"
    });
  }
};