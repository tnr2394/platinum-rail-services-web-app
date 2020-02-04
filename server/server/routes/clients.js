var express = require('express');
var router = express.Router();
var clientController = require('../controllers/client.controller');

const jwtService = require('../services/jwt.service');


/* GET Clients listing. */
router.get('/', clientController.getClients);
// ADD Client
router.post('/', clientController.addClient);
// ADD Client - Location
router.post('/location', clientController.addLocation);
// Edit Client - Location
router.put('/location', clientController.updateLocation);
// Delete Client - Location
router.delete('/location', clientController.deleteLocation);
// EDIT Client
router.put('/', clientController.updateClient);
// Delete Client
router.delete('/', clientController.deleteClient);
// Login Client
router.post('/login', clientController.loginClient);
// Forgot Password Client
router.post('forgot-password', clientController.forgotPassword)

router.post('/reset-password', jwtService.validateJWT, clientController.resetPassword);


module.exports = router;
