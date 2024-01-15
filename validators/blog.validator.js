const { badRequest } = require("../controllers/base.controller");
const { createBlogSchema } = require("../schemas/blog.schema");

const creatBlogValidator = (req, res, next) => {
  const { error } = createBlogSchema.validate(req.body);
  if (error) {
    return badRequest(res, (message = "Validation failed"), (data = error.message));
  }
  next();
};

module.exports = { creatBlogValidator };
