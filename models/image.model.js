const mongoose = require("mongoose");
const { Schema } = require("./base.model");
const VAR = require("../constants/global");

const imageSchema = new Schema(
  {
    name:{
        type: String,
        required: true,
    },
    path:{
        type: String,
        required: true,
    },
    base64:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        default: VAR.TEMP_FILE,
        enum: [VAR.IMAGE_FILE, VAR.TEMP_FILE],
    }
  },
  "users",
  undefined
);

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;
