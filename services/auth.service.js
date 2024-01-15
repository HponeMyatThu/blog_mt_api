const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const VAR = require("../constants/global");
const { alreadyExistsError, unauthorizedError } = require("../errors/db.error");
const { isExist } = require("./base.service");

const registerUser = async (req, res) => {
  const { username, email, password, phone_number, description } = req.body;
  try {
    await isExist(username, "Username", User, "register");
    await isExist(email, "Email", User, "register");

    await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 10),
      phone_number,
      description,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    switch (true) {
      case !user:
        throw unauthorizedError(`Username not found: ${username}`);
      case !(await bcrypt.compare(password, user.password)):
        throw unauthorizedError(`Incorrect password: ${password}`);
      case user.status === VAR.SUSPENDED:
        throw unauthorizedError(`Your account is not active`);
      case user.status === VAR.ACTIVE:
        return _generateToken(user);
      default:
        break;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const _generateToken = (user) => {
  const token = jwt.sign(
    {
      userId: user._id,
      userName: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  return token;
};

module.exports = {
  registerUser,
  loginUser,
};
