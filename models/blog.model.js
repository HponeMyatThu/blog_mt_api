const mongoose = require("mongoose");
const { postStatus } = require("../constants/status");
const { Schema } = require("./base.model");
const VAR = require("../constants/global");

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    description : {
      type: String,
    },
    url_list: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Image",
    },
    status: {
      type: String,
      default: postStatus.pending,
      enum: [VAR.PENDING, VAR.APPROVED, VAR.REJECTED],
    },
    category: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
    },
    posted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    modified_at: {
      type: Date,
    },
    modified_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  "users",
  undefined,
  {
    strictPopulate: false,
  }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
