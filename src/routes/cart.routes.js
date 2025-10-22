const cartController = require('../controllers/cart.controller');

async function routes(fastify, options){
    fastify.get("/", cartController.getAllCarts);
    fastify.get("/:id", cartController.getCartById);
    fastify.post("/", cartController.createCart);
    fastify.put("/:id", cartController.updateCart);
    fastify.delete("/:id", cartController.deleteCart);
}

module.exports = routes;