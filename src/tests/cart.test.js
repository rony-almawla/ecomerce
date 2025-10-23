const request = require("supertest");
const fastify = require("fastify");
const cartRoutes = require("../src/routes/cart.routes");
const mongoose = require("mongoose");
const Cart = require("../src/models/cart.model");

const app = fastify();
app.register(cartRoutes, { prefix: "/api/v1/carts" });

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST || "mongodb://localhost:27017/ecommerce_test");
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Cart.deleteMany({});
});

describe("Cart API", () => {
  const testCart = { userId: new mongoose.Types.ObjectId(), items: [{ productId: new mongoose.Types.ObjectId(), quantity: 2 }] };

  it("should create a new cart", async () => {
    const res = await request(app.server).post("/api/v1/carts").send(testCart);
    expect(res.statusCode).toBe(201);
    expect(res.body.items.length).toBe(1);
  });

  it("should get all carts", async () => {
    await Cart.create(testCart);
    const res = await request(app.server).get("/api/v1/carts");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("should update a cart", async () => {
    const cart = await Cart.create(testCart);
    const res = await request(app.server).put(`/api/v1/carts/${cart._id}`).send({ items: [] });
    expect(res.statusCode).toBe(200);
    expect(res.body.items.length).toBe(0);
  });

  it("should delete a cart", async () => {
    const cart = await Cart.create(testCart);
    const res = await request(app.server).delete(`/api/v1/carts/${cart._id}`);
    expect(res.statusCode).toBe(200); // or 204
  });
});
