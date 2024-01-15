const { badRequest } = require("../controllers/base.controller");
const {
  addCategorySchema,
  idScheme,
  updateScheme,
} = require("../schemas/category.schema");

const categoryValidator = (req, res, next) => {
  const { error } = addCategorySchema.validate(req.body);
  if (error) {
    return badRequest(res, "Validation failed", (data = error.message));
  }
  next();
};

const idValidator = (req, res, next) => {
  const { error } = idScheme.validate(req.body);
  if (error) {
    return badRequest(res, "Validation failed", (data = error.message));
  }
  next();
};

const updateCategorySchema = (req, res, next) => {
  const { error } = updateScheme.validate(req.body);
  if (error) {
    return badRequest(
      res,
      (message = "Validation failed"),
      (data = error.message)
    );
  }
  next();
};

module.exports = {
  categoryValidator,
  idValidator,
  updateCategorySchema,
};
