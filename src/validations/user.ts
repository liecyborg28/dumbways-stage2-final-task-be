import Joi from "joi";

export const transferPointsSchema = Joi.object({
  amount: Joi.number().integer().min(1000).required(),
  receiverId: Joi.number().integer().required(),
});
