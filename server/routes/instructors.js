var express = require('express');
var router = express.Router();
var instructorController = require('../controllers/instructor.controller');
/* GET courses listing. */
router.get('/', instructorController.getInstructors);
// ADD Instructor
router.post('/', instructorController.addInstructor);
// EDIT Instructor
router.put('/', instructorController.updateInstructor);
// Delete Instructor
router.delete('/', instructorController.deleteInstructor);
// Login Instructor
router.post('/login', instructorController.loginInstructor);
// Forgot Password Instructor
router.post('/forgot-password', instructorController.forgotPassword);

module.exports = router;
