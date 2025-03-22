const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./db"); // Import PostgreSQL connection
const authRoutes = require("./routes/authRoutes"); // Import auth rout
const bookingRoutes = require("./routes/bookingRoutes"); // Import booking routes
const adminRoutes = require("./routes/adminRoutes"); // Import admin routes
const clubRegistrationRoutes = require('./routes/clubRegistrationRoutes');

dotenv.config();
const cron = require('node-cron');
const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  app.use(express.json());
  app.use(cors(corsOptions));
  
  // Handle preflight requests
  app.options('*', cors(corsOptions));


// Routes
app.use("/api/auth", authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/club-registrations', clubRegistrationRoutes);

// Test Database Connection
pool.connect()
    .then(() => console.log(" Database connected successfully"))
    .catch(err => console.error(" Error connecting to database:", err));

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

cron.schedule('0 * * * *', async () => {
    try {
      const result = await pool.query(
        'DELETE FROM bookings WHERE end_time < NOW()'
      );
      console.log(`Cleaned up ${result.rowCount} expired bookings`);
    } catch (error) {
      console.error('Hourly booking cleanup failed:', error);
    }
  });