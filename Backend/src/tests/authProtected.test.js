const request = require("supertest");
const { app, server } = require("../server");
const pool = require("../db");

jest.setTimeout(20000);

describe("GET /api/auth/dashboard (Protected Route)", () => {
  const user = {
    username: "ProtectedUser",
    email: `protected${Date.now()}@semo.edu`,
    password: "securepass123",
  };

  let token;

  beforeAll(async () => {
    await request(app).post("/api/auth/register").send(user);

    const res = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });

    token = res.body.token;
  });

  it("should allow access with valid token", async () => {
    const res = await request(app)
      .get("/api/auth/dashboard")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Welcome/i);
  });

  it("should deny access with no token", async () => {
    const res = await request(app).get("/api/auth/dashboard");

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/Unauthorized|Missing/i);
  });

  it("should deny access with invalid token", async () => {
    const res = await request(app)
      .get("/api/auth/dashboard")
      .set("Authorization", "Bearer this.is.an.invalid.token");

    expect(res.statusCode).toBe(401); // ✅ changed from 400
    expect(res.body.error).toMatch(/Unauthorized|invalid token/i);
  });
});

afterAll(async () => {
  console.log("🧪 Cleaning up protected route test...");
  await pool.end();
  server && server.close();
});
