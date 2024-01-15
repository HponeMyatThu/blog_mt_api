const mongoose = require("mongoose");
const { Schema } = require("./base.model");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  "users",
  undefined,
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
