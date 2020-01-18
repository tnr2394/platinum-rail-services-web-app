var express = require('express');
var router = express.Router();
var jobController = require('../controllers/job.controller')
const jwtService = require('../services/jwt.service');


/* GET jobs listing */
router.get('/', jwtService.validateJWT, jobController.getJobs)

/* ADD jobs */
router.post('/', jobController.addJob)

/* EDIT jobs */
router.put('/', jobController.updateJob)

/* DELETE jobs */
router.delete('/', jobController.deleteJob)


router.get('/instructor', jobController.getJobUsingInstructorId);

router.get('/client', jobController.getJobUsingClientId);

router.get('/assignment', jobController.assignmentListUsingJobId);

router.get('/assignment/group', jobController.assignmentListUsingJobIdWithoutGroup);

router.get('/assignment-status', jobController.assignmentStatusWithLearner);

module.exports = router;