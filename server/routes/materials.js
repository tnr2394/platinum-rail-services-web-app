var express = require('express');
var router = express.Router();
var materialController = require('../controllers/material.controller');
/* GET Materials listing. */
router.get('/', materialController.getMaterials);
// ADD Material
router.post('/', materialController.addMaterial);
// EDIT Material
router.put('/', materialController.updateMaterial);
// Delete Material
router.delete('/', materialController.deleteMaterial);

module.exports = router;
