const express = require('express');
const router = express.Router();

const folderController = require('../controllers/folder.controller');

const jwtService = require('../services/jwt.service');

// ADD FOLDER
router.post('/', jwtService.validateJWT, folderController.createFolder);

router.get('/', folderController.getFolders);



// ADD File
router.post('/files', folderController.addFile);



// FILE OPERATIONS
// /* GET Files listing. */
// router.get('/files', materialController.getFiles);

// // Delete Material
// router.delete('/files', materialController.deleteFile);


module.exports = router;
