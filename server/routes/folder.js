const express = require('express');
const router = express.Router();

const folderController = require('../controllers/folder.controller');

const jwtService = require('../services/jwt.service');
const multerService = require('../services/multer.service');


router.post('/change-position', folderController.changeFolderPosition);


// ADD FOLDER
router.post('/', jwtService.validateJWT, folderController.createFolder);

router.get('/', folderController.getFolders);

router.put('/', folderController.updateFolder);

router.delete('/', folderController.deleteFolder);



// ADD File
router.post('/files', jwtService.validateJWT, folderController.addFile);

router.delete('/files', folderController.deleteFileFromFolder);

// SHARE FOLDER
router.post('/share', folderController.shareFolder);

// SHARE FILE
router.post('/share-file', folderController.shareFile);

// GET SHARED FOLDER
router.get('/shared', jwtService.validateJWT, folderController.getSharedFolder);

// GET SHARED FILE
router.get('/shared-file', jwtService.validateJWT, folderController.getSharedFile);



// FILE OPERATIONS
// /* GET Files listing. */
// router.get('/files', materialController.getFiles);

// // Delete Material
// router.delete('/files', materialController.deleteFile);


module.exports = router;