import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().max(100).required(),
  password: Joi.string().min(8).required(),
  address: Joi.string().max(500).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const resetSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
});
