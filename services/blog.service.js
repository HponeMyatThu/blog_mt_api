const VAR = require("../constants/global");
const Blog = require("../models/blog.model");
const { itemNotFoundError, unauthorizedError } = require("../errors/db.error");
const {
  checkId,
  checkPhotoStatus,
  checkExist,
  checkallowedUpdate,
  getToken,
  updateStatus,
  sortSearchPaginate,
} = require("./base.service");
const multer = require("multer");
const fs = require("fs");
const Image = require("../models/image.model");

const getBlogsService = async (page = 1, pageSize = 6, array, sortBy, req) => {
  const result = await sortSearchPaginate(
    page,
    pageSize,
    sortBy,
    Blog,
    req,
    array,
    "url_list"
  );
  return result;
};

const getBlogByIdService = async (req) => {
  try {
    const { id } = req.params;
    await checkId(id, Blog, "check id");
    const blog = await checkExist(id, Blog, "check exist blog");
    return blog;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateApproveService = async (req) => {
  const blog = await updateStatus(req, VAR.APPROVED, Blog, "active");
  return blog;
};

const updateRejectService = async (req) => {
  const blog = await updateStatus(req, VAR.REJECTED, Blog, "rejected");
  return blog;
};

const createBlogService = async (req) => {
  try {
    const decodedAuthToken = await getToken(req);

    if (decodedAuthToken) {
      const validImg = await checkPhotoStatus(req, Image);

      await Blog.create({
        ...req.body,
        status: VAR.PENDING,
        url_list: validImg,
        creator: decodedAuthToken.userId,
        post_by: decodedAuthToken.userId,
      });
      return "create blog success";
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

const createTempFileService = async (req) => {
  try {
    const decodedToken = await getToken(req);

    if (!req.files) {
      throw itemNotFoundError("No file uploaded");
    }

    if (decodedToken) {
      const images = [];

      req.files.forEach(async (file) => {
        images.push(file.filename);
        const result = await Image.create({
          name: file.filename,
          path: file.path,
          base64: `data:${file.mimetype};base64,${fs
            .readFileSync(file.path)
            .toString("base64")}`,
          creator: decodedToken.userId,
          post_by: decodedToken.userId,
        });
        return result;
      });
      return images;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteBlogService = async (req) => {
  try {
    const decodedToken = await getToken(req);

    const { id } = req.body;
    await checkId(id, Blog, "check id");
    const blog = await checkExist(id, Blog, "check exists");

    if (decodedToken.userId != blog.creator) {
      throw unauthorizedError(`permission denied`);
    }

    const update = Blog.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        updater: decodedToken.userId,
      },
      { new: true, runValidators: true }
    );
    return update;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateBlogService = async (req) => {
  try {
    const decodedToken = await getToken(req);

    if (decodedToken) {
      const { id } = req.params;
      await checkId(id, Blog, "Check id");
      const blog = await checkExist(id, Blog, "Check Exist id");

      if (blog.creator != decodedToken.userId) {
        throw unauthorizedError(`permission denied`);
      }

      const allowedUpdates = [
        "title",
        "content",
        "description",
        "url_list",
        "category",
      ];

      const checkAllowUpdate = await checkallowedUpdate(
        req.body,
        allowedUpdates,
        Blog,
        "Blog-Update"
      );

      if (checkAllowUpdate === VAR.VALID_UPDATES) {
        const validImg = await checkPhotoStatus(req, Image);

        const update = await Blog.findByIdAndUpdate(
          id,
          {
            ...req.body,
            url_list: validImg,
            updater: decodedToken.userId,
          },
          { new: true, runValidators: true }
        );
        return update;
      }
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/temp");
  },
  filename: (req, file, cb) => {
    const currentDate = new Date()
      .toISOString()
      .replace(/:/g, "-")
      .replace(/\./g, "-");
    cb(null, currentDate + ".jpg");
  },
});

const upload = multer({
  storage: diskStorage,
  limits: { fileSize: 2000000 },
});

module.exports = {
  updateApproveService,
  updateRejectService,
  createBlogService,
  createTempFileService,
  deleteBlogService,
  updateBlogService,
  getBlogsService,
  getBlogByIdService,
  upload,
};
