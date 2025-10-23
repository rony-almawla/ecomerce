const Joi = require("joi");

const cartItemSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required()
});

const createCartSchema = Joi.object({
  userId: Joi.string().required(),
  items: Joi.array().items(cartItemSchema).min(1).required()
});

const updateCartSchema = Joi.object({
  items: Joi.array().items(cartItemSchema).min(1).required()
});

module.exports = { createCartSchema, updateCartSchema };