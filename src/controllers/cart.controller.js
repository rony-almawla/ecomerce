const Cart = require("../models/cart.model");

async function getAllCarts(request, reply){
    try{
        const carts = await Carts.find().populate('userId').populate('items.productId');
        reply.send(carts)
    }catch(error){
        reply.status(500).send({error:'Failed to fecth Carts', details:error.message});
    }
}

async function getCartById(request, reply){
    try{
        const cart = await Cart.findById(request.params.id).populate('userId'.populate('items.productId'));
        if(!cart){
            return reply.status(404).send({error:'Cart not Found'});
        }
    }catch(error){
        reply.status(500).send({error:'Cart not found', details:error.message});
    }
}

async function createCart(request, reply){
    try{
        const {userId, items} = request.body;
        const cart = new Cart({userId, items});
            const result = await cart.save();
            reply.status(201).send(result);
    }catch(error){
        reply.status(400).send({error:'Failed to Create Cart', details:error.message});
    }
}

async function updateCart(request,reply){
    try{
        const cart = awaitCart.findByIdAndUpdate(request.params.id, request.body,{
            new:true,
            runValidators:true
        });

    }catch(error){
        reply.status(400).send({error:'Failed to Update Cart', details:error.message});
    }
}

async function deleteCart(request, reply){
    try{
        const {id} = request.params;
        const deleteCart = await Cart.findByIdAndDelete(id);
        if(!deleteCart){
            return reply.status(500).send({error:'Cart not found'});
        }
    }catch(error){
        reply.status(500).send({error:'Failed to delete cart', details:error.message});
    }
}

module.exports = {
  getAllCarts,getCartById,createCart,updateCart,deleteCart
};