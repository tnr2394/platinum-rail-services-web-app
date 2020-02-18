const path = require('path') // Use path.join to make all paths platform-independent
const express = require('express');
const router = express.Router();

const timeLogController = require('../controllers/timeLog.controller')

console.log(" ---------- Hey Time Log Router Call ---------- ")

/* GET timeLog listing. */
router.get('/instructor', timeLogController.getTimeLog);

// Add Time Log by instructor
router.post('/', timeLogController.addTimeLog);

// Update Time Log by instructor
router.put('/', timeLogController.updateTimeLog);

router.post('/ins', timeLogController.getInstructorTimeLog);


module.exports = router;
