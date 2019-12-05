const jwt = require("jsonwebtoken");
const mailService = require('../services/mail.service');


const Q = require('q');
const async = require("async");


// Dao Variables

const learnerDOA = require('../dao/learner.dao');
const clientDOA = require('../dao/client.dao');
const allotmentDOA = require('../dao/allotment.dao');


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
    const submittedFile = req.file;

    allotmentDOA.submissionOfAssignment(allotmentId, submittedFile)
        .then(updated => {
            console.log("updated ", updated);
            return res.send({ data: {}, msg: "Assigment Submitted Successfully" });
        }, err => {
            return res.status(500).send({ err })
        })
}


module.exports = learnerController;