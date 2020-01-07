
// Npm Variables

var Q = require('q');
const ObjectId = require('mongodb').ObjectId;
const lodash = require('lodash');

// Service Variables

const mailService = require('../services/mail.service');


// Model Variables

const jobModel = require('../models/job.model');
const instructorModel = require('../models/instructor.model');
const learnersModel = require('../models/learner.model');
const allotmentModel = require('../models/allotment.model');


var jobController = {};

async function allJobs(query) {
    var deferred = Q.defer();

    jobModel.find(query)
        .populate("client")
        .populate("location")
        .populate("course")
        .populate("instructors")
        .exec((err, jobs) => {
            if (err) deferred.reject(err);
            deferred.resolve(jobs);
        });
    return deferred.promise;
}

jobController.getJobs = async function (req, res) {


    var query = {};
    if (!req.query) {
        query = req.query;
    } else {
        if (req.user.userRole == 'admin') {
            query = req.query
        } else if (req.user.userRole == 'instructor') {
            query = { instructors: { $in: req.user._id } }
        } else if (req.user.userRole == 'client') {
            query = { client: req.user._id }
        }
    }

    allJobs(query).then(jobs => {
        res.send({ data: jobs })
        console.log('---JOBS---', jobs)
    })
}

jobController.getJobUsingInstructorId = async function (req, res) {

    const instructorId = req.query._id;

    console.log('Instructor Id', instructorId);
    
    query = { instructors: { $in: instructorId } }

    allJobs(query).then(jobs => {
        res.send({ data: jobs })
        console.log('---JOBS---', jobs)
    })
}



jobController.addJob = function (req, res) {
    console.log('ADD jobs', req.body);

    var newJob = new jobModel({
        title: req.body.title,
        color: req.body.jobColor,
        client: req.body.client,
        location: req.body.location,
        instructors: req.body.instructors,
        course: req.body.course,
        startingDate: req.body.startingDate,
        totalDays: req.body.totalDays,
        singleJobDate: req.body.singleJobDate
    });

    console.log('New Job', newJob)
    newJob.save((err, job) => {
        console.log(err)
        if (err) return res.status(500).send({ err })
        console.log("SENDING RESPONSE Jobs =  ", job)
        jobController.sendMailToClient(job._id).then((clientResponse) => {
            jobController.sendMailToInstructor(job._id).then((instructorResponse) => {
                return res.send({ data: { job } });
            }).catch((err) => {
                console.log('ERROR While Instructor Email', err);
                return res.status(500).send({ err })
            })
        }).catch((error) => {
            console.log('ERROR While Client Email', error);
            return res.status(500).send({ err })
        })
    });
}

jobController.updateJob = function (req, res) {
    console.log('BODY', req.body._id)
    var updatedJob = {
        title: req.body.title,
        color: req.body.jobColor,
        client: req.body.client,
        location: req.body.location,
        instructors: req.body.instructor,
        course: req.body.course,
        startingDate: req.body.startingDate,
        totalDays: req.body.totalDays,
        singleJobDate: req.body.singleJobDate
    }
    console.log("UPDATEDJOB = ", updatedJob)
    jobModel.findOneAndUpdate({ _id: req.body._id }, { $set: updatedJob }, (err, job) => {
        console.log("Updated job", job, err);
        if (err) {
            return res.status(500).send({ err })
        }
        return res.send({ data: { job } });
    });
}


jobController.deleteJob = function (req, res) {
    console.log("Delete job");
    let jobId = req.query._id;
    jobModel.deleteOne({ _id: jobId }, (err, deleted) => {
        if (err) {
            return res.status(500).send({ err })
        }
        console.log("Deleted ", deleted);
        return res.send({ data: {}, msg: "Deleted Successfully" });
    })
}

const getEmailOfInstructor = (instructorId) => {
    console.log('instructorId:', instructorId);
    var q = Q.defer();
    instructorModel.findOne({ _id: instructorId }, (err, instructor) => {
        console.log("GET EMAIL OF INSTRUCTOR =", { err, instructor })
        if (err) return q.reject(err);
        return q.resolve(instructor);
    });
    return q.promise;
}


/**
 * Assignment List Using JobId With Group By Unit Number
 */
