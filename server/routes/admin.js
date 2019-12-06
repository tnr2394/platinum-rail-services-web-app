const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');

// ADD Admin
router.post('/', adminController.addAdmin);
// Login Admin
router.post('/login', adminController.loginAdmin);


module.exports = router;
