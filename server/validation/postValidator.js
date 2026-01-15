const Joi = require("joi");

const createPostSchema = Joi.object({
  caption: Joi.string().optional().allow(""),
  tags: Joi.string().optional(), 
});

module.exports = { createPostSchema };