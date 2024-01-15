const { badRequest } = require("../controllers/base.controller");
const { registerUserSchema } = require("../schemas/register.schema");

const registerValidator = (req, res, next) => {
  const { error } = registerUserSchema.validate(req.body);
  if (error) {
    return badRequest(res, (message = "Validation failed"), (data = error.message));
  }
  next();
};

module.exports = registerValidator;
