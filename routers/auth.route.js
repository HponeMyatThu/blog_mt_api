const { register, login } = require("../controllers/auth.controller");
const express = require("express");
const registerValidator = require("../validators/register.validator");
const loginValidator = require("../validators/login.validator");
const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);

module.exports = router;
