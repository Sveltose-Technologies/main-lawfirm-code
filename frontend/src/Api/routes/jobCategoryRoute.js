const express = require("express");

const router = express.Router();

const controller = require("../controllers/jobCategoryController");

router.post("/create", controller.createJobCategory);

router.get("/get-all", controller.getAllJobCategories);

router.get("/get-by-id/:id", controller.getJobCategoryById);

router.put("/update/:id", controller.updateJobCategory);

router.delete("/delete/:id", controller.deleteJobCategory);

module.exports = router;