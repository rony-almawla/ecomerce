const fp = require("fastify-plugin");

module.exports = fp(async function(fastify,opts){
    fastify.register(require("@fastify/jwt",{
  secret: process.env.JWT_Signing_SECRET
}))

    fastify.decorate("jwtAuth", async function(request, reply){
        try{
            await request.jwtVerify();
        }catch(error){
            reply.status(401).send({message: "Unauthorized"});
        }
    })

    fastify.decorate("hasRole", function(role){
        return async function(request, reply){
            const userRole = request.user.payload.role;
            if(role !== userRole){
                reply.status(403).send({message: "Forbidden. Does not have the correct role"});
            }
        }
    })

})