const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');

const jwtService = require('../services/jwt.service');

// ADD Admin
router.post('/', adminController.addAdmin);
// Login Admin
router.post('/login', adminController.loginAdmin);
// Update Admin
router.put('/', adminController.updateAdmin);
// Delete Admin
router.delete('/', adminController.removeAdmin);
// Reset Password Admin
router.post('/reset-password', jwtService.validateJWT, adminController.resetPassword);


module.exports = router;
