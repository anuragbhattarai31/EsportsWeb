const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}));

const PORT = process.env.PORT || 5000;

// 🟢 User Registration
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    console.log("Received Registration Request:", { username, email });

    const semoEmailRegex = /@semo\.edu$/i;
    if (!semoEmailRegex.test(email)) {
        console.log("Invalid email:", email);
        return res.status(400).json({ error: "Only @semo.edu emails are allowed" });
    }

    try {
        console.log("Checking if email exists...");
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        console.log("Existing User Query Result:", existingUser.rows);
        
        if (existingUser.rows.length > 0) {
            console.log("Email already exists:", email);
            return res.status(400).json({ error: "Email already registered" });
        }
    } catch (err) {
        console.error("Database Error Checking User:", err);
        return res.status(500).json({ error: "Database error while checking email" });
    }

    try {
        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("Inserting new user...");
        const newUser = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
            [username, email, hashedPassword]
        );

        console.log("User registered successfully:", newUser.rows[0]);
        res.status(201).json({ message: "User registered", user: newUser.rows[0] });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ error: "Error registering user" });
    }
});


// 🟢 User Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) return res.status(400).json({ error: "Invalid credentials" });

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error("Error logging in:", err); // Log the error
        res.status(500).json({ error: "Error logging in" });
    }
});

// 🟢 Protected Route (Example)
app.get("/dashboard", authenticateToken, async (req, res) => {
    res.json({ message: "Welcome to your dashboard", user: req.user });
});

// 🛑 Middleware to Authenticate JWT Tokens
function authenticateToken(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
}

// Check Database Connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        console.log('Database connected successfully');
        release();
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});