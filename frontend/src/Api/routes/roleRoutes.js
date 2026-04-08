const express = require("express");
const { createRole, updateRole, deleteRole, getAllRoles, getRoleById } = require('../controllers/roleController.js');
const router = express.Router();

router.post('/create', createRole);
router.put('/update/:id', updateRole);
router.delete('/delete/:id', deleteRole);
router.get('/get-all', getAllRoles);
router.get('/get-by-id/:id',getRoleById);


module.exports = router;
