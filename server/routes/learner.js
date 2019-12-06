var express = require('express');
var router = express.Router();
var learnerController = require('../controllers/learner.controller');
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

// Submission Assignment

router.post('/submission', learnerController.assignmentSubmisssion);




module.exports = router;
