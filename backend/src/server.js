require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// 1. Connect Database
connectDB();

// 2. Optimized CORS Fix
// Using an array handles both the domain and the domain with a trailing slash
const allowedOrigins = [
  "https://mechanicfind.vercel.app",
  "https://mechanicfind.vercel.app/"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// 3. Handle preflight requests (Crucial for Chrome/Edge)
app.options('*', cors());

// 4. Middleware
app.use(express.json());

// 5. Health Check Route (Check this in your browser to see if Render is awake)
app.get('/', (req, res) => {
  res.status(200).send("Mechanic Find API is Live and Running.");
});

// 6. Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/mechanics', require('./routes/mechanicRoutes'));
app.use('/api/service-requests', require('./routes/requestRoutes'));

// 7. Port Configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});