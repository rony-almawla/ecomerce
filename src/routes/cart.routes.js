const cartController = require('../controllers/cart.controller');
const validateCart = require("../middlewares/validate");
const { validate } = require("../middlewares/validate");
const {createCartSchema, UpdateCartSchema, updateCartSchema} = require("../validations/cart.validation")

async function routes(fastify, options) {
    fastify.get("/", cartController.getAllCarts);
    fastify.get("/search", cartController.searchCarts);
    fastify.get("/:id", cartController.getCartById);
    fastify.post("/",{preHandler:[validate(createCartSchema)] },cartController.createCart);
    fastify.put("/:id",{preHandler: validate([updateCartSchema])} ,cartController.updateCart);
    fastify.delete("/:id", cartController.deleteCart);
}

module.exports = routes;