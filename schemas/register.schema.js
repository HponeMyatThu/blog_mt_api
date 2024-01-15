const Joi = require("joi");

const registerUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .alphanum()
    .min(6)
    .max(22)
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
    phone_number: Joi.string().pattern(/^09\d{9}$/).required(),
  role: Joi.string(),
  status: Joi.string(),
  description: Joi.string(),
});


module.exports = { registerUserSchema };
