const express = require("express");
const { createPrivacyPolicy, getAllPrivacyPolicies, getPrivacyPolicyById, updatePrivacyPolicy, deletePrivacyPolicy } = require("../controllers/privacyPolicyController");

const router = express.Router();

router.post("/create", createPrivacyPolicy);
router.get("/getall", getAllPrivacyPolicies);
router.get("/get/:id", getPrivacyPolicyById);
router.put("/update/:id", updatePrivacyPolicy);
router.delete("/delete/:id", deletePrivacyPolicy);

module.exports = router;
