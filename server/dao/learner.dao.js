var learnerModel = require('../models/learner.model');
var Q = require('q');
const mailService = require('../services/mail.service');
var learner = {};

learner.createLearner = function (obj) {
    var q = Q.defer();
    var newLearner = new learnerModel(obj);

    newLearner.save((err, newLearner) => {
        if (err) return q.reject(err);
        console.log("newLearner Added Successfully =  ", newLearner);
        learner.sendMailToLearner(newLearner._id).then((response) => {
            return q.resolve(newLearner);
        }).catch((error) => {
            return q.reject(err);
        })
    });
    return q.promise;
}

learner.getLearnersByQuery = function (query) {
    var q = Q.defer();
    console.log("GET learners query = ", query, "Params = ", query);

    learnerModel.find(query)
        .populate('job')
        .populate('allotments')
        .exec((err, learners) => {
            if (err) q.reject(err)
            q.resolve(learners)
            console.log("SENDING RESPONSE learner =  ", learners);
        })
    return q.promise;
}


learner.updateLearner = function (object) {
    console.log("Update Learner in location DAO", object);
    var q = Q.defer();
    var updatedLearner = object;
    learnerModel.findByIdAndUpdate(object._id, updatedLearner, { new: true }, (err, learner) => {
        if (err) return q.reject(err);
        else {
            console.log("Learner Uploaded & Updated Successfully =  ", learner, q);
            return q.resolve(learner);
        }
    });
    return q.promise;
}

learner.deleteLearner = function (learnerId) {
    console.log("Delete learner");
    var q = Q.defer();

    console.log("Learner to be deleted : ", learnerId);
    learnerModel.deleteOne({ _id: learnerId }, (err, deleted) => {
        if (err) q.reject(err);
        console.log("Deleted ", deleted);
        q.resolve(deleted);
    });
    return q.promise;
}

learner.updateAssignment = function (learnerId, assignment) {
    console.log("Update Learner in location DAO", learnerId);
    var q = Q.defer();
    learnerModel.findByIdAndUpdate({ _id: learnerId }, { $push: { allotments: assignment } }, { new: true }, (err, learner) => {
        if (err) return q.reject(err);
        else {
            console.log("Learner Uploaded & Updated Successfully =  ", learner, q);
            return q.resolve(learner);
        }
    });
    return q.promise;
}

learner.sendMailToLearner = function (learnerId) {

    // console.log("newLearner Added Successfully =  ", newLearner);
    var q = Q.defer();
    console.log("Learner to be send email:", learnerId);

    learnerModel.findOne({ _id: learnerId }).exec((err, learner) => {
        if (err) {
            q.reject(err);
        } else if (learner) {
            const defaultPasswordEmailoptions = {
                to: learner.email,
                subject: `You Added In Job`,
                template: 'forgot-password'
            };
            mailService.sendMail(defaultPasswordEmailoptions, null, null, function (err, mailResult) {
                if (err) {
                    console.log('error:', err);
                    q.reject(err);
                } else {
                    q.resolve(mailResult);
                }
            });
        }
    });
    return q.promise;
}


module.exports = learner;