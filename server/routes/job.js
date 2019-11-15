var express = require('express');
var router = express.Router();
var jobController = require('../controllers/job.controller')

/* GET jobs listing */
router.get('/', jobController.getJobs)

/* ADD jobs */
router.post('/', jobController.addJob)

/* EDIT jobs */
router.put('/', jobController.updateJob)

/* DELETE jobs */
router.delete('/', jobController.deleteJob)

module.exports = router;