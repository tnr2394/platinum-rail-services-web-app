var express = require('express');
var router = express.Router();
var materialController = require('../controllers/material.controller');

const jwtService = require('../services/jwt.service');
/* GET Materials listing. */
router.get('/', jwtService.validateJWT, materialController.getMaterials);
// ADD Material
router.post('/', jwtService.validateJWT, materialController.addMaterial);
// EDIT Material
router.put('/', jwtService.validateJWT, materialController.updateMaterial);
// Delete Material
router.delete('/', jwtService.validateJWT, materialController.deleteMaterial);

// FILE OPERATIONS
/* GET Files listing. */
router.get('/files', materialController.getFiles);
// ADD Material
router.post('/files', jwtService.validateJWT, materialController.addFile);
// Delete Material
router.delete('/files', materialController.deleteFile);


module.exports = router;