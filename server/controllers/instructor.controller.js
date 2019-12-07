// Npm Modules

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Q = require('q');

// Service Variables

const mailService = require('../services/mail.service');
const reCaptchaService = require('../services/reCaptcha.service');

// Model Variables

var instructorModel = require('../models/instructor.model');

var instructorController = {};

async function allInstructors() {
    var deferred = Q.defer();

    instructorModel.find({}, (err, instructors) => {
        if (err) deferred.reject(err);
        console.log("RETRIVED DATA = ", instructors);
        deferred.resolve(instructors);
    });
    return deferred.promise;

}
instructorController.getInstructors = async function (req, res, next) {
    console.log("GET Instructors");
    allInstructors().then(instructors => {
        console.log("SENDING RESPONSE instructors = ", instructors)
        return res.send({ data: { instructors } });
    })
}

instructorController.addInstructor = function (req, res, next) {
    console.log("ADD Instructor", req.body);

    var newInstructor = new instructorModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        dateOfJoining: req.body.dateOfJoining
    });
    newInstructor.save((err, instructor) => {
        console.log("SENDING RESPONSE Instructors = ", instructor)

        return res.send({ data: { instructor } });
    })
}

instructorController.updateInstructor = function (req, res, next) {
    console.log("Update Instructor", req.body);

    var updatedInstructor = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        dateOfJoining: req.body.dateOfJoining
    };

    instructorModel.findOneAndUpdate({ _id: req.body._id }, { $set: updatedInstructor }, { new: true }, (err, instructor) => {
        console.log("Updated instructor", instructor, err);
        if (err) {
            return res.status(500).send({ err })
        }
        return res.send({ data: { instructor } });
    });
}

instructorController.resetPassword = function (req, res, next) {
    console.log("Reset Password Instructor", req.body);

    const instructorId = req.user.instructor._id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    instructorModel.findOne({ _id: instructorId }, (err, instructor) => {
        console.log("Updated instructor", instructor, err);
        if (err) {
            return res.status(500).send({ err })
        } else if (instructor) {
            if (instructor.password == oldPassword) {
                instructor.password = newPassword;
                instructor.save();
                return res.status(200).json({ message: 'Your password changed successfully' });
            } else {
                return res.status(500).send({ msg: 'password does not match' })
            }
        } else {
            return res.status(500).send({ err })
        }
    });
}



instructorController.deleteInstructor = function (req, res, next) {
    console.log("Delete Instructor");
    let instructorId = req.query._id;
    console.log("Course to be deleted : ", instructorId);
    instructorModel.deleteOne({ _id: instructorId }, (err, deleted) => {
        if (err) {
            return res.status(500).send({ err })
        }
        console.log("Deleted ", deleted);
        return res.send({ data: {}, msg: "Deleted Successfully" });
    })
}

instructorController.loginInstructor = function (req, res, next) {
    console.log("Login Instructor");

    const email = req.body.email;
    const password = req.body.password;
    const recaptchaToken = req.body.recaptchaToken;

    reCaptchaService.verifyRecaptcha(recaptchaToken).then((Response) => {
        instructorModel.findOne({ email: email }).exec((err, instructor) => {
            if (err) {
                return res.status(500).send({ err })
            } else if (instructor) {
                if (password == instructor.password) {
                    const payload = { instructor };
                    var token = jwt.sign(payload, 'platinum');
                    req.session.currentUser = token;
                    return res.status(200).json({ message: 'Login Successfully', data: token, userRole: 'instructor' });
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


instructorController.forgotPassword = function (req, res, next) {
    console.log("Forgot Password Instructor");

    const email = req.body.email;
    const newPassword = Math.floor(100000 + Math.random() * 9000000000);

    instructorModel.findOneAndUpdate({ email: email }, { $set: { password: newPassword } }, (err, instructor) => {
        if (err) {
            return res.status(500).send({ err })
        } else if (instructor) {

            const defaultPasswordEmailoptions = {
                to: email,
                subject: `here the link to reset your password`,
                template: 'forgot-password'
            };

            const instructorDetail = {
                name: instructor.name,
                newPassword: newPassword
            }

            mailService.sendMail(defaultPasswordEmailoptions, instructorDetail, null, function (err, mailResult) {
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






module.exports = instructorController;