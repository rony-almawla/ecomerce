const request = require("supertest");
const fastify = require("fastify");
const orderRoutes = require("../src/routes/order.routes");
const mongoose = require("mongoose");
const Order = require("../src/models/order.model");

const app = fastify();
app.register(orderRoutes, { prefix: "/api/v1/orders" });

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST || "mongodb://localhost:27017/ecommerce_test");
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Order.deleteMany({});
});

describe("Order API", () => {
  const testOrder = { userId: new mongoose.Types.ObjectId(), items: [], totalPrice: 100, status: "pending" };

  it("should create an order", async () => {
    const res = await request(app.server).post("/api/v1/orders").send(testOrder);
    expect(res.statusCode).toBe(201);
    expect(res.body.totalPrice).toBe(100);
  });

  it("should get all orders", async () => {
    await Order.create(testOrder);
    const res = await request(app.server).get("/api/v1/orders");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("should update order status", async () => {
    const order = await Order.create(testOrder);
    const res = await request(app.server).put(`/api/v1/orders/${order._id}`).send({ status: "completed" });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("completed");
  });
});
