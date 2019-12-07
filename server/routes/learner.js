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

router.post('/allot', learnerController.allotAssignments);

router.get('/allot', learnerController.getAllotment);

// Submission Assignment

router.post('/submission', learnerController.assignmentSubmisssion);

router.post('/reset-password', jwtService.validateJWT, learnerController.resetPassword);





module.exports = router;
