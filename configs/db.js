require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
