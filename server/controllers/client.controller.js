const clientModel = require('../models/client.model');
const locationDOA = require('../dao/location.dao');
const clientDOA = require('../dao/client.dao');
const Q = require('q');
const jwt = require("jsonwebtoken");

const reCaptchaService = require('../services/reCaptcha.service');
const preService = require('../services/predelete.service');



var clientController = {};

async function allClients() {
    var deferred = Q.defer();

    clientModel.find({}, (err, clients) => {
        if (err) deferred.reject(err);
        // console.log("RETRIVED DATA = ",clients);
        deferred.resolve(clients);
    });
    return deferred.promise;
}
clientController.getClients = async function (req, res, next) {
    let query = {};
    if (req.query._id) {
        query = req.query
    }
    console.log("GET clients query = ", query, "Params = ", req.query);
    clientModel.find(query)
        .populate('locations')
        .exec((err, clients) => {
            console.log("SENDING RESPONSE Clients =  ", clients);
            return res.send({ data: { clients } });
        })
}
clientController.getClient = async function (req, res, next) {
    console.log("GET client ", req.params.id);
    // clientModel.findById(req.param.id,(err,client)=>{
    //     console.log("GET CLIENT RES = ",client);
    //     return res.send({data:{client}})
    // })
}

clientController.addClient = function (req, res, next) {
    console.log("ADD clients", req.body);

    var newClient = new clientModel({});

    if (req.body.name) newClient['name'] = req.body.name;
    if (req.body.email) newClient['email'] = req.body.email;
    if (req.body.password) newClient['password'] = req.body.password;

    checkClientExists(req.body.email).then((client) => {
        if (client) {
            console.log('client:::::::::::::', client);
            return res.status(400).send({ data: {}, msg: "Client Already Exists" });
        } else {
            newClient.save((err, client) => {
                if (err) return res.status(500).send({ err })
                console.log("SENDING RESPONSE Clients =  ", client)
                return res.send({ data: { client } });
            })
        }
    }).catch((error) => {
        if (err) return res.status(500).send({ err })
    })
}


const checkClientExists = (clientEmail) => {
    return new Promise((resolve, reject) => {
        console.log('Check Client Function:', clientEmail);
        clientModel.find({ email: clientEmail }, (error, client) => {
            if (error) {
                console.log('Found Error:::::::::', error);
                reject(error);
            } else if (client.length != 0) {
                console.log('Found Client::::::::', client);
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}



clientController.addLocation = function (req, res, next) {
    console.log("Add Location", req.body);

    locationDOA.addLocation({
        title: req.body.location.title,
        client: req.body.client
    }).then(newLocation => {
        clientDOA.addLocationToClient(newLocation).then(upadtedClient => {
            res.send({ data: { location: newLocation } });
        }, err => {
            console.error(err);
            return res.status(500).send({ err });
        });
    }), err => {
        console.error(err);
        return res.status(500).send({ err });
    };
}

clientController.updateLocation = function (req, res, next) {
    console.log("Update Location");

    locationDOA.updateLocation(req.body).then(updatedLocation => {
        return res.send({ data: { location: updatedLocation } })
    }, err => {
        return res.status(500).send({ err });
    })
}

clientController.deleteLocation = function (req, res, next) {
    console.log("Delete Location", req.query);

    locationDOA.deleteLocation(req.query).then(deletedLocation => {
        return res.send({ data: { location: deletedLocation } })
    }, err => {
        return res.status(500).send({ err });
    })
}

clientController.updateClient = function (req, res, next) {
    console.log("Update client DOA in client-doa", req.body);

    var updatedClient = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    };
    clientModel.findOneAndUpdate({ _id: req.body._id }, { $set: updatedClient }, { new: true }, (err, client) => {
        console.log("Updated client", client, err);
        if (err) {
            return res.status(500).send({ err })
        }
        return res.send({ data: { client } });
    })
}

clientController.deleteClient = function (req, res, next) {
    console.log("Delete client");
    let clientId = req.query._id;

    preService.preClientDelete(clientId).then((response) => {
        if (response) {
            console.log("client to be deleted : ", clientId);
            clientModel.deleteOne({ _id: clientId }, (err, deleted) => {
                if (err) {
                    return res.status(500).send({ err })
                }
                console.log("Deleted ", deleted);
                return res.send({ data: {}, msg: "Deleted Successfully" });
            })
        } else {
            return res.status(400).send({ data: {}, msg: "Client Not Deleted" });
        }
    }).catch((error) => {
        return res.status(500).send({ error })
    })
}

clientController.loginClient = function (req, res, next) {
    console.log("Login Client");

    const email = req.body.email;
    const password = req.body.password;
    const recaptchaToken = req.body.recaptchaToken;

    reCaptchaService.verifyRecaptcha(recaptchaToken).then((response) => {
        clientModel.findOne({ email: email }).exec((err, client) => {
            if (err) {
                return res.status(500).send({ err })
            } else if (client) {
                if (password == client.password) {

                    let newClient = JSON.parse(JSON.stringify(client));
                    newClient['userRole'] = 'client';
                    var token = jwt.sign(newClient, 'platinum');
                    req.session.currentUser = token;

                    return res.status(200).json({ message: 'Login Successfully', token: token, userRole: 'client', profile: newClient });
                } else {
                    return res.status(400).json({ message: 'Login failed Invalid password' });
                }
            } else {
                return res.status(400).json({ message: 'Login failed Invalid email' });
            }
        });
    }).catch((error) => {
        return res.status(400).json({ message: 'Failed captcha verification' });
    })
}

clientController.forgotPassword = function (req, res, next) {
    console.log("Forgot Password Client");
    const email = req.body.email;
    const newPassword = Math.floor(100000 + Math.random() * 9000000000);

    clientModel.findOneAndUpdate({ email: email }, { $set: { password: newPassword } }, (err, client) => {
        if (err) {
            return res.status(500).send({ err })
        } else if (client) {

            const defaultPasswordEmailoptions = {
                to: email,
                subject: `here the link to reset your password`,
                template: 'forgot-password'
            };

            const clientDetail = { name: client.name, newPassword: newPassword }

            mailService.sendMail(defaultPasswordEmailoptions, clientDetail, null, function (err, mailResult) {
                if (err) {
                    return res.status(500).send({ err })
                } else {
                    return res.status(200).json({ message: 'New Password Send To Email.' });
                }
            });

        } else {
            return res.status(400).json({ message: 'Email Not Found' });
        }
    });
}

clientController.resetPassword = function (req, res, next) {
    console.log("Reset Password Instructor", req.body);

    const clientId = req.user._id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    clientModel.findOne({ _id: clientId }, (err, client) => {
        console.log("Updated client", client, err);
        if (err) {
            return res.status(500).send({ err })
        } else if (client) {
            if (client.password == oldPassword) {
                client.password = newPassword;
                client.save();
                return res.status(200).json({ message: 'Your password changed successfully' });
            } else {
                return res.status(500).send({ msg: 'password does not match' })
            }
        } else {
            return res.status(500).send({ err })
        }
    });
}




module.exports = clientController;