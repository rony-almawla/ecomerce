const productController = require("../controllers/product.controller");
const { validate } = require("../middlewares/validate");

const { createProductSchema, updateProductSchema } = require("../validations/product.validation");


//in able to map routes in fastify
async function routes(fastify, options) {
    fastify.get("/", productController.getAllProducts);
    fastify.get("/search", productController.searchProducts);
    fastify.get("/:id", productController.getProductById);
    fastify.post("/", { preHandler: [validate(createProductSchema)] }, productController.createProduct);
    fastify.put("/:id",{preHandler:[validate(createProductSchema)]}, productController.updateProduct);
    fastify.delete("/:id", productController.deleteProduct);
}

module.exports = routes;