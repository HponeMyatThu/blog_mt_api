const Category = require("../models/category.model");
const User = require("../models/user.model");
const VAR = require("../constants/global");

const createDefaultCategories = async (req,res,next) => {
  try {
    const existingCategory = await Category.find();
    const existingUser = await User.findOne({role: VAR.ADMIN});
    if(existingCategory.length === 0 && existingUser){
        const defaultCategoryData = {
            name: "Default Category",
            created_by: existingUser._id.toString(),
            created_at: new Date(),
            creator: existingUser._id.toString(),
            updater: null,
        };
        const defaultCategory = new Category(defaultCategoryData);
        await defaultCategory.save();
        console.log("Default category created:", defaultCategory);
    }
  } catch (err) {
    console.error("Error creating default blog:", err);
    throw new Error(err.message);
  }
};

module.exports = createDefaultCategories;
