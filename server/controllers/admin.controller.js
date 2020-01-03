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
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, 10),
    });

    newAdmin.save((err, admin) => {
        console.log("SENDING RESPONSE Admin = ", admin)
        return res.send({ data: { admin } });
    })
}

adminController.updateAdmin = function (req, res, next) {

    const updateData = {};

    if (req.body.name) { updateData['name'] = req.body.name }
    if (req.body.password) { updateData['password'] = bcrypt.hashSync(req.body.password, 10) }

    console.log('Update Admin', updateData);

    adminModel.findOneAndUpdate({ email: email }, { $set: updateData }, (err, updateAdmin) => {
        if (err) {
            return res.status(500).send({ err })
        } else {
            return res.status(200).json({ message: 'Admin Update Successfully.' });
        }
    })
}

adminController.removeAdmin = function (req, res, next) {

    const email = req.query.email;

    console.log('Delete Admin', email);

    adminModel.findByIdAndRemove({ email: email }, (err, deleteAdmin) => {
        if (err) {
            return res.status(500).send({ err })
        } else {
            return res.status(200).json({ message: 'Admin Deleted Successfully.' });
        }
    })
}

adminController.loginAdmin = function (req, res, next) {

    console.log("Login Admin");

    const email = req.body.email;
    const password = req.body.password;
    const recaptchaToken = req.body.recaptchaToken;

    reCaptchaService.verifyRecaptcha(recaptchaToken).then((response) => {
        adminModel.findOne({ email: email }).exec((err, admin) => {
            if (err) {
                return res.status(500).send({ err })
            } else if (admin) {

                if (bcrypt.compareSync(password, admin.password)) {
                    let newAdmin = JSON.parse(JSON.stringify(admin));
                    newAdmin['userRole'] = 'admin';
                    var token = jwt.sign(newAdmin, 'platinum');

                    sass = req.session;
                    req.session.currentUser = token;
                    sass.currentUser = token;

                    console.log('req.session.currentUser', sass.currentUser);

                    return res.status(200).json({ message: 'Login Successfully', token: token, userRole: 'admin', profile: newAdmin });
                } else {
                    return res.status(400).json({ message: 'Login failed Invalid password' });
                }
            } else {
                return res.status(400).json({ message: 'Login failed Invalid email', admin });
            }
        });
    }).catch((error) => {
        return res.status(400).json({ message: 'Failed captcha verification' });
    })
}

adminController.forgotPassword = function (req, res, next) {
    console.log("Forgot Password Admin");

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

adminController.resetPassword = function (req, res, next) {
    console.log("Reset Password Admin", req.body);

    const adminId = req.user._id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    adminModel.findOne({ _id: adminId }, (err, admin) => {
        console.log("Updated admin", admin, err);
        if (err) {
            return res.status(500).send({ err })
        } else if (admin) {
            if (bcrypt.compareSync(oldPassword, admin.password)) {
                admin.password = bcrypt.hashSync(newPassword, 10);
                admin.save();
                return res.status(200).json({ message: 'Your password changed successfully' });
            } else {
                return res.status(500).send({ msg: 'password does not match' })
            }
        } else {
            console.log('err');
            return res.status(500).send({ err })
        }
    });
}


module.exports = adminController;