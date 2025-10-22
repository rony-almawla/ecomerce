const Order = require("../models/order.model");


async function getAllOrders(request, reply){
    try{
        const { page = 1, limit = 10, userId, status, minTotal, maxTotal, sort = 'createdAt' } = request.query;
        const filter = {};

        if(userId) filter.userId = userId;
        if(status) filter.status = status;
        if(minTotal || maxTotal){
            filter.totalPrice = {};
            if(minTotal) filter.totalPrice.$gte = Number(minTotal);
            if(maxTotal) filter.totalPrice.$lte = Number(maxTotal);
        }

        const total = await Order.countDocuments(filter);
        const skip = (Number(page) - 1) * Number(limit);

        const orders = await Order.find(filter)
            .populate('userId')
            .populate('items.productId')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        reply.send({
            metadata: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
            data: orders
        });
    }catch(error){
        reply.status(500).send({ error: 'Failed to fetch orders', details: error.message });
    }
}

async function searchOrders(request, reply){
    try{
        const { query, page = 1, limit = 10, sort = 'createdAt' } = request.query;
        const filter = {};

        if(query){
            filter.$or = [
                { 'items.productId.name': { $regex: query, $options: 'i' } },
                { 'userId.name': { $regex: query, $options: 'i' } }
            ];
        }

        const total = await Order.countDocuments(filter);
        const skip = (Number(page) - 1) * Number(limit);

        const orders = await Order.find(filter)
            .populate('userId')
            .populate('items.productId')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        reply.send({
            metadata: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
            data: orders
        });
    }catch(error){
        reply.status(500).send({ error: 'Search failed', details: error.message });
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

module.exports = {
    getAllOrders, searchOrders, getOrderById, createOrder, updateOrder
};