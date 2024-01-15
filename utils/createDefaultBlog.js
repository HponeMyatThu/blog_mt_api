const { postStatus } = require("../constants/status");
const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const VAR = require("../constants/global");
const Image = require("../models/image.model");
const Category = require("../models/category.model");

const createDefaultBlog = async () => {
  try {
    const existingBlog = await Blog.find();
    const existingUser = await User.findOne({role: VAR.ADMIN});
    const existingImage = await Image.findOne();
    const existingCategory = await Category.findOne();
  
    if (existingBlog.length === 0 && existingUser && existingImage && existingCategory) {
      const defaultBlogData = {
        title: "Default blog",
        content: "Default blog content",
        url_list: [existingImage._id],
        status: postStatus.pending,
        posted_by: existingUser._id.toString(),
        created_at: new Date(),
        category: [existingCategory._id],
        description: "Default blog description",
        creator: existingUser._id.toString(),
        updater: null,
      };
      const defaultBlog = new Blog(defaultBlogData);
      await defaultBlog.save();
      console.log("Default blog created:", defaultBlog);
    }
  } catch (err) {
    console.error("Error creating default blog:", err);
    throw new Error(err.message);
  }
};

module.exports = createDefaultBlog;
