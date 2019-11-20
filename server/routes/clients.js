var express = require('express');
var router = express.Router();
var clientController = require('../controllers/client.controller');
/* GET Clients listing. */
router.get('/', clientController.getClients);
// ADD Client
router.post('/', clientController.addClient);
// ADD Client - Location
router.post('/location', clientController.addLocation);
// Edit Client - Location
router.put('/location', clientController.updateLocation);
// EDIT Client
router.put('/', clientController.updateClient);
// Delete Client
router.delete('/', clientController.deleteClient);

module.exports = router;
