const router = require("express").Router();
const userRoutes = require("../routers/user.route");
const authRoutes = require("../routers/auth.route");
const blogRoutes = require("../routers/blog.route");
const categoryRoutes = require("../routers/categories.route");
const path = require('path');

router.use("/auth", authRoutes)
router.use("/user", userRoutes);
router.use("/blog", blogRoutes);
router.use("/category", categoryRoutes);

router.get('/photo/:fileName', (req, res) => {
  const fileNameWithTimestamp = req.params.fileName;
  const filePath = path.join(__dirname, '../images/temp', fileNameWithTimestamp);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).json({
        status: 404,
        message: `File not found: ${fileNameWithTimestamp}`,
        data: null,
      });
    }
  });
});


module.exports = router;
