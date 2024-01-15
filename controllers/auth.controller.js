const { response } = require("./base.controller");
const authService = require("../services/auth.service");
const VAR = require("../constants/global");

const register = async (req, res, next) => {
  try {
    await authService.registerUser(req);
    return response(
      res,
      (status = 201),
      (message = VAR.REGISTER_SUCCESS),
      (data = null)
    );
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const token = await authService.loginUser(req, res);
    return response(
      res,
      (status = 200),
      (message = VAR.LOGIN_SUCCESS),
      (data = token)
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
};
