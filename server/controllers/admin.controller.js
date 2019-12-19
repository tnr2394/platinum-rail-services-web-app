//Npm Modules

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Q = require('q');

// Service Variables

const mailService = require('../services/mail.service');
const reCaptchaService = require('../services/reCaptcha.service');

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
    const recaptchaToken = req.body.recaptchaToken;

    // reCaptchaService.verifyRecaptcha(recaptchaToken).then((response) => {
        adminModel.findOne({ email: email }).exec((err, admin) => {
            if (err) {
                return res.status(500).send({ err })
            } else if (admin) {
                if (bcrypt.compareSync(password, admin.password)) {
                    const payload = { admin };
                    const token = jwt.sign(payload, 'platinum');
                    const data = { token: token, userRole: 'admin' }
                    req.session.currentUser = data;

                    var sess = req.session;
                    sess.currentUser = data;

                    console.log('req.session.currentUser', req.session.currentUser);

                    return res.status(200).json({ message: 'Login Successfully', data: token, userRole: 'admin' });
                } else {
                    return res.status(400).json({ message: 'Login failed Invalid password' });
                }
            } else {
                return res.status(400).json({ message: 'Login failed Invalid email' });
            }
        });
    // }).catch((error) => {
    //     return res.status(400).json({ message: 'Failed captcha verification' });
    // })
}

adminController.forgotPassword = function (req, res, next) {
    console.log("Forgot Password learner");

    const email = req.body.email;
    const newPassword = Math.floor(100000 + Math.random() * 9000000000);

    adminModel.findOneAndUpdate({ email: email }, { $set: { password: newPassword } }, (err, admin) => {
        if (err) {
            return res.status(500).send({ err })
        } else if (admin) {

            const defaultPasswordEmailoptions = {
                to: email,
                subject: `here the link to reset your password`,
                template: 'forgot-password'
            };

            const adminDetail = {
                name: admin.name,
                newPassword: newPassword
            }

            mailService.sendMail(defaultPasswordEmailoptions, adminDetail, null, function (err, mailResult) {
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



module.exports = adminController;