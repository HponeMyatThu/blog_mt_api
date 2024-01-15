const { badRequest } = require("../controllers/base.controller");
const { loginUserSchema } = require("../schemas/login.schema");

const loginValidator = (req, res, next) => {
  const { error } = loginUserSchema.validate(req.body);
  if (error) {
    return badRequest(res, (message = "Validation failed"), (data = error.message));
  }
  next();
};

module.exports = loginValidator;
