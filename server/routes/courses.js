var express = require('express');
var router = express.Router();
var courseController = require('../controllers/course.controller');
/* GET courses listing. */
router.get('/', courseController.getCourses);
// ADD COURSE
router.post('/', courseController.addCourse);
// EDIT COURSE
router.put('/', courseController.updateCourse);
// Delete COURSE
router.delete('/', courseController.deleteCourse);

module.exports = router;
