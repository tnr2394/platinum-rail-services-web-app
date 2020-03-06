const path = require('path') // Use path.join to make all paths platform-independent
const express = require('express');
const router = express.Router();


const competenciesController = require('../controllers/competencies.controller')


// Add New Competencies
router.post('/', competenciesController.addCompetencies);


router.post('/file', competenciesController.addFilesToCompetencies);

// Update Competencies
router.put('/', competenciesController.updateCompetencies);

// Delete Competencies
router.delete('/', competenciesController.deleteCompetencies);

// Get Competenies
router.get('/', competenciesController.getCompetencies);

module.exports = router;
