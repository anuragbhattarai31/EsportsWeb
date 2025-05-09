const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {                    
    require: true,           
    rejectUnauthorized: false   
  }
});

// ⛔️ Don't connect manually in test mode
if (process.env.NODE_ENV !== "test") {
  pool.connect()
    .then(() => console.log("✅ PostgreSQL Connected"))
    .catch(err => console.error("❌ Database Connection Error:", err));
}

module.exports = pool;
