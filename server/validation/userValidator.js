const Joi = require("joi");

const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  bio: Joi.string().max(160).allow("").optional(), 
});

module.exports = { updateProfileSchema };