const { basicAuth } = require("../middlewares/auth");
const auth = require('../middlewares/auth');
const userController = require("../controllers/user.controller");
const User = require("../models/user.model");
const { validate } = require("../middlewares/validate");
const { createUserSchema, updateUserSchema, loginUserSchema } = require("../validations/user.validation");


//in able to map routes in fastify
async function routes(fastify, options) {
     fastify.post("/login", { preHandler: validate(loginUserSchema) }, async (request, reply) => {
        const { email, password } = request.body;
        //check the password and username
        try {
            const user = await User.findOne({ email }).select("+password role name");
            if (!user) return reply.status(401).send({ error: "User not found" });

            const isMatch = await user.comparePassword(password);
            if (!isMatch) return reply.status(401).send({ error: "Incorrect password" });

            // if valid then sign a token
            const token = fastify.jwt.sign({
                payload: { email, name: user.name, role: user.role },
            });

            // then it will return
            reply.send({ token });

        } catch (error) {
            console.error(error);
            reply.status(500).send({ error: "An error occurred during login" });
        }
    });



    fastify.get("/", { onRequest: [fastify.jwtAuth] }, userController.getAllUsers);
    fastify.post("/", {preHandler: validate[(createUserSchema)]} ,userController.createUser);
    fastify.put("/:id", {preHandler: validate[(updateUserSchema)]} , userController.updateUser);//{onRequest: [fastify.jwtAuth, fastify.hasRole("Admin")]},
    fastify.delete("/:id", userController.deleteUser);
    fastify.get("/:id", userController.getUserById);


}

module.exports = routes;