var learnerDOA = require('../dao/learner.dao');
var clientDOA = require('../dao/client.dao');
var Q = require('q');
const jwt = require("jsonwebtoken");


var learnerController = {};

async function allLearners() {
    var deferred = Q.defer();

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
    })
        .catch(err => {
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


module.exports = learnerController;