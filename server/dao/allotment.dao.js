// Npm Modules
const Q = require('q');
const ObjectId = require('mongodb').ObjectId;
const lodash = require('lodash');

// Model Variables

const allotmentModel = require('../models/allotment.model');
const mailService = require('../services/mail.service');
const fileDAO = require('./file.dao');
const learnerDAO = require('./learner.dao');

var allotment = {};

allotment.createAllotment = function (obj) {
    const q = Q.defer();
    const newAllotment = new allotmentModel(obj);
    allotmentModel.find(
        {
            assignment: obj.assignment,
            learner: obj.learner
        }, (err, allotFound) => {
            if (err) {
                return q.reject(err);
            } else if (allotFound.length) {
                return q.resolve(allotFound[0]);
            } else {
                console.log('Inside Else If', newAllotment);
                newAllotment.save((err, newAllotment) => {
                    if (err) {
                        console.log(err)
                        return q.reject(err);
                    } else {
                        console.log("newAllotment Added Successfully =  ", newAllotment);
                        return q.resolve(newAllotment);
                    }
                });
            }
        })
    return q.promise;
}


allotment.updateAllotment = function (allotmentId, updateAllotment, remark) {
    console.log("Update Allotemnt in allotemnt DAO", allotmentId, updateAllotment);
    const q = Q.defer();

    if (remark) {
        const remarkDetail = { text: remark }
    }
    allotmentModel.findByIdAndUpdate({ _id: allotmentId }, { $set: updateAllotment, $push: { remark: remarkDetail } }, { upsert: true, new: true }, (err, allotment) => {
        if (err) return q.reject(err);
        else {
            console.log("Allotment Updated Successfully =  ", allotment, q);

            let emailArrays = [];



            allotmentUsingAllotmentId(allotmentId).then((res) => {

                if (res.learner) {
                    emailArrays.push(res.learner.learnerEmail)
                }

                lodash.forEach(res.instructors, function (single) {
                    emailArrays.push(single.email);
                })

                const defaultPasswordEmailoptions = {
                    to: emailArrays,
                    subject: `Submission Status:` + res.assignment.assignmentStatus,
                    template: 'submission-instructor'
                };

                mailService.sendMail(defaultPasswordEmailoptions, res, null, function (err, mailResult) {
                    if (err) {
                        return res.status(500).send({ err })
                    } else {
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
        .populate('assignment', { _id: 1, title: 1, type: 1, unitNo: 1, assignmentNo: 1 })
        .populate('files', { _id: 1, title: 1, alias: 1, path: 1, extension: 1, uploadedBy: 1, createdAt: 1, updatedAt: 1 })
        .populate('learner', { _id: 1, name: 1, email: 1 })
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
    fileDAO.addNewFile(obj).then((response) => {
        console.log('File added now update allotment file array', response._id);
        allotmentModel.updateOne({ _id: allotemntId },
            {
                $addToSet: { files: response._id },
                $set: {
                    status: assignmentStatus
                }
            }, { new: true }, (err, updatedAllotment) => {
                if (err) q.reject(err);

                allotmentUsingAllotmentId(allotemntId).then((res) => {

                    let instructorsArray = [];

                    lodash.forEach(res.instructors, function (single) {
                        instructorsArray.push(single.email);
                    })

                    var mailSubject = res.client.clientName + '(' + res.client.location + ') ' + 'Assignment ' + res.assignment.assignmentStatus;

                    const defaultPasswordEmailoptions = {
                        to: instructorsArray,
                        subject: mailSubject,
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

/**
 * Allotment Detail Using AllotmentId
 * @param {string} allotmentId 
 */
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
                $lookup: {
                    from: 'clients',
                    localField: 'job.client',
                    foreignField: '_id',
                    as: 'client',
                }
            },
            {
                $unwind: {
                    path: '$client',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'job.location',
                    foreignField: '_id',
                    as: 'location',
                }
            },
            {
                $unwind: {
                    path: '$location',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'job.course',
                    foreignField: '_id',
                    as: 'course',
                }
            },
            {
                $unwind: {
                    path: '$course',
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
                    },
                    client: {
                        clientName: '$client.name',
                        location: '$location.title'
                    },
                    course: {
                        courseTitle: '$course.title',
                        courseDuration: '$course.duration'
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
                    },
                    client: {
                        $first: '$client'
                    },
                    course: {
                        $first: '$course'
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

/**
 * Allotment Detail Using AssignmentId
 */
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

/**
 * Assignment Fiiles Using AllotmentId (Uploaded by Instructor Inside Assignment)
 */
allotment.assignmentFilesUsingAllotmentId = (allotmentId) => {
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
                $unwind: {
                    path: '$assignment.files',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'files',
                    localField: 'assignment.files',
                    foreignField: '_id',
                    as: 'files',
                }
            },
            {
                $unwind: {
                    path: '$files',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id',
                    files: {
                        $push: '$files'
                    }
                }
            }
        ]).exec((error, res) => {
            if (error) {
                console.log('Error:', error);
                reject(error);
            } else {
                console.log('Res', res);
                resolve(res[0]);
            }
        });
    })
}



module.exports.allotmentUsingAllotmentId = allotmentUsingAllotmentId;


module.exports = allotment;


