const express = require("express");
const { createUser, updateUser, deleteUser, getAllAdminUsers } = require("../controllers/adminDashboardContoller");
const router = express.Router();


router.post("/create", createUser );
router.put("/update/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/getall", getAllAdminUsers);

module.exports = router;
