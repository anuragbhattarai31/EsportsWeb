const request = require("supertest");
const { app, server } = require("../server");
const pool = require("../db");

jest.setTimeout(20000);

describe("POST /api/bookings/create - Overlapping Booking", () => {
  const user = {
    username: "OverlapTester",
    email: `overlap${Date.now()}@semo.edu`,
    password: "overlap123",
  };

  let token;
  const validDeviceId = 1; // ✅ Known working device

  beforeAll(async () => {
    // Register and log in the user
    await request(app).post("/api/auth/register").send(user);

    const res = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });

    token = res.body.token;
  });

  it("should allow the first booking", async () => {
    const start = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour

    const res = await request(app)
      .post("/api/bookings/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        device_id: validDeviceId,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("should reject a second overlapping booking", async () => {
    const overlappingStart = new Date(Date.now() + 60 * 60 * 1000 + 15 * 60 * 1000); // +1hr 15min
    const overlappingEnd = new Date(overlappingStart.getTime() + 30 * 60 * 1000); // 30 min

    const res = await request(app)
      .post("/api/bookings/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        device_id: validDeviceId,
        start_time: overlappingStart.toISOString(),
        end_time: overlappingEnd.toISOString(),
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/already booked|overlaps/i); // Adjust regex to match your backend message
  });
});

afterAll(async () => {
  console.log("🧪 Cleaning up overlapping test...");
  await pool.end();
  server && server.close();
});
