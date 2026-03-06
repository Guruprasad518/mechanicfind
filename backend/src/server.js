require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// 1. Database Connection with Error Logging
connectDB().catch(err => {
    console.error("DATABASE CONNECTION ERROR:", err.message);
});

// 2. Simplest CORS (For Debugging)
// This allows EVERYTHING. If this doesn't work, the problem is Render/Network.
app.use(cors()); 

// 3. Middleware
app.use(express.json());

// 4. Critical: Preflight handler for all routes
app.options('*', cors());

// 5. Success Check (Visit this in your browser)
app.get('/', (req, res) => {
    res.json({ message: "API is working!", status: "Connected" });
});

// 6. Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/mechanics', require('./routes/mechanicRoutes'));
app.use('/api/service-requests', require('./routes/requestRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});