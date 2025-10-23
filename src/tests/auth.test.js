const request = require("supertest");
const fastify = require("fastify");
const userRoutes = require("../src/routes/user.routes");
const mongoose = require("mongoose");
const User = require("../src/models/user.model");

const app = fastify();
app.register(userRoutes, { prefix: "/api/v1/users" });

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST || "mongodb://localhost:27017/ecommerce_test");
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("Auth API", () => {
  const testUser = { name: "Test", email: "test@example.com", password: "123456" };

  it("should register a user", async () => {
    const res = await request(app.server).post("/api/v1/users").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe(testUser.email);
  });

  it("should login a user", async () => {
    await request(app.server).post("/api/v1/users").send(testUser);
    const res = await request(app.server).post("/api/v1/users/login").send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should fail login with wrong password", async () => {
    await request(app.server).post("/api/v1/users").send(testUser);
    const res = await request(app.server).post("/api/v1/users/login").send({ email: testUser.email, password: "wrong" });
    expect(res.statusCode).toBe(401);
  });
});
