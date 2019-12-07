var express = require('express');
var router = express.Router();
var materialController = require('../controllers/material.controller');

const jwtService = require('../services/jwt.service');
/* GET Materials listing. */
router.get('/', materialController.getMaterials);
// ADD Material
router.post('/', materialController.addMaterial);
// EDIT Material
router.put('/', materialController.updateMaterial);
// Delete Material
router.delete('/', materialController.deleteMaterial);

// FILE OPERATIONS
/* GET Files listing. */
router.get('/files', materialController.getFiles);
// ADD Material
router.post('/files', materialController.addFile);
// Delete Material
router.delete('/files', materialController.deleteFile);


module.exports = router;
