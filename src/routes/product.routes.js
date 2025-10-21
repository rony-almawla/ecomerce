const productController = require("../controllers/product.controller");

//in able to map routes in fastify
async function routes(fastify, options) {
    fastify.get("/", productController.getAllProducts);
    fastify.get("/:id", productController.getProductById);
    fastify.post("/", productController.createProduct);
    fastify.put("/:id", productController.updateProduct);
    fastify.delete("/:id", productController.deleteProduct); 
}

module.exports = routes;