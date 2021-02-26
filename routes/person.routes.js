const { Router } = require("express");

const {
  createPerson,
  deletePerson,
  updatePerson,
  detailsPerson,
} = require("../controller/person.controller");

const router = Router();

const { isAuthenticatedUser, authorizeRole } = require("../middlewares/auth");

router
  .route("/admin/person/new")
  .post(isAuthenticatedUser, authorizeRole("admin"), createPerson);

router
  .route("/admin/person/:id")
  .get(isAuthenticatedUser, authorizeRole("admin"), detailsPerson)
  .put(isAuthenticatedUser, authorizeRole("admin"), updatePerson)
  .delete(isAuthenticatedUser, authorizeRole("admin"), deletePerson);

module.exports = router;
