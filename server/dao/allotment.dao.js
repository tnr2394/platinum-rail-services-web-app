// Npm Modules
const Q = require('q');

const allotmentModel = require('../models/allotment.model');
const mailService = require('../services/mail.service');
const fileDAO = require('./file.dao');
const ObjectId = require('mongodb').ObjectId;
const lodash = require('lodash');


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

allotment.updateAllotment = function (allotmentId, updateAllotment) {
    console.log("Update Allotemnt in allotemnt DAO", allotmentId, updateAllotment);
    var q = Q.defer();
    allotmentModel.findByIdAndUpdate({ _id: allotmentId }, { $set: updateAllotment }, (err, allotment) => {
        if (err) return q.reject(err);
        else {
            console.log("Allotment Updated Successfully =  ", allotment, q);

            allotmentUsingAllotmentId(allotmentId).then((res) => {

                console.log('allotment Response---------->>>>>>>>', res);

                const defaultPasswordEmailoptions = {
                    to: res.learner.learnerEmail,
                    subject: `Assignment Submitted`,
                    template: 'submission-instructor'
                };

                console.log('defaultPasswordEmailoptions', defaultPasswordEmailoptions);

                mailService.sendMail(defaultPasswordEmailoptions, res.assignment, null, function (err, mailResult) {
                    if (err) {
                        console.log('mail error--------------->>>>', err);
                        return res.status(500).send({ err })
                    } else {
                        console.log('mailResult', mailResult);
                        return q.resolve(allotment);
                    }
                });

            }).catch((err) => {
                console.log('ERROR While Instructor Email', err);
            })
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

allotment.submissionOfAssignment = function (allotemntId, assignmentStatus, obj) {
    console.log('Assignment Submission', allotemntId, obj);
    var q = Q.defer();
    fileDAO.addFile(obj).then((response) => {
        console.log('File added now update allotment file array', response._id);
        allotmentModel.updateOne(
            { _id: allotemntId },
            {
                $addToSet: { files: response._id },
                $set: {
                    status: assignmentStatus
                }
            }, { new: true }, (err, updatedAllotment) => {
                if (err) q.reject(err);
                console.log('Updated', updatedAllotment);

                allotmentUsingAllotmentId(allotemntId).then((res) => {

                    console.log('Email Response:', res);

                    let instructorsArray = [];

                    console.log('res.instructors', res.instructors);


                    lodash.forEach(res.instructors, function (single) {

                        console.log('Single--------->>>>>', single);
                        instructorsArray.push(single.email);
                    })

                    console.log('instructorsArray', instructorsArray);

                    const defaultPasswordEmailoptions = {
                        to: instructorsArray,
                        subject: `Assignment Submitted`,
                        template: 'submission-learner'
                    };

                    mailService.sendMail(defaultPasswordEmailoptions, res, null, function (err, mailResult) {
                        if (err) {
                            console.log('error:', err);
                            return res.status(500).send({ err })
                        } else {
                            q.resolve(updatedAllotment);
                        }
                    });

                }).catch((err) => {
                    console.log('ERROR While Instructor Email', err);
                })
            });
    }).catch((error) => {
        q.reject(error);
    });
    return q.promise;
}

allotment.removeFileFromAllotment = function (fileId) {
    console.log("delete file to allotment DOA ", { fileId });
    var q = Q.defer();
    fileDAO.deleteFile(fileId)
        .then(updatedCourse => {
            console.log("Deleted from files. Now deleting from allotment Collection", updatedCourse);
            allotmentModel
                .updateOne({ files: { $in: fileId._id } }, { $pull: { files: fileId._id } }, { upsert: true, new: true }, (err, updatedAllotment) => {
                    if (err) return q.reject(err);
                    else {
                        console.log("Allotment Updated with new file Successfully =  ", updatedAllotment);
                        return q.resolve(updatedAllotment);
                    }
                });
        }, err => {
            console.error(err);
        }).catch(err => {
            console.error(err);
            return q.reject({ msg: "No File found" });
        })
    return q.promise;
}

const allotmentUsingAllotmentId = (allotmentId) => {
    console.log('Allotment Submission', allotmentId);
    return new Promise((resolve, reject) => {
        allotmentModel.aggregate([
            {
                $match:
                {
                    '_id': ObjectId(allotmentId)
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
                $lookup: {
                    from: 'jobs',
                    localField: 'learner.job',
                    foreignField: '_id',
                    as: 'job',
                }
            },
            {
                $unwind: {
                    path: '$job',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$job.instructors',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'instructors',
                    localField: 'job.instructors',
                    foreignField: '_id',
                    as: 'instructors',
                }
            },
            {
                $unwind: {
                    path: '$instructors',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    instructors: {
                        _id: "$instructors._id",
                        name: "$instructors.name",
                        email: "$instructors.email",
                    },
                    assignment: {
                        assignmentTitle: '$assignment.title',
                        assignmentUnit: '$assignment.unitNo',
                        assignmentNo: '$assignment.assignmentNo',
                        assignmentStatus: '$status',
                        assignmentRemark: '$remark'
                    },
                    learner: {
                        learnerEmail: '$learner.email',
                        learnerName: '$learner.name'
                    }
                }
            },
            {
                $group: {
                    _id: '$job._id',
                    instructors: {
                        $push: '$instructors'
                    },
                    assignment: {
                        $first: '$assignment'
                    },
                    learner: {
                        $first: '$learner'
                    }
                }
            }
        ]).exec((error, res) => {
            if (error) {
                console.log('Error:', error);
                reject(error);
            } else {
                console.log('Res', res[0]);
                resolve(res[0]);
            }
        });
    })
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

module.exports.allotmentUsingAllotmentId = allotmentUsingAllotmentId;


module.exports = allotment;


