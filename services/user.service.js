const User = require("../models/user.model");
const VAR = require("../constants/global");
const bcrypt = require("bcrypt");
const {
  checkId,
  checkallowedUpdate,
  checkExist,
  softDelete,
  updateStatus,
  getToken,
  updateRole,
  sortSearchPaginate,
  isAdmin,
  notForUser,
} = require("./base.service");
const {
  notAcceptableError,
} = require("../errors/db.error");

const getProfileService = (req, res) => {
  return req.user.username;
};

const updateProfileService = async (req) => {
  try {
    const decodedToken = await getToken(req);
    await checkId(decodedToken.userId, User, "userId");
    await checkExist(decodedToken.userId, User, "userId");

    const allowedUpdates = ["username", "email", "password", "description"];
    const checkAllowUpdate = await checkallowedUpdate(
      req.body,
      allowedUpdates,
      User,
      "Profile-Update"
    );

    if (checkAllowUpdate === VAR.VALID_UPDATES) {
      const updatedUser = await User.findByIdAndUpdate(
        decodedToken.userId,
        {
          $set: req.body,
          updater: decodedToken.userId,
          password: bcrypt.hashSync(req.body.password, 10),
        },
        { new: true, runValidators: true }
      );

      return updatedUser;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateAccountActiveService = async (req) => {
  await updateStatus(req, VAR.ACTIVE, User, "active");
  return "active";
};

const updateAccountSuspendService = async (req) => {
  await updateStatus(req, VAR.SUSPENDED, User, "suspend");
  return "suspend";
};

const getAllUsersDetailsService = async (
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
      User,
      req,
      array,
      null
    );
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteAccountService = async (req, res, next) => {
  try {
    await softDelete(req, User, "deleteAccount");
    return "success";
  } catch (error) {
    throw new Error(error.message);
  }
};

const makeAdminService = async (req) => {
  return await updateRole(req, VAR.ADMIN, User, "admin");
};

const makeUserService = async (req) => {
  return await updateRole(req, VAR.USER, User, "user");
};

module.exports = {
  getProfileService,
  updateProfileService,
  updateAccountActiveService,
  getAllUsersDetailsService,
  deleteAccountService,
  updateAccountSuspendService,
  makeAdminService,
  makeUserService,
};
