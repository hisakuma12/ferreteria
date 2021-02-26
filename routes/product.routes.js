const { Router } = require("express");
const router = Router();
const { isAuthenticatedUser, authorizeRole } = require("../middlewares/auth");

const {
  newProduct,
  getProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
} = require("../controller/product.controller");

router.route("/products").get(getProducts);
router.route("/product/:id").get(getSingleProduct);

router
  .route("/admin/product")
  .post(isAuthenticatedUser, authorizeRole("admin"), newProduct);
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRole("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRole("admin"), deleteProduct);

module.exports = router;
