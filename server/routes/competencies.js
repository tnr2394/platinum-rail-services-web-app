const path = require('path') // Use path.join to make all paths platform-independent
const express = require('express');
const router = express.Router();


const competenciesController = require('../controllers/competencies.controller')


// Add New Competencies
router.post('/', competenciesController.addCompetencies);

module.exports = router;
