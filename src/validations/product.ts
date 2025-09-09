import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().max(100).required(),
  category: Joi.string().max(100).required(),
  price: Joi.number().integer().min(0).required(),
  qty: Joi.number().integer().min(0).required(),
});

export const updateProductSchema = Joi.object({
  id: Joi.number().integer().required(),
  data: Joi.object().unknown(true).required(),
});

export const deleteProductSchema = Joi.object({
  id: Joi.number().integer().required(),
});

export const restoreProductSchema = Joi.object({
  id: Joi.number().integer().required(),
});
