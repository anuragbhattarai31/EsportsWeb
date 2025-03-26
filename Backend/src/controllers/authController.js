const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

// User Registration
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
   }

    // Server-side email validation
    //Only semo emails
    const semoEmailRegex = /@semo\.edu$/i;
    if (!semoEmailRegex.test(email)) {
        return res.status(400).json({ error: "Only @semo.edu emails are allowed" });
    }

    try {
        // Check if email already exists
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: "User registered", user: newUser.rows[0] });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ error: "Error registering user" });
    }
};
     
// User Login

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
      }

    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) return res.status(400).json({ error: "Invalid credentials" });

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign(
          { id: user.rows[0].id
            ,role: user.rows[0].role || 'user'
           }, 
           process.env.JWT_SECRET,
            { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ error: "Error logging in" });
    }
};

// Protected Dashboard Route
const dashboard = async (req, res) => {
    res.json({ message: "Welcome to your dashboard", user: req.user });
};

const adminDashboard = async (req, res) => {
  try {
    // Verify admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Add admin-specific data
    res.json({ 
      message: "Welcome to Admin Dashboard",
      user: req.user
    });
    
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ error: "Admin dashboard error" });
  }
};

module.exports = { registerUser, loginUser, dashboard, adminDashboard };
