const Product = require("../models/products.model");

async function getAllProducts(request, reply){
    try{
        const products = await Product.find();
        reply.send(products);
    }catch(error){
        reply.status(500).send(error);
    }
}

async function getProductById(request, reply){
    try{
        const product = await Product.findById(request.params.id);
        reply.send(product);
    }catch(error){
        reply.status(500).send(error);
    }
}

async function createProduct(request, reply){
    try{
        const product = new Product(request.body);
        const result  = await product.save();
        reply.send(result);
    }catch(error){
        reply.status(500).send(error);
    }
}

async function updateProduct(request, reply) {
  try {
    const product = await Product.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true }
    );
    reply.send(product);
  } catch (error) {
    reply.status(500).send(error);
  }
}

async function deleteProduct(request,reply){
    try{
        await Product.findByIdAndDelete(request.params.id);
        reply.status(204).send("");
    }catch(error){
        reply.status(500).send(error); 
    }
}

module.exports ={
    getAllProducts, getProductById, createProduct, updateProduct, deleteProduct
}