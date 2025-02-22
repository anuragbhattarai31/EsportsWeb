const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER,       
    host: process.env.DB_HOST,        
    database: process.env.DB_NAME,    
    password: process.env.DB_PASSWORD, 
    port: process.env.DB_PORT,        
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false, 
});

pool.connect()
    .then(() => console.log("✅ PostgreSQL Connected"))
    .catch(err => console.error("❌ Database Connection Error:", err));

module.exports = pool;
