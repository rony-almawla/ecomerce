const Joi = require("joi");

const orderItemSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().positive().required()
});

const createOrderSchema = Joi.object({
  userId: Joi.string().required(),
  items: Joi.array().items(orderItemSchema).min(1).required(),
  totalPrice: Joi.number().positive().required(),
  status: Joi.string().valid("pending", "shipped", "delivered", "cancelled").default("pending")
});

const updateOrderSchema = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).optional(),
  totalPrice: Joi.number().positive().optional(),
  status: Joi.string().valid("pending", "shipped", "delivered", "cancelled").optional()
}).min(1);

module.exports = { createOrderSchema, updateOrderSchema };
