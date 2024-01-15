const Joi = require("joi");

const createBlogSchema = Joi.object({
  title: Joi.string().alphanum().min(3).max(30).required(),
  description: Joi.string().required(),
  content: Joi.string().required(),
  url_list: Joi.array().required(),
  category: Joi.array().required(),
});

module.exports = { createBlogSchema };