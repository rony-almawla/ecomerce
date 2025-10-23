const orderController = require("../controllers/order.controller");
const orderValidate = require("../middlewares/validate");
const { validate } = require("../middlewares/validate");

const {createOrderSchema, updateOrderSchema} = require("../validations/order.validation");

async function routes(fastify, options) {
    fastify.get("/", orderController.getAllOrders);
    fastify.get("/search", orderController.searchOrders);
    fastify.get("/:id", orderController.getOrderById);
    fastify.post("/", {preHandler: validate[(createOrderSchema)]} ,orderController.createOrder);
    fastify.put("/:id", {preHandler: validate[(updateOrderSchema)]} , orderController.updateOrder);
}

module.exports = routes;
