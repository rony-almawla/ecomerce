const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).optional(),
  price: Joi.number().positive().required(),
  category: Joi.string().optional(),
  stock: Joi.number().integer().min(0).default(0),
  isAvailable: Joi.boolean().default(true),
  images: Joi.array().items(Joi.string().uri()).optional()
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().max(500).optional(),
  price: Joi.number().positive().optional(),
  category: Joi.string().optional(),
  stock: Joi.number().integer().min(0).optional(),
  isAvailable: Joi.boolean().optional(),
  images: Joi.array().items(Joi.string().uri()).optional()
}).min(1);

module.exports = { createProductSchema, updateProductSchema };