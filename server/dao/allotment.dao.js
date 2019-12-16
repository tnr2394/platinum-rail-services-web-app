// Npm Modules
const Q = require('q');

const allotmentModel = require('../models/allotment.model');
const mailService = require('../services/mail.service');
const fileDAO = require('./file.dao');
const ObjectId = require('mongodb').ObjectId;


var allotment = {};

allotment.createAllotment = function (obj) {
    const q = Q.defer();
    const newAllotment = new allotmentModel(obj);

    newAllotment.save((err, newAllotment) => {
        if (err) {
            console.log('Err', err);
            return q.reject(err);
        } else {
            console.log("newAllotment Added Successfully =  ", newAllotment);
            return q.resolve(newAllotment);
        }
    });
    return q.promise;
}

allotment.updateAllotment = function (allotemntId, updateAllotment) {
    console.log("Update Allotemnt in allotemnt DAO", allotemntId, updateAllotment);
    var q = Q.defer();
    allotmentModel.findByIdAndUpdate({ _id: allotemntId }, { $set: updateAllotment }, (err, allotment) => {
        if (err) return q.reject(err);
        else {
            console.log("Allotment Updated Successfully =  ", allotment, q);
            return q.resolve(allotment);
        }
    });
    return q.promise;
}

allotment.getAllotment = function (allotemntId) {
    console.log("Get Allotemnts in allotemnt DAO", allotemntId);
    var q = Q.defer();
    allotmentModel.find({ _id: allotemntId })
        .populate('assignment')
        .populate('files')
        .populate('learner')
        .exec((err, allotemnt) => {
            if (err) q.reject(err)
            q.resolve(allotemnt)
            console.log("SENDING RESPONSE allotment =  ", allotemnt);
        })
    return q.promise;
}


allotment.deleteAllotment = function (allotemntId) {
    console.log("Delete allotment");
    var q = Q.defer();

    console.log("Allotment to be deleted : ", allotemntId);
    learnerModel.deleteOne({ _id: allotemntId }, (err, deleted) => {
        if (err) q.reject(err);
        console.log("Deleted ", deleted);
        q.resolve(deleted);
    });
    return q.promise;
}

allotment.submissionOfAssignment = function (allotemntId, obj) {
    console.log('Assignment Submission', allotemntId, obj);
    var q = Q.defer();
    fileDAO.addFile(obj).then((response) => {
        console.log('File added now update allotment file array', response._id);
        allotmentModel.updateOne(
            { _id: allotemntId },
            {
                $addToSet: { files: response._id },
                $set: {
                    status: "Submitted"
                }
            }, { new: true }, (err, updatedAllotment) => {
                if (err) q.reject(err);
                console.log('Updated', updatedAllotment);
                q.resolve(updatedAllotment);
            });
    }).catch((error) => {
        q.reject(error);
    });
    return q.promise;
}


allotment.allotmentUsingAssignmentId = function (assignmentId) {
    console.log('Assignment Submission', assignmentId);
    return new Promise((resolve, reject) => {
        allotmentModel.aggregate([
            {
                $match:
                {
                    'assignment': ObjectId(assignmentId)
                },
            },
            {
                $lookup: {
                    from: 'materials',
                    localField: 'assignment',
                    foreignField: '_id',
                    as: 'assignment',
                }
            },
            {
                $unwind: {
                    path: '$assignment',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'learners',
                    localField: 'learner',
                    foreignField: '_id',
                    as: 'learner',
                }
            },
            {
                $unwind: {
                    path: '$learner',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    allotemntId: '$_id',
                    learnerName: '$learner.name',
                    learnerId: '$learner._id',
                    assignmentTitle: '$assignment.title',
                    assignmentUnit: '$assignment.unitNo',
                    assignmentNo: '$assignment.assignmentNo',
                    assignmentStatus: '$status',
                }
            }
        ]).exec((error, res) => {
            if (error) {
                console.log('Error:', error);
                reject(error);
            } else {
                resolve(res);
            }
        });
    })
}


module.exports = allotment;


