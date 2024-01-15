const express = require("express");
const {
  categoriesGet,
  categoriesCreate,
  categoriesUpdate,
  categoriesDelete,
} = require("../controllers/category.controller");
const { authenticate } = require("../middlewares/auth");
const { categoryValidator, idValidator, updateCategorySchema } = require("../validators/category.validator");
const router = express.Router();

router.get("/", authenticate, categoriesGet);
router.post("/create", authenticate, categoryValidator, categoriesCreate);
router.put("/update", authenticate, updateCategorySchema, categoriesUpdate);
router.put("/delete", authenticate, idValidator, categoriesDelete);

module.exports = router;
