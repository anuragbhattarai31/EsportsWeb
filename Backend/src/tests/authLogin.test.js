const request = require("supertest");
const { app, server } = require("../server");
const pool = require("../db");

jest.setTimeout(20000);

describe("POST /api/auth/login", () => {
  const user = {
    username: "LoginTestUser",
    email: `logintest${Date.now()}@semo.edu`,
    password: "testpassword123",
  };

  beforeAll(async () => {
    await request(app).post("/api/auth/register").send(user); // Register a user to login
  });

  it("should login with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should not login with incorrect password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Invalid credentials/i);
  });

  it("should not login with unknown email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "notfound@semo.edu",
      password: "whatever",
    });

    expect(res.statusCode).toBe(400); // Adjust based on your actual API response
  });
});

afterAll(async () => {
  console.log("🧪 Cleaning up login test...");
  await pool.end();
  server && server.close();
});
