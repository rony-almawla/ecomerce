const userController = require("../controllers/user.controller");


//in able to map routes in fastify
async function routes(fastify,options){
    fastify.get("/",  userController.getAllUsers);
    fastify.get("/:id",  userController.getUserById);
    fastify.post("/",  userController.createUser);
    fastify.put("/:id",  userController.updateUser);
    fastify.delete("/:id",  userController.deleteUser);
}

module.exports = routes;