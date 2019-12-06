// Npm Variables

const jwt = require("jsonwebtoken");
const Q = require('q');
const async = require("async");

// Service Variables

const mailService = require('../services/mail.service');
const reCaptchaService = require('../services/reCaptcha.service');


// Dao Variables

const learnerDOA = require('../dao/learner.dao');
const clientDOA = require('../dao/client.dao');
const allotmentDOA = require('../dao/allotment.dao');

const learnerModel = require('../models/learner.model')




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
    console.log("ADD learner", req.body);

    var newLearner = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        job: req.body.job
    };
    learnerDOA.createLearner(newLearner).then(newLearner => {
        console.log("Created Learner", newLearner);
        return res.send({ data: { learner: newLearner } })
    }, err => {
        return res.status(500).send({ err });
    });
}


learnerController.updateLearner = async function (req, res, next) {
    var updatedLearner = {
        _id: req.body._id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    };
    console.log("Update Learner DOA in Learner-Controller", req.body);

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
                    const payload = { learner };
                    var token = jwt.sign(payload, 'platinum');
                    req.session.currentUser = token;
                    return res.status(200).json({ message: 'Login Successfully', data: token, userRole: 'learner' });
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
    console.log('Allot Assignment');

    console.log('Allot Assignment', req.body);

    async.eachSeries(req.body, (singleLearner, outerCallback) => {
        console.log('Single learner', singleLearner);
        async.eachSeries(singleLearner.assignments, (singleAssignment, innerCallback) => {
            console.log('singleAssignment', singleAssignment);
            const newAllotment = {
                assignment: singleAssignment._id,
                learner: singleLearner.learner,
                status: 'pending',
                deadlineDate: Date.now(),
            }
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
                outerCallback();
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
    console.log('Assignment Submission');

    const allotmentId = req.body.allotmentId;

    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(req.files.file.name)[1];
    var name = req.files.file.name.split('.').slice(0, -1).join('.')

    // return res.send({body: req.body,files:req.files});

    var newFile = {
        title: name,
        type: "material",// OR SUBMISSION OR DOCUMENT
        path: "NEWPATH",
        extension: ext,
        uploadedBy: "ADMIN",
        file: req.files,
        uploadedDate: new Date()
    }

    console.log('new file object', newFile, allotmentId);

    allotmentDOA.submissionOfAssignment(allotmentId, newFile)
        .then(updated => {
            console.log("updated ", updated);
            return res.send({ data: {}, msg: "Assigment Submitted Successfully" });
        }, err => {
            return res.status(500).send({ err })
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



module.exports = learnerController;