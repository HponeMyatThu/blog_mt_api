const {
  categoriesCreateService,
  categoriesGetService,
  categoriesUpdateService,
  categoriesDeleteService,
} = require("../services/category.service");
const { created, ok, retrieved } = require("./base.controller");

const categoriesCreate = async (req, res, next) => {
  try {
    await categoriesCreateService(req);
    return created(
      res,
      (message = "successfully created category"),
      (data = null)
    );
  } catch (error) {
    next(error);
  }
};

const categoriesGet = async (req, res, next) => {
  try {
    const { page, pageSize, name, sortBy } = req.query;
    const array = [{ key: "name", value: name }];

    const result = await categoriesGetService(
      page,
      pageSize,
      array,
      sortBy,
      req
    );
    
    return ok(
      res,
      (message = "successfully retrieved category"),
      (data = result)
    );
  } catch (error) {
    next(error);
  }
};

const categoriesUpdate = async (req, res, next) => {
  try {
    await categoriesUpdateService(req);
    return ok(res, (message = "successfully updated category"), (data = null));
  } catch (error) {
    next(error);
  }
};

const categoriesDelete = async (req, res, next) => {
  try {
    await categoriesDeleteService(req);
    return ok(res, (message = "successfully deleted category"), (data = null));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  categoriesCreate,
  categoriesGet,
  categoriesUpdate,
  categoriesDelete,
};
