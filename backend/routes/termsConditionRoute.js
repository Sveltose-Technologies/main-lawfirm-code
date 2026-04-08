const express = require("express");
const {
  createTerms,
  getAllTerms,
  getTermsById,
  updateTerms,
  deleteTerms
} = require("../controllers/termsConditionController");

const { verifyToken } = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissionMiddleware");

const router = express.Router();

/* ================= CREATE ================= */
router.post(
  "/create",
  verifyToken,
  checkPermission("terms_create"),
  createTerms
);

/* ================= GET ALL ================= */
router.get(
  "/getall",
  verifyToken,
  checkPermission("terms_view"),
  getAllTerms
);

/* ================= GET BY ID ================= */
router.get(
  "/get/:id",
  verifyToken,
  checkPermission("terms_view"),
  getTermsById
);

/* ================= UPDATE ================= */
router.put(
  "/update/:id",
  verifyToken,
  checkPermission("terms_update"),
  updateTerms
);

/* ================= DELETE ================= */
router.delete(
  "/delete/:id",
  verifyToken,
  checkPermission("terms_delete"),
  deleteTerms
);

module.exports = router;