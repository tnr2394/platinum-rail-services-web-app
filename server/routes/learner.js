var express = require('express');
var router = express.Router();
var learnerController = require('../controllers/learner.controller');

const jwtService = require('../services/jwt.service');


/* GET Learners listing. */
router.get('/', learnerController.getLearners);
// ADD Learner
router.post('/', learnerController.addLearner);
// EDIT Learner
router.put('/', learnerController.updateLearner);
// Delete Learner
router.delete('/', learnerController.deleteLearner);
// Login Learner
router.post('/login', learnerController.loginLearner);

// Allot Assignments

router.post('/allot', jwtService.validateJWT, learnerController.allotAssignments);

router.get('/allot', learnerController.getAllotment);

router.put('/allot', jwtService.validateJWT, learnerController.updateAllotment);

// Submission Assignment

router.post('/submission', jwtService.validateJWT, learnerController.assignmentSubmisssion);

router.post('/forgot-password', learnerController.forgotPassword);

router.post('/reset-password', jwtService.validateJWT, learnerController.resetPassword);

router.get('/allot-status', learnerController.allotmentUsingAssignmentId);


router.delete('/allot/files', learnerController.removeFileFromAllotment);


router.get('/assignment/files', learnerController.assignmentFilesUsingAllotmentId);

// Exam Marks


router.post('/exam', learnerController.updateExamMarks);


router.post('/allotment', jwtService.validateJWT, learnerController.allotmentFromStatus);








module.exports = router;
