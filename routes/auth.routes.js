const { Router } = require("express");
const router = Router();

const {
  registerUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
} = require("../controller/auth.controller");

const { isAuthenticatedUser, authorizeRole } = require("../middlewares/auth");

router.route("/register").post(registerUser);
router.route("/login").post(login);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRole("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRole("admin"), getUserDetails)
  .put(isAuthenticatedUser, authorizeRole("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRole("admin"), deleteUser);

module.exports = router;
