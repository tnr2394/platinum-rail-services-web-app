// Npm Variables

const jwt = require("jsonwebtoken");
const Q = require('q');
const async = require("async");
const _ = require('lodash');

var crypto = require('crypto');

//abc




// Service Variables

const mailService = require('../services/mail.service');
const reCaptchaService = require('../services/reCaptcha.service');


// Dao Variables

const learnerDOA = require('../dao/learner.dao');
const allotmentDOA = require('../dao/allotment.dao');
const learnerModel = require('../models/learner.model')
const materialDOA = require('../dao/material.dao');
const clientDOA = require('../dao/client.dao');


var learnerController = {};

async function allLearners() {
    var deferred = Q.defer();

    // learnerModel.find(query)
    //     .populate("allotments")
    //     .exec((err, learner) => {
    //         if (err) deferred.reject(err);
    //         deferred.resolve(learner);
    //     });
    // return deferred.promise;

    learnerModel.find({}, (err, clients) => {
        if (err) deferred.reject(err);
        // console.log("RETRIVED DATA = ",clients);
        deferred.resolve(clients);
    });
    return deferred.promise;
}

learnerController.getLearners = async function (req, res, next) {
    let query = {};

    if (req.query) {
        query = req.query
    }
    console.log("GET learners query = ", query, "Params = ", req.query);
    learnerDOA.getLearnersByQuery(query)
        .then(learners => {
            console.log("Returing learners - " + learners.length);
            return res.send({ data: { learners } });
        }, err => {
            console.error(err);
            return res.status(500).send({ err });
        })
}

learnerController.getLearner = async function (req, res, next) {
    console.log("GET client ", req.params.id);
    learnerModel.findById(req.param.id, (err, learner) => {
        console.log("GET learner RES = ", learner);
        return res.send({ data: { learner } })
    })
}

learnerController.addLearner = async function (req, res, next) {


    var newLearner = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        job: req.body.job
    };

    checkLearnerExists(req.body.job, req.body.email).then((response) => {
        console.log('Response:::::::::::', response);
        if (response) {
            return res.status(400).send({ data: {}, msg: "Learner Already Exists" });
        } else {
            learnerDOA.createLearner(newLearner).then(newLearner => {
                console.log("Created Learner:::::::::", newLearner);
                return res.send({ data: { learner: newLearner } })
            }, err => {
                return res.status(500).send({ err });
            });
        }
    }).catch((error) => {
        console.log('Error::::::::::::', error);
    })
}

const checkLearnerExists = (jobId, email) => {
    return new Promise((resolve, reject) => {
        console.log('Inside Check Learner Function');
        learnerModel.find({ job: jobId, email: email }, (error, learner) => {
            if (error) {
                reject(error);
            } else if (learner.length != 0) {
                console.log('Learner Detail:', learner);
                resolve(true)
            } else {
                resolve(false)
            }
        });
    });
}


learnerController.updateLearner = async function (req, res, next) {
    var updatedLearner = {};
    if (req.body._id) updatedLearner['_id'] = req.body._id;
    if (req.body.name) updatedLearner['name'] = req.body.name;
    if (req.body.email) updatedLearner['email'] = req.body.email;
    if (req.body.password) updatedLearner['password'] = req.body.password;
    if (req.body.phone) updatedLearner['phone'] = req.body.phone;

    console.log("Update Learner DOA in Learner-Controller", req.body, req.files);

    if (req.files && req.files.profile) {
        updateProfilePicture(req.files.profile).then((profileRes) => {
            updatedLearner['profilePic'] = profileRes._id;
            learnerDOA.updateLearner(updatedLearner).then(learner => {
                console.log("Updated learner in controller", learner);
                return res.send({ data: { learner } });
            }, err => {
                console.error(err);
                return res.status(500).send({ err })
            }).catch(err => {
                console.error(err);
            })
        }).catch((error) => {
            return res.status(500).send({ err })
        })
    } else {
        learnerDOA.updateLearner(updatedLearner).then(learner => {
            console.log("Updated learner in controller", learner);
            return res.send({ data: { learner } });
        }, err => {
            console.error(err);
            return res.status(500).send({ err })
        }).catch(err => {
            console.error(err);
        })
    }
}

