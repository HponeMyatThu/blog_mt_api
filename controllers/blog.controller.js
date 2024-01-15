const {
  updateApproveService,
  updateRejectService,
  createBlogService,
  createTempFileService,
  deleteBlogService,
  updateBlogService,
  getBlogsUserService,
  getBlogsAdminService,
  getBlogByIdService,
  getBlogsService,
} = require("../services/blog.service");
const { ok, retrieved } = require("./base.controller");
const VAR = require("../constants/global");

const updateApprove = async (req, res, next) => {
  try {
    await updateApproveService(req);
    return ok(res, (message = "Blog approved"));
  } catch (err) {
    next(err);
  }
};

const updateReject = async (req, res, next) => {
  try {
    await updateRejectService(req);
    return ok(res, (message = "Blog rejected"));
  } catch (err) {
    next(err);
  }
};

const getBlogById = async (req, res, next) => {
  try {
    const blog = await getBlogByIdService(req);
    return retrieved(
      res,
      (name = "getBlogById"),
      (message = "single blog"),
      (data = blog)
    );
  } catch (err) {
    next(err);
  }
};

const getBlogs= async (req, res, next) => {
  const {
    page,
    pageSize,
    title,
    content,
    description,
    creator,
    status,
    sortBy,
  } = req.query;

  const array = [
    { key: "title", value: title },
    { key: "content", value: content },
    { key: "description", value: description },
    { key: "creator", value: creator },
    { key: "status", value: status },
  ];

  const blogs = await getBlogsService(page, pageSize, array, sortBy, req);
  return res.json({ results: blogs });
};

const createBlog = async (req, res, next) => {
  try {
    const result = await createBlogService(req);
    return ok(res, (message = "Blog created"), (data = result));
  } catch (err) {
    next(err);
  }
};

const createTempFile = async (req, res, next) => {
  try {
    const result = await createTempFileService(req);
    return ok(res, (message = "Temp created"), (data = result));
  } catch (err) {
    next(err);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const result = await deleteBlogService(req);
    return ok(res, (message = "Blog deleted"), (data = result));
  } catch (err) {
    next(err);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const result = await updateBlogService(req);
    return ok(res, (message = "Blog updated"), (data = result));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  updateApprove,
  updateReject,
  createBlog,
  createTempFile,
  deleteBlog,
  updateBlog,
  getBlogs,
  getBlogById,
};
