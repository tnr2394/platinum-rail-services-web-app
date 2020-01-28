// Npm Modules

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Q = require('q');
fileDAO = require('../dao/file.dao');
const async = require("async");
// Service Variables

const mailService = require('../services/mail.service');
const reCaptchaService = require('../services/reCaptcha.service');
const preService = require('../services/predelete.service');

// Model Variables

var instructorModel = require('../models/instructor.model');

var instructorController = {};

async function allInstructors(query) {
    var deferred = Q.defer();

    instructorModel.find(query)
        .populate("file")
        .populate("profilePic")
        .exec((err, instructors) => {
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

    checkInstructorExists(req.body.email).then((response) => {
        if (response) {
            return res.status(400).send({ data: {}, msg: "Instructor Already Exists" });
        } else {
            newInstructor.save((err, instructor) => {
                console.log("SENDING RESPONSE Instructors = ", instructor)
                return res.send({ data: { instructor } });
            })
        }
    }).catch((error) => {
        return res.status(500).send({ error })
    })
}

const checkInstructorExists = (email) => {
    return new Promise((resolve, reject) => {
        console.log('Inside Check Learner Function');
        instructorModel.find({ email: email }, (error, instructor) => {
            if (error) {
                reject(error);
            } else if (instructor.length != 0) {
                console.log('instructor Detail:', instructor);
                resolve(true)
            } else {
                resolve(false)
            }
        });
    });
}


instructorController.updateInstructor = function (req, res, next) {

    console.log('Instructor Data:', req.body, req.files);

    var updatedInstructor = {};

    if (req.body.name) updatedInstructor['name'] = req.body.name;
    if (req.body.email) updatedInstructor['email'] = req.body.email;
    if (req.body.password) updatedInstructor['password'] = req.body.password;
    if (req.body.dateOfJoining) updatedInstructor['dateOfJoining'] = req.body.dateOfJoining;
    if (req.body.qualificationTitle) updatedInstructor['qualificationTitle'] = req.body.qualificationTitle;
    if (req.body.validUntil) updatedInstructor['validUntil'] = req.body.validUntil;
    if (req.body.mobile) updatedInstructor['mobile'] = req.body.mobile;
    if (req.body.competencies) updatedInstructor['competencies'] = req.body.competencies;

    if (req.files && req.files.profile && req.files.file) {
        Promise.all([
            updateProfilePicture(req.files.profile),
            updateQualificationFile(req.files.file)
        ]).then((success) => {
            updatedInstructor['profilePic'] = success[0]._id;
            updatedInstructor['file'] = success[1]._id;
            updateInstructorDetail(updatedInstructor, req.body._id).then((updatedInstructor) => {
                return res.send({ data: { updatedInstructor } });
            }).catch((updateError) => {
                return res.status(500).send({ updateError })
            })
        }).catch((reason) => {
            return res.status(500).send({ reason })
        })
    }
    else if (req.files) {
        if (req.files.file) {
            updateQualificationFile(req.files.file).then((certRes) => {
                updatedInstructor['file'] = certRes._id;
                updateInstructorDetail(updatedInstructor, req.body._id).then((updatedInstructor) => {
                    return res.send({ data: { updatedInstructor } });
                }).catch((updateError) => {
                    return res.status(500).send({ updateError })
                })
            }).catch((error) => {
                return res.status(500).send({ err })
            })
        }
        else if (req.files.profile) {
            updateProfilePicture(req.files.profile).then((profileRes) => {
                updatedInstructor['profilePic'] = profileRes._id;
                updateInstructorDetail(updatedInstructor, req.body._id).then((updatedInstructor) => {
                    return res.send({ data: { updatedInstructor } });
                }).catch((updateError) => {
                    return res.status(500).send({ updateError })
                })
            }).catch((error) => {
                return res.status(500).send({ err })
            })
        }
    } else {
        updateInstructorDetail(updatedInstructor, req.body._id).then((updatedInstructor) => {
            return res.send({ data: { updatedInstructor } });
        }).catch((updateError) => {
            return res.status(500).send({ updateError })
        })
    }
}

const updateInstructorDetail = (updatedInstructor, instructorId) => {
    return new Promise((resolve, reject) => {
        instructorModel.findOneAndUpdate(
            { _id: instructorId },
            { $set: updatedInstructor },
            { new: true },
            (err, instructor) => {
                console.log("Updated instructor", instructor, err);
                if (err) {
                    reject(err);
                } else {
                    resolve(instructor);
                }
            });
    })
}

const updateProfilePicture = (profileImg) => {
    return new Promise((resolve, reject) => {

        console.log('Profile Picture Function:', profileImg);
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(profileImg.name)[1];
        var name = profileImg.name.split('.').slice(0, -1).join('.')
        var newName = name + '-' + '-' + Date.now();

        var newFile = {
            title: newName,
            type: "Profile",
            path: "NEWPATH",
            extension: ext,
            uploadedBy: 'ADMIN',
            file: profileImg,
            uploadedDate: new Date()
        }

        fileDAO.addFile(newFile).then((profileResponse) => {
            resolve(profileResponse);
        }).catch((error) => {
            console.log('Error While Profile Upload', error);
            reject(error);
        })
    })
}

const updateQualificationFile = (certFile) => {
    return new Promise((resolve, reject) => {

        console.log('Profile Picture Function:', certFile);
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(certFile.name)[1];
        var name = certFile.name.split('.').slice(0, -1).join('.')
        var newName = name + '-' + '-' + Date.now();

        var newFile = {
            title: newName,
            type: "Certificate",
            path: "NEWPATH",
            extension: ext,
            uploadedBy: 'ADMIN',
            file: certFile,
            uploadedDate: new Date()
        }

        fileDAO.addFile(newFile).then((profileResponse) => {
            resolve(profileResponse);
        }).catch((error) => {
            console.log('Error While Profile Upload', error);
            reject(error);
        })
    })
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
    preService.preInstructorDelete(instructorId).then((response) => {
        if (response) {
            console.log("Course to be deleted : ", instructorId);
            instructorModel.deleteOne({ _id: instructorId }, (err, deleted) => {
                if (err) {
                    return res.status(500).send({ err })
                }
                console.log("Deleted ", deleted);
                return res.send({ data: {}, msg: "Deleted Successfully" });
            })
        } else {
            console.log('Instructor Not Deleted');
            return res.status(400).send({ data: {}, msg: "Instructor Not Deleted" });
        }
    }).catch((error) => {
        return res.status(500).send({ error })
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

module.exports = instructorController;