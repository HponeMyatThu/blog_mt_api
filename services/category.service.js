const Category = require("../models/category.model");
const {
  getToken,
  checkId,
  notForUser,
  isAdmin,
  isExist,
  sortSearchPaginate,
  checkExist,
} = require("./base.service");

const categoriesCreateService = async (req) => {
  try {
    const { name } = req.body;
    const decodedToken = await getToken(req);

    notForUser(decodedToken);
    isAdmin(decodedToken);
    await isExist(name, "Name", Category, "exists");

    const category = await Category.create({
      ...req.body,
      creator: decodedToken.userId,
      created_by: decodedToken.userId,
    });
    return category;
  } catch (error) {
    throw new Error(error.message);
  }
};

const categoriesGetService = async (
  page = 1,
  pageSize = 6,
  array,
  sortBy,
  req
) => {
  try {
    const decodedToken = await getToken(req);
    notForUser(decodedToken);
    isAdmin(decodedToken);

    const result = await sortSearchPaginate(
      page,
      pageSize,
      sortBy,
      Category,
      req,
      array,
      null
    );
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const categoriesUpdateService = async (req) => {
  try {
    const id = req.body.id;
    
    const decodedToken = await getToken(req);
    notForUser(decodedToken);
    isAdmin(decodedToken);

    await checkId(id, Category, "Id");
    await checkExist(id, Category, "Check Exist Id");

    const category = await Category.findByIdAndUpdate(
      req.body.id,
      { ...req.body, updater: decodedToken.userId },
      { new: true , runValidators: true}
    );
    return category;
  } catch (error) {
    throw new Error(error.message);
  }
};

const categoriesDeleteService = async (req) => {
  try {
    const id = req.body.id;
    const decodedToken = await getToken(req);

    notForUser(decodedToken);
    isAdmin(decodedToken);

    await checkId(id, Category, "Id");
    await checkExist(id, Category, "Check Exist Id");

    const update = await Category.findByIdAndUpdate(
      id,
      { isDeleted: true, updater: decodedToken.userId },
      { new: true, runValidators: true }
    );
    return update;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  categoriesCreateService,
  categoriesGetService,
  categoriesUpdateService,
  categoriesDeleteService,
};
