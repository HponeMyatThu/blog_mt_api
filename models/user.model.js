const mongoose = require("mongoose");
const role = require("../constants/role");
const { userStatus } = require("../constants/status");
const bcrypt = require("bcrypt");
const base = require("../models/base.model");
const VAR = require("../constants/global");

const userSchema = new base.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone_number: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      default: VAR.USER,
      enum: [VAR.ADMIN, VAR.USER],
    },
    status: {
      type: String,
      required: true,
      default: VAR.SUSPENDED,
      enum: [VAR.SUSPENDED, VAR.ACTIVE],
    },
    description: {
      type: String,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  "users",
  undefined,
);

const User = mongoose.model("User", userSchema);
module.exports = User;
