import Joi from "joi";

export const createOrderSchema = Joi.object({
  productId: Joi.number().integer().required(),
  qty: Joi.number().integer().min(1).required(),
});
