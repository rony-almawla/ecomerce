const Product = require("../models/products.model");

async function getAllProducts(request, reply) {
    try {
        const { page = 1, limit = 10, sort = 'createdAt', category, minPrice, maxPrice, inStock } = request.query;

        const filter = {};

        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (inStock === 'true') filter.stock = { $gt: 0 };
        if (inStock === 'false') filter.stock = 0;

        const total = await Product.countDocuments(filter);
        const skip = (Number(page) - 1) * Number(limit);

        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        reply.send({
            metadata: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
            data: products
        });

    } catch (error) {
        reply.status(500).send({ error: 'Failed to fetch products', details: error.message });
    }
}

async function searchProducts(request, reply) {
    try {
        const { query, category, minPrice, maxPrice, inStock, page = 1, limit = 10, sort = 'createdAt' } = request.query;

        const filter = {};

        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }
        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (inStock === 'true') filter.stock = { $gt: 0 };
        if (inStock === 'false') filter.stock = 0;

        const total = await Product.countDocuments(filter);
        const skip = (Number(page) - 1) * Number(limit);

        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        reply.send({
            metadata: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
            data: products
        });

    } catch (error) {
        reply.status(500).send({ error: 'Search failed', details: error.message });
    }
}

async function getProductById(request, reply) {
    try {
        const product = await Product.findById(request.params.id);
        reply.send(product);
    } catch (error) {
        reply.status(500).send(error);
    }
}
async function createProduct(request, reply) {
    try {
        const product = new Product(request.body);
        const result = await product.save();
        reply.send(result);
    } catch (error) {
        reply.status(500).send(error);
    }
}

async function updateProduct(request, reply) {
    try {
        const product = await Product.findByIdAndUpdate(request.params.id, request.body, 
            { new: true });

        reply.send(product);
    } catch (error) {
        reply.status(500).send(error);
    }
}

async function deleteProduct(request, reply) {
    try {
        await Product.findByIdAndDelete(request.params.id);
        reply.status(204).send("");
    } catch (error) {
        reply.status(500).send(error);
    }
}


module.exports = {
    getAllProducts,searchProducts,getProductById,createProduct,updateProduct, deleteProduct
};