// server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const pool = require("./db"); // Import PostgreSQL connection
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const clubRegistrationRoutes = require("./routes/clubRegistrationRoutes");
const newsRoutes = require("./routes/newsRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const teamRoutes = require("./routes/teamRoutes");
const path = require("path");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS: open to any origin ---
const corsOptions = {
  origin: true,        // reflect request origin in Access-Control-Allow-Origin
  credentials: true,   // Access-Control-Allow-Credentials: true
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// --- JSON parsing middleware ---
app.use(express.json());

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/club-registrations", clubRegistrationRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/events", eventsRoutes);

// --- Static uploads ---
const uploadsPath = path.join(__dirname, "public/uploads");
app.use("/uploads", express.static(uploadsPath));

// --- Health endpoint for EB load balancer ---
app.get("/", (_req, res) => res.status(200).send("OK"));

console.log("DB_PASSWORD =", process.env.DB_PASSWORD);

// --- Start server ---
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// --- Hourly cleanup job ---
if (process.env.NODE_ENV !== "test") {
  cron.schedule("0 * * * *", async () => {
    try {
      const result = await pool.query(
        "DELETE FROM bookings WHERE end_time < NOW()"
      );
      console.log(`Cleaned up ${result.rowCount} expired bookings`);
    } catch (error) {
      console.error("Hourly booking cleanup failed:", error);
    }
  });
}

module.exports = { app };
