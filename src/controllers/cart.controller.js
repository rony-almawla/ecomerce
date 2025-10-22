const Cart = require("../models/cart.model");

async function getAllCarts(request, reply) {
    try {
        const { page = 1, limit = 10, userId, hasItems, productId, sort = 'createdAt' } = request.query;
        const filter = {};

        if (userId) filter.userId = userId;
        if (hasItems === 'true') filter['items.0'] = { $exists: true };
        if (hasItems === 'false') filter['items.0'] = { $exists: false };
        if (productId) filter['items.productId'] = productId;

        const total = await Cart.countDocuments(filter);
        const skip = (Number(page) - 1) * Number(limit);

        const carts = await Cart.find(filter)
            .populate('userId')
            .populate('items.productId')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        reply.send({
            metadata: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
            data: carts
        });

    } catch (error) {
        reply.status(500).send({ error: 'Failed to fetch carts', details: error.message });
    }
}

async function searchCarts(request, reply) {
    try {
        const { query, page = 1, limit = 10, sort = 'createdAt' } = request.query;
        const filter = {};

        if (query) {
            filter.$or = [
                { 'userId.name': { $regex: query, $options: 'i' } },
                { 'items.productId.name': { $regex: query, $options: 'i' } }
            ];
        }

        const total = await Cart.countDocuments(filter);
        const skip = (Number(page) - 1) * Number(limit);

        const carts = await Cart.find(filter)
            .populate('userId')
            .populate('items.productId')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        reply.send({
            metadata: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
            data: carts
        });

    } catch (error) {
        reply.status(500).send({ error: 'Cart search failed', details: error.message });
    }
}



async function getCartById(request, reply){
    try{
        const cart = await Cart.findById(request.params.id).populate("userId").populate("items.productId");
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
        const cart = await Cart.findByIdAndUpdate(request.params.id, request.body, {
            new: true,
            runValidators: true,
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
    getAllCarts, searchCarts, getCartById, createCart, updateCart, deleteCart 
};