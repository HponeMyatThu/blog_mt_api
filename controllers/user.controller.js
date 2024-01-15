const {
  updateProfileService,
  getProfileService,
  updateAccountActiveService,
  getAllUsersDetailsService,
  deleteAccountService,
  updateAccountSuspendService,
  makeAdminService,
  makeUserService,
} = require("../services/user.service");
const VAR = require("../constants/global");
const { ok, retrieved, deleted } = require("./base.controller");

const getUserDetails = (req, res) => {
  res.json("Hello I'm a user");
};

const getProfile = (req, res) => {
  try {
    const name = getProfileService(req);
    res.json({ message: `Welcome ${name}` });
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    await updateProfileService(req);
    return ok(res, (message = "Profile updated"));
  } catch (err) {
    next(err);
  }
};

const updateAccountActive = async (req, res, next) => {
  try {
    await updateAccountActiveService(req);
    return ok(res, (message = "Account active updated"));
  } catch (err) {
    next(err);
  }
};

const updateAccountSuspend = async (req, res, next) => {
  try {
    await updateAccountSuspendService(req);
    return ok(res, (message = "Account suspended updated"));
  } catch (err) {
    next(err);
  }
};

const getAllUserDetails = async (req, res, next) => {
  try {
    const { page, pageSize, username, email, status, description, sortBy } =
      req.query;

    const array = [
      { key: "username", value: username },
      { key: "email", value: email },
      { key: "status", value: status },
      { key: "description", value: description },
    ];

    const result = await getAllUsersDetailsService(
      page,
      pageSize,
      array,
      sortBy,
      req
    );

    return retrieved(
      res,
      (name = "users"),
      (message = `Total Length: ${result.total} Page Size: ${pageSize}`),
      (data = result)
    );
  } catch (err) {
    next(err);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const result = await deleteAccountService(req);
    return deleted(
      res,
      (name = "Account deleted successfully"),
      (data = result)
    );
  } catch (err) {
    next(err);
  }
};

const makeAdmin = async (req, res, next) => {
  try {
    await makeAdminService(req);
    return ok(res, (message = "Account made admin"));
  } catch (err) {
    next(err);
  }
};

const makeUser = async (req, res, next) => {
  try {
    await makeUserService(req);
    return ok(res, (message = "Account made user"));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  deleteAccount,
  getUserDetails,
  getProfile,
  updateProfile,
  updateAccountActive,
  getAllUserDetails,
  updateAccountSuspend,
  makeAdmin,
  makeUser,
};
