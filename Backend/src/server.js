const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./db"); // Import PostgreSQL connection
const authRoutes = require("./routes/authRoutes"); // Import authentication routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173",
    credentials:true
 }));

// Routes
app.use("/api/auth", authRoutes); // All auth-related routes are now in `routes/authRoutes.js`

// Test Database Connection
pool.connect()
    .then(() => console.log(" Database connected successfully"))
    .catch(err => console.error(" Error connecting to database:", err));

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