const updateProfilePicture = (profileImg) => {
    return new Promise((resolve, reject) => {

        console.log('Profile Picture Function:', profileImg);
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(profileImg.name)[1];
        var name = profileImg.name.split('.').slice(0, -1).join('.')

        var newFile = {
            title: name,
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

learnerController.deleteLearner = function (req, res, next) {
    console.log("Delete learner");
    let learnerId = req.query._id;
    console.log("learner to be deleted : ", learnerId);
    learnerDOA.deleteLearner(learnerId)
        .then(deleted => {
            console.log("Deleted ", deleted);
            return res.send({ data: {}, msg: "Deleted Successfully" });
        }, err => {
            return res.status(500).send({ err })
        })
}

learnerController.getAllotment = function (req, res, next) {
    console.log("learner allotment");
    let allotmentId = req.query._id;
    console.log("learner allotment: ", allotmentId);
    allotmentDOA.getAllotment(allotmentId)
        .then(allotment => {
            console.log("allotment ", allotment);
            return res.send({ data: { allotment }, msg: "allotment List fetch Successfully" });
        }, err => {
            return res.status(500).send({ err })
        })
}

learnerController.loginLearner = function (req, res, next) {
    console.log("Login Learner");

    const email = req.body.email;
    const password = req.body.password;
    const recaptchaToken = req.body.recaptchaToken;

    reCaptchaService.verifyRecaptcha(recaptchaToken).then((response) => {
        learnerModel.findOne({ email: email }).exec((err, learner) => {
            if (err) {
                return res.status(500).send({ err })
            } else if (learner) {
                if (password == learner.password) {
                    let newLearner = JSON.parse(JSON.stringify(learner));
                    newLearner['userRole'] = 'learner';
                    var token = jwt.sign(newLearner, 'platinum');
                    req.session.currentUser = token;
                    return res.status(200).json({ message: 'Login Successfully', token: token, userRole: 'learner', profile: newLearner });
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


learnerController.allotAssignments = function (req, res, next) {

    console.log('Allot Assignment', req.body);

    async.eachSeries(req.body, (singleLearner, outerCallback) => {
        console.log('Single learner', singleLearner);
        // assignmentAllotmentMailDataLearner(singleLearner.assignments)
        async.eachSeries(singleLearner.assignments, (singleAssignment, innerCallback) => {
            console.log('singleAssignment', singleAssignment);
            const newAllotment = {
                assignment: singleAssignment._id,
                learner: singleLearner.learner._id,
                status: 'Pending',
                deadlineDate: singleLearner.learner.duedate
            }

            // Create New Allotment With Single Learner

            allotmentDOA.createAllotment(newAllotment).then((response) => {
                console.log('Allotment Added now update learner');
                learnerDOA.updateAssignment(singleLearner.learner, response._id).then((updatedLearner) => {
                    console.log("updatedLearner", updatedLearner);
                    innerCallback();
                }).catch((updateLearnerErr) => {
                    return res.status(500).send({ err })
                })
            }).catch((error) => {
                return res.status(500).send({ err })
            })
        }, (callbackError, callbackResponse) => {

            if (callbackError) {
                return res.status(500).send({ err })
            } else {

                // Send Mail To Learner For Alloted Assignment

                var query = { _id: singleLearner.learner }
                learnerDOA.getLearnersByQuery(query).then(learners => {

                    const defaultPasswordEmailoptions = {
                        to: learners[0].email,
                        subject: `Assignments Alloted`,
                        template: 'allotment-learner'
                    };

                    let assignmentData = { assignment: singleLearner }
                    mailService.sendMail(defaultPasswordEmailoptions, assignmentData, null, function (err, mailResult) {
                        if (err) {
                            return res.status(500).send({ err })
                        } else {
                            outerCallback();
                        }
                    });
                }, err => {
                    console.error(err);
                    return res.status(500).send({ err });
                })
            }
        })
    }, (callbackError, callbackResponse) => {
        if (callbackError) {
            return res.status(500).send({ err })
        } else {
            console.log("Final callback");
            return res.send({ data: {}, msg: "Assignment Alloted Successfully" });
        }
    })

}


learnerController.assignmentSubmisssion = function (req, res, next) {

    let files = [];

    if (Array.isArray(req.files.file)) {
        files = req.files.file
    } else {
        files[0] = req.files.file;
    }

    async.eachSeries(files, (singleFile, innerCallback) => {
        console.log('singleFile', singleFile);


        const allotmentId = req.body.allotmentId;
        const assignmentStatus = req.body.status;

        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(singleFile.name)[1];
        var name = singleFile.name.split('.').slice(0, -1).join('.')

        var newName = name + '-' + req.user._id + '-' + Date.now();

        var newFile = {
            title: newName,
            type: "material",// OR SUBMISSION OR DOCUMENT
            path: "NEWPATH",
            extension: ext,
            uploadedBy: req.user.name,
            file: singleFile,
            uploadedDate: new Date()
        }

        console.log('new file object', newFile, allotmentId);

        allotmentDOA.submissionOfAssignment(allotmentId, assignmentStatus, newFile)
            .then(updated => {
                console.log("updated ", updated);
                innerCallback();
            }, err => {
                return res.status(500).send({ err })
            })
    }, (callbackError, callbackResponse) => {
        if (callbackError) {
            console.log("callbackError ", callbackError);
            return res.status(500).send({ err })
        } else {
            return res.send({ data: {}, msg: "Assigment Submitted Successfully" });
        }
    })
}

learnerController.forgotPassword = function (req, res, next) {
    console.log("Forgot Password learner");

    const email = req.body.email;
    const newPassword = Math.floor(100000 + Math.random() * 9000000000);

    learnerModel.findOneAndUpdate({ email: email }, { $set: { password: newPassword } }, (err, learner) => {
        if (err) {
            return res.status(500).send({ err })
        } else if (learner) {

            const defaultPasswordEmailoptions = {
                to: email,
                subject: `here the link to reset your password`,
                template: 'forgot-password'
            };

            const learnerDetail = {
                name: learner.name,
                newPassword: newPassword
            }

            mailService.sendMail(defaultPasswordEmailoptions, learnerDetail, null, function (err, mailResult) {
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

learnerController.resetPassword = function (req, res, next) {
    console.log("Reset Password Instructor", req.body);

    const learnerId = req.user._id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    learnerModel.findOne({ _id: learnerId }, (err, learner) => {
        console.log("Updated learner", learner, err);
        if (err) {
            return res.status(500).send({ err })
        } else if (learner) {
            if (learner.password == oldPassword) {
                learner.password = newPassword;
                learner.save();
                return res.status(200).json({ message: 'Your password changed successfully' });
            } else {
                return res.status(500).send({ msg: 'password does not match' })
            }
        } else {
            return res.status(500).send({ err })
        }
    });
}

learnerController.updateAllotment = function (req, res, next) {

    console.log('Update Allotment By Instructor', req.body);

    const updateAllotment = {};

    if (req.body.status) updateAllotment['status'] = req.body.status;
    if (req.body.remark) updateAllotment['remark'] = req.body.remark;
    if (req.body.deadlineDate) updateAllotment['deadlineDate'] = req.body.deadlineDate;

    const allotmentId = req.body.allotmentId;

    allotmentDOA.updateAllotment(allotmentId, updateAllotment)
        .then(updated => {
            console.log("updated ", updated);
            return res.send({ data: {}, msg: "Assigment Updated Successfully" });
        }, err => {
            return res.status(500).send({ err })
        })
}

learnerController.allotmentUsingAssignmentId = function (req, res, next) {
    const assignmentId = req.query._id;
    console.log('Allotment List Using assignmentId', assignmentId);

    allotmentDOA.allotmentUsingAssignmentId(assignmentId)
        .then(function (assignment) {
            return res.send({ data: { assignment }, msg: "Assigment fetched Successfully" });
        }).catch(function (error) {
            return res.status(500).send({ err })
        })
}

learnerController.removeFileFromAllotment = function (req, res, next) {
    let query = {};
    if (req.query) {
        query = req.query
    }
    if (!query._id) {
        return res.status(500).send("NO FILES ID FOUND");
    }
    console.log("removeFileFromAllotment = ", query, "Params = ", req.query);

    allotmentDOA.removeFileFromAllotment(query)
        .then(deleted => {
            console.log("Deleted ", deleted);
            return res.send({ data: {}, msg: "Deleted Successfully" });
        }, err => {
            return res.status(500).send({ err })
        })
};

learnerController.assignmentFilesUsingAllotmentId = function (req, res, next) {
    const assignmentId = req.query._id;
    console.log('Allotment List Using assignmentId', assignmentId);

    allotmentDOA.assignmentFilesUsingAllotmentId(assignmentId)
        .then(function (assignment) {
            return res.send({ data: { assignment }, msg: "Assigment fetched Successfully" });
        }).catch(function (error) {
            return res.status(500).send({ err })
        })
}


learnerController.updateExamMarks = function (req, res, next) {
    async.eachSeries(req.body, (learner, cb) => {
        let updatedLearner = {};
        if (learner.exam1) updatedLearner['exam1'] = learner.exam1;
        if (learner.exam2) updatedLearner['exam2'] = learner.exam2;
        if (learner._id) updatedLearner['_id'] = learner._id;
        learnerDOA.updateLearner(updatedLearner).then(learner => {
            cb();
        }, err => {
            console.error(err);
            return res.status(500).send({ err })
        }).catch(err => {
            console.error(err);
        })
    }, (callbackError, callbackResponse) => {
        if (callbackError) {
            console.log("callbackError ", callbackError);
            return res.status(500).send({ err })
        } else {
            return res.send({ data: {}, msg: "Marks Updated Successfully" });
        }
    })
}




module.exports = learnerController;