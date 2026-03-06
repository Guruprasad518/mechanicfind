require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// 1. Connect Database
connectDB();

// 2. The Absolute CORS Fix
// We use a simple configuration first to ensure it works.
app.use(cors({
  origin: "https://mechanicfind.vercel.app", // NO trailing slash
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// 3. Handle Preflight (This is what's failing for you)
app.options('*', cors()); 

// 4. Middleware
app.use(express.json());

// 5. Success Check
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