jobController.assignmentListUsingJobId = function (req, res) {
    let jobId = req.query._id;

    jobModel.aggregate([
        {
            $match:
            {
                '_id': ObjectId(jobId)
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
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
            $unwind: {
                path: '$course.materials',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'materials',
                localField: 'course.materials',
                foreignField: '_id',
                as: 'material',
            }
        },
        {
            $unwind: {
                path: '$material',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                assignment: {
                    assignmentTitle: '$material.title',
                    assignmentNo: '$material.assignmentNo',
                    assignmentUnit: '$material.unitNo',
                    assignmentId: '$material._id',
                    assignmentType: '$material.type',
                }
            }
        },
        {
            $group: {
                _id: '$_id',
                assignment: {
                    $push: '$assignment'
                }
            }
        },
        {
            $project: {
                _id: 0,
                unitNo: '$_id',
                assignment: {
                    $filter: {
                        input: "$assignment",
                        as: "assignments",
                        cond: { $and: [{ $eq: ["$$assignments.assignmentType", 'Assignment'] }] }
                    }
                }
            }
        },
        {
            $unwind: {
                path: '$assignment',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: '$assignment.assignmentUnit',
                assignment: {
                    $push: '$assignment'
                }
            }
        },
        {
            $sort: {
                'assignment.assignmentUnit': 1
            }
        }
    ]).exec((error, assignment) => {
        if (error) {
            console.log('Error:', error);
            return res.status(500).send({ err })
        } else {
            console.log('assignment', assignment);
            return res.send({ data: { assignment }, msg: "Deleted Successfully" });
        }
    });
}

/**
 * Total Assignment List Using JobId
 */
jobController.assignmentListUsingJobIdWithoutGroup = function (req, res) {
    let jobId = req.query._id;


    console.log("Assignment List", jobId);

    jobModel.aggregate([
        {
            $match:
            {
                '_id': ObjectId(jobId)
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
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
            $unwind: {
                path: '$course.materials',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'materials',
                localField: 'course.materials',
                foreignField: '_id',
                as: 'material',
            }
        },
        {
            $unwind: {
                path: '$material',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                assignment: {
                    assignmentTitle: '$material.title',
                    assignmentNo: '$material.assignmentNo',
                    assignmentUnit: '$material.unitNo',
                    assignmentId: '$material._id',
                    assignmentType: '$material.type',
                }
            }
        },
        {
            $group: {
                _id: '$_id',
                assignment: {
                    $push: '$assignment'
                }
            }
        },
        {
            $project: {
                _id: 0,
                unitNo: '$_id',
                assignment: {
                    $filter: {
                        input: "$assignment",
                        as: "assignments",
                        cond: { $and: [{ $eq: ["$$assignments.assignmentType", 'Assignment'] }] }
                    }
                }
            }
        },
        {
            $sort: {
                'assignment.assignmentUnit': 1
            }
        }
    ]).exec((error, assignment) => {
        if (error) {
            console.log('Error:', error);
            return res.status(500).send({ err })
        } else {
            console.log('assignment', assignment[0]);
            return res.send({ data: { assignment }, msg: "Deleted Successfully" });
        }
    });
}




/**
 * Function Returns Learner List With Allotment Arrays
 */
jobController.assignmentStatusWithLearner = function (req, res) {
    let jobId = req.query._id;
    console.log("Assignment List With Learner", jobId);
    learnersModel.aggregate([
        {
            $match:
            {
                'job': ObjectId(jobId)
            },
        },
        {
            $unwind: {
                path: '$allotments',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'allotments',
                localField: 'allotments',
                foreignField: '_id',
                as: 'allotments',
            }
        },
        {
            $unwind: {
                path: '$allotments',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                learnerName: '$name',
                assignment: {
                    assignmentId: '$allotments.assignment',
                    assignmentStatus: '$allotments.status',
                    allotedAt: '$allotments.createdAt',
                    updatedAt: '$allotments.updatedAt',
                    assignmentRemark: '$allotments.remark'
                }
            }
        },
        {
            $group: {
                _id: '$_id',
                learnerName: {
                    $first: '$learnerName',
                },
                assignments: {
                    $push: '$assignment'
                }
            }
        }
    ]).exec((error, assignment) => {
        if (error) {
            console.log('Error:', error);
            return res.status(500).send({ err })
        } else {
            return res.send({ data: { assignment }, msg: "Deleted Successfully" });
        }
    });
}



jobController.sendMailToClient = (jobId) => {

    return new Promise((resolve, reject) => {
        console.log('Send Mail To Client For Job Creation', jobId);

        const query = { _id: jobId }

        allJobs(query).then((jobs) => {


            const defaultPasswordEmailoptions = {
                to: jobs[0].client.email,
                subject: `Added ` + jobs[0].client.name + ` to a Job`,
                template: 'jobAssign-client'
            };

            mailService.sendMail(defaultPasswordEmailoptions, jobs[0], null, function (err, mailResult) {
                if (err) {
                    reject(err);
                } else {
                    resolve(mailResult)
                }
            });
        }).catch((error) => {
            reject(error);
        })
    })
}


jobController.sendMailToInstructor = (jobId) => {

    return new Promise((resolve, reject) => {
        console.log('Send Mail To Client For Job Creation', jobId);

        const query = { _id: jobId }

        allJobs(query).then((jobs) => {

            let instructorsArray = [];

            lodash.forEach(jobs[0].instructors, function (single) {
                instructorsArray.push(single.email);
            })


            const defaultPasswordEmailoptions = {
                to: instructorsArray,
                subject: `Added you to a Job`,
                template: 'jobAssign-instructor'
            };

            mailService.sendMail(defaultPasswordEmailoptions, jobs[0], null, function (err, mailResult) {
                if (err) {
                    reject(err);
                } else {
                    resolve(mailResult)
                }
            });
        }).catch((error) => {
            reject(error);
        })
    })
}

module.exports = jobController;