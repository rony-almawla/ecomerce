const Order = require("../models/order.model");


async function getAllOrders(request, reply){
    try{
        const orders = await Order.find().populate('userId').populate('items.productId');
        reply.send(orders);
    }catch(error){
        reply.status(500).send({error:'Failed to fetch oders', details:error.message});
    }
}

async function getOrderById(request,reply){
    try{
        const order = await Order.findById(request.params.id).populate('userId').populate('items.productId');
        if(!order){
            return reply.status(404).send({error: 'Order not found'});
        }
    }catch(error){
        reply.status(500).send({ error: 'Failed to fetch order', details: error.message });

    }
}

async function createOrder(request,reply){
    try{
        const { userId, items, totalPrice, status } = request.body;
        const order = new Order({ userId, items, totalPrice, status });
        const result = await order.save();
        reply.status(201).send(result);
    }catch(error){
        reply.status(400).send({error:'Failed to create order', details:error.message});
    }
}

async function updateOrder(request,reply){
    try{
        const order = await Order.findByIdAndUpdate(request.params.id, request.body,{
            new:true,
            runValidators:true
        });
        if(!order){
            return reply.status(404).send({error:'Order not found'});
        }
    }catch(error){
        reply.status(400).send({error:'Failed to update order', details:error.message});
    }
}

module.exports = {getAllOrders, getOrderById, createOrder,updateOrder};