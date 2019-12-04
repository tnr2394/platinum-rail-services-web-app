//Npm Modules

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Q = require('q');
const mailService = require('../services/mail.service')

//Static Variables
const adminModel = require('../models/admin.model');
const adminController = {};

adminController.addAdmin = function (req, res, next) {
    console.log("ADD Admin", req.body);

    const newAdmin = new adminModel({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
    });

    newAdmin.save((err, admin) => {
        console.log("SENDING RESPONSE Admin = ", admin)
        return res.send({ data: { admin } });
    })
}


adminController.loginAdmin = function (req, res, next) {

    console.log("Login Admin");

    const email = req.body.email;
    const password = req.body.password;

    adminModel.findOne({ email: email }).exec((err, admin) => {
        if (err) {
            return res.status(500).send({ err })
        } else if (admin) {
            if (bcrypt.compareSync(password, admin.password)) {
                const payload = { admin };
                const token = jwt.sign(payload, 'platinum');
                req.session.currentUser = token;
                return res.status(200).json({ message: 'Login Successfully', data: token, userRole: 'admin' });
            } else {
                return res.status(400).json({ message: 'Login failed Invalid password' });
            }
        } else {
            return res.status(400).json({ message: 'Login failed Invalid email' });
        }
    });
}

adminController.sendMail = function (req, res, next) {

    console.log("Login Admin");

    const email = req.body.email;

    const defaultPasswordEmailoptions = {
        to: email,
        subject: `here the link to reset your password`,
        template: 'forgot-password'
    };

    mailService.sendMail(defaultPasswordEmailoptions, null, null, function (err, mailResult) {
        if (err) {
            console.log('error:', error);
            return res.status(500).send({ err })
        } else {
            console.log('Mail Result:', mailResult);
            return res.status(200).json({ message: 'Mail Send Successfully', data: mailResult });
        }
    });
}


module.exports = adminController;