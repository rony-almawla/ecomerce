const User = require("../models/user.model");

async function getAllUsers(request, reply){
    try{
        const users = await User.find();
        reply.send(users);
    }catch(error){
        reply.status(500).send(error);
    }
}
async function getUserById(request, reply){
    try{
        const user = await User.findById(request.params.id);
        reply.send(user);
    }catch(error){
        reply.status(500).send(error);
    }
}
async function createUser(request, reply){
    try{
        const user = new User(request.body);
        const result = await user.save();
        reply.send(result);
    }catch(error){
        reply.status(500).send(error);
    }
}
// async function createUser(request, reply){
//     try{
//         const { name, email, password, role } = request.body;

//         const user = new User({
//             name,
//             email,
//             passwordHash: password, // assign plain password to passwordHash
//             role
//         });

//         const result = await user.save(); // triggers pre-save hook

//         // remove passwordHash before sending response
//         const { passwordHash, ...userWithoutPassword } = result.toObject();

//         reply.status(201).send(userWithoutPassword);

//     }catch(error){
//         reply.status(500).send({ error: "Failed to create user", details: error.message });
//     }
// }

async function updateUser(request, reply){
    try{
        const user = await User.findByIdAndUpdate(request.params.id, request.body, {
            new:true, 
        })
        reply.send(user);
    }catch(error){
        reply.status(500).send(error);
    }
}
async function deleteUser(request, reply){
    try{
        await User.findByIdAndDelete(request.params.id);
        reply.status(204).send("");
    }catch(error){
        reply.status(500).send(error);
    }
}

module.exports ={
    getAllUsers, getUserById, createUser,deleteUser,updateUser
}