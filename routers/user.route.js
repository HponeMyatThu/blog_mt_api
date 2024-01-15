const {
  getUserDetails,
  getProfile,
  updateProfile,
  updateAccountActive,
  getAllUserDetails,
  deleteAccount,
  updateAccountSuspend,
  makeAdmin,
  makeUser,
} = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth");

const router = require("express").Router();

router.get("/me", getUserDetails);

router.get("/profile", authenticate, getProfile);
router.get("/getallUsers", authenticate, getAllUserDetails);

router.patch("/deleteAccount", authenticate, deleteAccount);
router.patch("/profile/update", authenticate, updateProfile);

router.patch("/profile/suspend", authenticate, updateAccountSuspend);
router.patch("/profile/active", authenticate, updateAccountActive);

router.patch("/makeAdmin", authenticate, makeAdmin);
router.patch("/makeUser", authenticate, makeUser);

module.exports = router;
