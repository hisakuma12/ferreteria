const { Router } = require("express");

const router = Router();

const {
  newOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controller/order.controller");
const { authorizeRole, isAuthenticatedUser } = require("../middlewares/auth");

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRole("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRole("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRole("admin"), deleteOrder);

module.exports = router;
