const { authenticate } = require("../middlewares/auth");
const {
  updateApprove,
  updateReject,
  createBlog,
  createTempFile,
  deleteBlog,
  updateBlog,
  getBlogsUser,
  getBlogsAdmin,
  getBlogById,
  getBlogs,
} = require("../controllers/blog.controller");
const router = require("express").Router();
const { upload, perUpload } = require("../services/blog.service");
const { creatBlogValidator } = require("../validators/blog.validator");

router.patch("/approve", authenticate, updateApprove);
router.patch("/reject", authenticate, updateReject);

router.post("/create", authenticate, creatBlogValidator ,createBlog);
router.post(
  "/create/temp",
  authenticate,
  upload.array("temp", 3),
  createTempFile
);

router.patch("/delete", authenticate, deleteBlog);
router.patch("/update/:id", authenticate, updateBlog);

router.get("/getBlogById/:id", authenticate, getBlogById);
router.get("/get", authenticate, getBlogs);

module.exports = router;
