// Npm Modules

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Q = require('q');
fileDAO = require('../dao/file.dao');
const async = require("async");
// Service Variables

const mailService = require('../services/mail.service');
const reCaptchaService = require('../services/reCaptcha.service');

// Model Variables

var instructorModel = require('../models/instructor.model');

var instructorController = {};

async function allInstructors(query) {
    var deferred = Q.defer();

    instructorModel.find(query, (err, instructors) => {
        if (err) deferred.reject(err);
        console.log("RETRIVED DATA = ", instructors);
        deferred.resolve(instructors);
    });
    return deferred.promise;

}
instructorController.getInstructors = async function (req, res, next) {
    console.log("GET Instructors");
    var query = {};
    if (req.query._id) {
        var query = { _id: req.query._id }
    }
    allInstructors(query).then(instructors => {
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

    if (req.files && req.files.file) {

        console.log('Inside If:');
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(req.files.file.name)[1];
        var name = req.files.file.name.split('.').slice(0, -1).join('.')

        var newFile = {
            title: name,
            type: "Qulification",// OR SUBMISSION OR DOCUMENT
            path: "NEWPATH",
            extension: ext,
            uploadedBy: 'ADMIN',
            file: req.files.file,
            uploadedDate: new Date()
        }

        fileDAO.addFile(newFile).then((Response) => {
            var updatedInstructor = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                dateOfJoining: req.body.dateOfJoining,
                qualificationTitle: req.body.qualificationTitle,
                validUntil: req.body.validUntil,
                file: Response._id,
            };

            instructorModel.findOneAndUpdate({ _id: req.body._id }, { $set: updatedInstructor }, { new: true }, (err, instructor) => {
                console.log("Updated instructor", instructor, err);
                if (err) {
                    return res.status(500).send({ err })
                }
                return res.send({ data: { instructor } });
            });

        }).catch((error) => {
            console.log('Error While File Upload', error);
            return res.status(500).send({ err })
        })
    } else {

        var updatedInstructor = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            dateOfJoining: req.body.dateOfJoining,
            qualificationTitle: req.body.qualificationTitle,
            validUntil: req.body.validUntil,
        };

        instructorModel.findOneAndUpdate({ _id: req.body._id }, { $set: updatedInstructor }, { new: true }, (err, instructor) => {
            console.log("Updated instructor", instructor, err);
            if (err) {
                return res.status(500).send({ err })
            }
            return res.send({ data: { instructor } });
        });
    }
}


instructorController.checkForQualificationCronJob = () => {
    console.log('Function In Controller Is Calling');
    const x = 6; //or whatever offset
    let CurrentDate = new Date();
    CurrentDate.setMonth(CurrentDate.getMonth() + x);
    instructorModel.find({ validUntil: { $lt: CurrentDate } }, (err, instructor) => {
        if (err) {
            console.log('Err:', err);
        } else {
            async.eachSeries(instructor, (singleInstructor, innerCallback) => {
                sendQualificationExpireMailToAdmin(singleInstructor).then((Response) => {
                    innerCallback();
                }).catch((error) => {
                    console.log('Error:', error);
                })
            }, (callbackError, callbackResponse) => {
                if (callbackError) {
                    console.log("callbackError ", callbackError);
                } else {
                    console.log("Send Mail To Admin", callbackResponse);
                }
            })
        }
    })
}

const sendQualificationExpireMailToAdmin = (instructorDetail) => {
    return new Promise((resolve, reject) => {
        console.log('Send Mail To Admin Function');

        const defaultPasswordEmailoptions = {
            to: 'vishal.pankhaniya786@gmail.com',//admin Email here
            subject: `Instructor Expire Mail`,
            template: 'forgot-password'
        };

        mailService.sendMail(defaultPasswordEmailoptions, instructorDetail, null, function (err, mailResult) {
            if (err) {
                reject();
            } else {
                resolve();
            }
        });
    })
}

instructorController.resetPassword = function (req, res, next) {
    console.log("Reset Password Instructor", req.body, req.user);

    const instructorId = req.user._id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    instructorModel.findOne({ _id: instructorId }, (err, instructor) => {
        console.log("Updated instructor", instructor, err);
        if (err) {
            console.log('Err:', err);
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
                    let newInstructor = JSON.parse(JSON.stringify(instructor));
                    newInstructor['userRole'] = 'instructor';
                    const token = jwt.sign(newInstructor, 'platinum');
                    req.session.currentUser = token;
                    return res.status(200).json({ message: 'Login Successfully', token: token, userRole: 'instructor', profile: newInstructor });
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

            const instructorDetail = { name: instructor.name, newPassword: newPassword }

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

// module.exports.checkForQualificationCronJob = checkForQualificationCronJob;


module.exports = instructorController;