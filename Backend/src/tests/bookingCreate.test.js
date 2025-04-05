const request = require("supertest");
const { app, server } = require("../server");
const pool = require("../db");

jest.setTimeout(20000);

describe("POST /api/bookings/create", () => {
  const user = {
    username: "BookingUser",
    email: `booking${Date.now()}@semo.edu`,
    password: "testbooking123",
  };

  let token;
  let validDeviceId;

  beforeAll(async () => {
    // Register user and get token
    await request(app).post("/api/auth/register").send(user);

    const loginRes = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });

    token = loginRes.body.token;

    // Use known-good device ID from your table
    validDeviceId = 1;
  });

  it("should allow valid booking creation", async () => {
    const start = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 2 hours total
  
    const res = await request(app)
      .post("/api/bookings/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        device_id: validDeviceId,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      });
  
    console.log("✅ Booking creation response:", res.body);
  
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("device_id", validDeviceId);
    expect(res.body).toHaveProperty("status", "reserved");
  });
  

  it("should reject booking over 2 hours", async () => {
    const start = new Date(Date.now() + 3600000);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000); // 3 hours

    const res = await request(app)
      .post("/api/bookings/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        device_id: validDeviceId,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Max booking duration is 2 hours/i);
  });

  it("should reject booking in the past", async () => {
    const start = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const res = await request(app)
      .post("/api/bookings/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        device_id: validDeviceId,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Cannot book in the past/i);
  });

  it("should reject booking without token", async () => {
    const start = new Date(Date.now() + 3600000);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const res = await request(app)
      .post("/api/bookings/create")
      .send({
        device_id: validDeviceId,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/Missing token/i);
  });

  afterAll(async () => {
    console.log("🧪 Cleaning up booking test...");
    await pool.end();
    server && server.close();
  });
});
