const Joi = require("joi");

const loginUserSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = { loginUserSchema };
