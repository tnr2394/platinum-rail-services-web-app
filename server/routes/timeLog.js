const path = require('path') // Use path.join to make all paths platform-independent
const express = require('express');
const router = express.Router();

const timeLogController = require('../controllers/timeLog.controller')

console.log(" ---------- Hey Time Log Router Call ---------- ")

/* GET timeLog listing. */
router.get('/instructor', timeLogController.getTimeLog);

router.post('/instructor/week', timeLogController.getWeeklylog)
// router.post('/instructor/turns', timeLogController.numberOfTurns)

// Add Time Log by instructor
router.post('/', timeLogController.addTimeLog);

// Update Time Log by instructor
router.put('/', timeLogController.updateTimeLog);

router.post('/ins', timeLogController.getInstructorTimeLog);

router.post('/ins-time', timeLogController.instructorsTimeLogDetails);

router.post('/secondReport', timeLogController.secondReportLogsDetails);

module.exports = router;
