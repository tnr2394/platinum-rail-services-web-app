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

module.exports = router;
