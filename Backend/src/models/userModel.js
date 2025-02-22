// models/userModel.js
const pool = require('../db');

// Function to check if a user exists by email
const getUserByEmail = async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];  // Returns the first user or undefined if not found
};

// Function to create a new user
const createUser = async (username, email, hashedPassword) => {
    const result = await pool.query(
        "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
        [username, email, hashedPassword]
    );
    return result.rows[0];  // Returns the newly created user
};

module.exports = {
    getUserByEmail,
    createUser,
};
