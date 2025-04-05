const axios = require("axios");
const fs = require("fs");

const users = [
  { email: "testuser@semo.edu", password: "testpassword123" },
  { email: "testuser2@semo.edu", password: "testpassword123" },
  { email: "testuser3@semo.edu", password: "testpassword123" },
];

(async () => {
  const tokens = ["token"]; // CSV header

  for (const user of users) {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", user);
      tokens.push(res.data.token);
    } catch (err) {
      console.error(`❌ Failed to log in for ${user.email}:`, err.response?.data || err.message);
    }
  }

  // Write to CSV
  fs.writeFileSync("token_payload.csv", tokens.join("\n"));
  console.log("✅ Tokens written to token_payload.csv");
})();
