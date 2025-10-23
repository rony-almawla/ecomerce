const request = require("supertest");
const fastify = require("fastify");
const productRoutes = require("../src/routes/product.routes");
const mongoose = require("mongoose");
const Product = require("../src/models/products.model");

// Create test Fastify instance
const app = fastify();
app.register(productRoutes, { prefix: "/api/v1/products" });

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST || "mongodb://localhost:27017/ecommerce_test");
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// Clear products before each test
beforeEach(async () => {
  await Product.deleteMany({});
});

describe("Product API", () => {
  const validProduct = { name: "Test Product", price: 100, category: "Test", description: "A product" };

  it("should create a new product", async () => {
    const res = await request(app.server).post("/api/v1/products").send(validProduct);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(validProduct.name);
  });

  it("should not create a product with missing fields", async () => {
    const res = await request(app.server).post("/api/v1/products").send({ name: "Only name" });
    expect(res.statusCode).toBe(400); // assuming validation fails
  });

  it("should get all products", async () => {
    await Product.create(validProduct);
    const res = await request(app.server).get("/api/v1/products");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("should get product by ID", async () => {
    const product = await Product.create(validProduct);
    const res = await request(app.server).get(`/api/v1/products/${product._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(validProduct.name);
  });

  it("should update a product", async () => {
    const product = await Product.create(validProduct);
    const res = await request(app.server)
      .put(`/api/v1/products/${product._id}`)
      .send({ price: 150 });
    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(150);
  });

  it("should delete a product", async () => {
    const product = await Product.create(validProduct);
    const res = await request(app.server).delete(`/api/v1/products/${product._id}`);
    expect(res.statusCode).toBe(204);
  });
});
