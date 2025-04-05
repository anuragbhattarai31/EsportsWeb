const request = require("supertest");
const { app, server } = require("../server");
const pool = require("../db");

jest.setTimeout(30000); // Increase timeout globally

describe("POST /api/auth/register", () => {
  it("should return 201 for valid SEMO email registration", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "TestUser",
      email: `test${Date.now()}@semo.edu`,
      password: "password123",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.user).toHaveProperty("email");
  });

  it("should return 400 for non-SEMO email", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "TestUser",
      email: "notsemo@gmail.com",
      password: "password123",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/Only @semo\.edu emails/);
  });
});

afterAll(async () => {
    console.log("🧪 Cleaning up test environment...");
  
    try {
      await pool.end(); // ✅ close DB
  
      if (server && server.close) {
        await new Promise((resolve, reject) => {
          server.close((err) => {
            if (err) return reject(err);
            console.log("🧪 Server closed");
            resolve();
          });
        });
      }
    } catch (err) {
      console.error("❌ Error during cleanup:", err);
    }
  });
  