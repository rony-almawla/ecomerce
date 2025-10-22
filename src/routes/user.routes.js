const auth = require("../../middlewares/auth");
const {basicAuth} = require("../controllers/user.controller");
const User = require("../models/user.model");

//in able to map routes in fastify
async function routes(fastify,options){
    fastify.get("/",{onRequest: [fastify.jwtAuth]},  userController.getAllUsers);
    fastify.get("/:id",  userController.getUserById);
    fastify.post("/",{onRequest: [fastify.jwtAuth, fastify.hasRole("Admin")]},userController.createUser);
    fastify.put("/:id",  userController.updateUser);
    fastify.delete("/:id",  userController.deleteUser);
    fastify.post("/login", async (request, reply)=>{
        const {email,body} = request.body;
        //check the password and username
         try{
            const user = await User.findOne({email}).select(["pasword", "role","name"]);
            if(!user){
                return reply.status(401).send({error:" User notfound"});
            }

            const isMatch = await user.comparePassword(password);

            if(!isMatch){
                return reply.status(401).send({error: "Incorrect password "})
            }

            //if valid then sign a token
            const token = fastify.jwt.sign({
                payload: {
                    email, name:user.name, role:user.role
                }
            })
            //then it will return
            reply.send({token});

        }catch(error){
            console.log(error)
            return reply.status(500)({error:'An error occured during authorization'})
        }




        
        
    })

}

module.exports = routes;