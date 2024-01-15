const User = require("../models/user.model");
const role = require("../constants/role");
const bcrypt = require("bcrypt");
const { userStatus } = require("../constants/status");
const VAR = require("../constants/global");

const createDefaultUser = async () => {
  try {
    const existingUsers = await User.find();

    const hashPassword = await bcrypt.hash("admin123",10);

    if (existingUsers.length === 0) {
      const defaultUserData = {
        username: "admin",
        password: hashPassword,
        email: "admin@example.com",
        role: VAR.ADMIN,
        status: userStatus.active,
        description: "Default admin user",
        creator: null,
        updater: null,
      };

      const defaultUser = new User(defaultUserData);
      await defaultUser.save();

      console.log("Default user created:", defaultUser);
    }
  } catch (error) {
    console.error("Error creating default user:", error);
    res.status(500).send("Internal Server Error");
    throw new Error(error.message);
  }
};

module.exports = createDefaultUser;
