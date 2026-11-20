const Joi = require('joi');

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

const createRestaurantSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  cuisine: Joi.array().items(Joi.string()).min(1).required(),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  contact: Joi.object({
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
  }).required(),
  openingHours: Joi.object()
    .pattern(
      Joi.string(),
      Joi.object({
        open: Joi.string().pattern(timePattern).required(),
        close: Joi.string().pattern(timePattern).required(),
      })
    )
    .optional(),
  isActive: Joi.boolean().optional(),
  image: Joi.string().optional(),
});

const updateRestaurantSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().min(10).max(500).optional(),
  cuisine: Joi.array().items(Joi.string()).min(1).optional(),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
  }).optional(),
  contact: Joi.object({
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
  }).optional(),
  openingHours: Joi.object()
    .pattern(
      Joi.string(),
      Joi.object({
        open: Joi.string().pattern(timePattern).required(),
        close: Joi.string().pattern(timePattern).required(),
      })
    )
    .optional(),
  isActive: Joi.boolean().optional(),
  image: Joi.string().optional(),
});

module.exports = {
  createRestaurantSchema,
  updateRestaurantSchema,
};
