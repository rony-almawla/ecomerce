const orderController = require("../controllers/order.controller") 

async function routes(fastify, options){
    fastify.get("/", orderController.getAllOrders);
    fastify.get("/:id", orderController.getOrderById);
    fastify.post("/", orderController.createOrder);
    fastify.put("/:id", orderController.updateOrder);
}

module.exports = routes;