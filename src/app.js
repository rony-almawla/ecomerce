require('dotenv').config();
const fastify = require("fastify")({ logger: true });
const mongoose = require("mongoose");
const jwtPlugin = require('../plugins/jwtPlugin');

const { basicAuth } = require("./middlewares/auth");
const auth = require('./middlewares/auth');

fastify.register(jwtPlugin)


// Import routes
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const cartRoutes = require('./routes/cart.routes');



// Connect to MongoDB
console.log("MONGODB_URI:", process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to the database"))
  .catch(e => console.log("Error connecting to database", e));

// Start the server and register routes
async function startServer() {
  fastify.register(userRoutes, { prefix: "/api/v1/users" });
  fastify.register(productRoutes, { prefix: "/api/v1/products" });
  fastify.register(orderRoutes, {prefix: "/api/v1/orders"});
  fastify.register(cartRoutes,{prefix: "/api/v1/carts"});

  // fastify.addHook("preHandler", basicAuth);


  try {
    await fastify.listen({
      port: parseInt(process.env.PORT) || 5000,
      host: '0.0.0.0'
    });
    fastify.log.info(`🚀 Server is running on port ${fastify.server.address().port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

startServer();
