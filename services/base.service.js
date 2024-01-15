const mongoose = require("mongoose");
const _ = require("lodash");
const {
  invalidIdError,
  invalidError,
  unauthorizedError,
  alreadyExistsError,
  itemNotFoundError,
} = require("../errors/db.error");
const jwt = require("jsonwebtoken");
const VAR = require("../constants/global");

exports.checkPhotoStatus = async (req, Model) => {
  let validImages = [];

  const validImageNames = req.body.url_list
    .filter((img) => img.status === true)
    .map((img) => img.name);

  for (const name of validImageNames) {
    const exist = await this.notFound(name, "Name", Model, "Image");
    validImages.push(exist._id);

    await Model.findByIdAndUpdate(
      exist._id,
      { status: VAR.IMAGE_FILE },
      { new: true, runValidators: true }
    )
  }
  return validImages;
};

exports.notFound = async (value, key, Model, message) => {
  try {
    const filter = { [key.toLowerCase()]: value };
    const exist = await Model.findOne(filter);

    if (!exist) {
      throw itemNotFoundError(`${message} not found for ${key} : ${value}`);
    }

    return exist;
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.isExist = async (value, key, Model, message) => {
  try {
    const filter = { [key.toLowerCase()]: value };
    const exist = await Model.findOne(filter);

    if (exist) {
      throw alreadyExistsError(`${key} : ${value} already ${message}`);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.checkId = async (id, Model, key) => {
  const result = await this.checkValidObjectId(id, key);
  const document = await Model.findById(id);
  if (!document) {
    throw invalidIdError(key);
  }
};

exports.updateStatus = async (req, status, Model, key) => {
  try {
    const decodedToken = await this.getToken(req);
    this.notForUser(decodedToken);
    this.isAdmin(decodedToken);

    if (decodedToken?.role === VAR.ADMIN) {
      console.log(req.body);
      const { id } = req.body;
      await this.checkId(id, Model, `id : ${decodedToken} does not exist`);
      await this.checkExist(id, Model, key);

      const update = await Model.findByIdAndUpdate(
        id,
        {
          $set: {
            status: status,
            updater: decodedToken.userId,
          },
        },
        { new: true, runValidators: true }
      );
      return update;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.softDelete = async (req, Model, key) => {
  const decodedToken = await this.getToken(req);
  this.notForAdmin(decodedToken);
  this.isUser(decodedToken);

  await this.checkId(
    decodedToken.userId,
    Model,
    `id: ${decodedToken.userId} does not exist`
  );
  await this.checkExist(decodedToken.userId, Model, key);

  const update = await Model.findByIdAndUpdate(
    decodedToken.userId,
    {
      $set: {
        isDeleted: true,
        updater: decodedToken.userId,
      },
    },
    { new: true, runValidators: true }
  );
  return update;
};

exports.updateRole = async (req, role, Model, key) => {
  try {
    const decodedToken = await this.getToken(req);
    this.notForUser(decodedToken);
    this.isAdmin(decodedToken);

    if (decodedToken?.role === VAR.ADMIN) {
      const { id } = req.body;
      await this.checkId(id, Model, `id: ${id} does not exist`);
      await this.checkExist(id, Model, "role");

      const update = await Model.findByIdAndUpdate(
        id,
        {
          $set: {
            role: role,
            updater: decodedToken.userId,
          },
        },
        { new: true, runValidators: true }
      );
      return update;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.isAdmin = (decodedToken) => {
  if (!decodedToken || decodedToken?.role != VAR.ADMIN) {
    throw unauthorizedError("role must be admin");
  }
};

exports.isUser = (decodedToken) => {
  if (!decodedToken || decodedToken?.role != VAR.USER) {
    throw unauthorizedError("role must be user");
  }
};

exports.notForAdmin = (decodedToken) => {
  if (!decodedToken || decodedToken?.role === VAR.ADMIN) {
    throw unauthorizedError(`permission denied`);
  }
};

exports.notForUser = (decodedToken) => {
  if (!decodedToken || decodedToken?.role === VAR.USER) {
    throw unauthorizedError(`permission denied`);
  }
};

exports.getToken = async (req) => {
  const TOKEN = req.headers.authorization;
  if (!TOKEN) {
    throw unauthorizedError(`You are not authorized to perform this operation`);
  }
  const DECODETOKEN = jwt.verify(TOKEN, process.env.SECRET_KEY);
  return DECODETOKEN;
};

exports.sortSearchPaginate = async (
  page = 1,
  pageSize = 10,
  sortBy,
  Model,
  req,
  array,
  populate
) => {
  try {
    let criteria = {};
    let query = {};

    criteria = exports.addConditionsToCriteria(criteria, array);

    const isCriteriaEmpty = Object.values(criteria).every(
      (value) => value === ""
    );

    if (!isCriteriaEmpty) {
      query = {
        $and: [criteria],
      };
    }

    let result = {
      content: await Model.find(query)
        .sort(sortBy ? { sortBy: -1 } : { createdAt: -1 })
        .skip((parseInt(page) - 1) * parseInt(pageSize))
        .limit(pageSize)
        .populate(populate),
      total: await Model.countDocuments(query),
    };
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.addConditionsToCriteria = (criteria, conditions) => {
  conditions.forEach((condition) => {
    const { key, value, regex } = condition;
    criteria = exports.addConditionToCriteria(
      criteria,
      key,
      value ? { $regex: new RegExp(`.*${value}.*`, regex || "i") } : null
    );
  });
  return criteria;
};

exports.addConditionToCriteria = (criteria, key, value) => {
  if (value) {
    return { ...criteria, [key]: value };
  }
  return criteria;
};

exports.checkExist = async (id, Model, key) => {
  try {
    const exist = await Model.findById(id);
    if (!exist) {
      throw itemNotFoundError(
        `${Model.modelName} with ${key} ${id} does not exist`
      );
    }
    return exist;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.checkallowedUpdate = async (reqBody, valideUpdateArray, Model, key) => {
  const updates = Object.keys(reqBody);
  const notAllowedUpdates = [];

  const isValidOperation = updates.every((update) => {
    !valideUpdateArray.includes(update) && notAllowedUpdates.push(update);
    return valideUpdateArray.includes(update);
  });

  if (!isValidOperation) {
    throw invalidError(`Invalid updates: ${notAllowedUpdates.join(", ")}`);
  }
  return VAR.VALID_UPDATES;
};

exports.getToken = async (req) => {
  const TOKEN = req.headers.authorization;
  if (!TOKEN) {
    throw unauthorizedError(`You are not authorized to perform this operation`);
  }
  const DECODETOKEN = jwt.verify(TOKEN, process.env.SECRET_KEY);
  return DECODETOKEN;
};

exports.checkValidObjectId = async (id, key) => {
  if (!mongoose.isValidObjectId(id)) {
    throw invalidIdError(key);
  }
};

exports.getObjectId = async (id, key) => {
  await this.checkValidObjectId(id, key);
  if (id) {
    return new mongoose.Types.ObjectId(id);
  }
};

exports.projectionPipeline = [
  { $addFields: { id: "$_id" } },
  {
    $project: {
      _id: 0,
      __v: 0,
      isDeleted: 0,
      creator: 0,
      updater: 0,
      createdAt: 0,
      updatedAt: 0,
      fileStoragePath: 0,
    },
  },
];

exports.filterById = (pipelineStages, obj) => {
  const filters = _.pickBy(obj, (v) => v !== undefined);

  for (key in filters) {
    pipelineStages.push({ $match: { [key]: filters[key] } });
  }
};
