
// Npm Variables

var Q = require('q');
const ObjectId = require('mongodb').ObjectId;
const lodash = require('lodash');
const async = require("async");

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

    jobModel.aggregate([
        {
            $match: query
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
            $lookup: {
                from: 'clients',
                localField: 'client',
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
                localField: 'location',
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
            $unwind: {
                path: '$instructors',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'instructors',
                localField: 'instructors',
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
                from: 'files',
                localField: 'instructors.profilePic',
                foreignField: '_id',
                as: 'instructors.profilePic',
            }
        },
        {
            $unwind: {
                path: '$instructors.profilePic',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'learners',
                localField: '_id',
                foreignField: 'job',
                as: 'learners',
            }
        },
        {
            $group: {
                _id: '$_id',
                instructors: {
                    $push: '$instructors'
                },
                learners: {
                    $first: '$learners'
                },
                client: {
                    $first: '$client'
                },
                location: {
                    $first: '$location'
                },
                singleJobDate: {
                    $first: '$singleJobDate'
                },
                startingDate: {
                    $first: '$startingDate'
                },
                totalDays: {
                    $first: '$totalDays'
                },
                color: {
                    $first: '$color'
                },
                title: {
                    $first: '$title'
                },
                course: {
                    $first: '$course',
                }
            }
        },
        {
            $project: {
                instructors: 1,
                course: 1,
                totalDays: 1,
                startingDate: 1,
                singleJobDate: 1,
                location: 1,
                client: 1,
                color: 1,
                title: 1,
                numberOfLearners: { $cond: { if: { $isArray: "$learners" }, then: { $size: "$learners" }, else: "NA" } }
            }
        }
    ]).exec((err, jobs) => {
        if (err) deferred.reject(err);
        deferred.resolve(jobs);
    });
    return deferred.promise;

    // jobModel.find(query)
    //     .populate("client")
    //     .populate("location")
    //     .populate("course")
    //     .populate("instructors")
    //     .exec((err, jobs) => {
    //         if (err) deferred.reject(err);
    //         deferred.resolve(jobs);
    //     });
    // return deferred.promise;
}

jobController.getJobs = async function (req, res) {

    let query = {
        $and: []
    }

    if (req.query && req.query._id) {
        query['$and'].push({ '_id': ObjectId(req.query._id) })
    } else {
        if (req.user.userRole == 'admin') {
            query = {}
        } else if (req.user.userRole == 'instructor') {
            query['$and'].push({ 'instructors': ObjectId(req.user._id) })
        } else if (req.user.userRole == 'client') {
            query['$and'].push({ 'client': ObjectId(req.user._id) })
        }
    }

    console.log('Query:::::::::::::', query);

    allJobs(query).then(jobs => {
        res.send({ data: jobs })
    })
}

jobController.getJobUsingInstructorId = async function (req, res) {

    const instructorId = req.query._id;

    console.log('Instructor Id', instructorId);

    let query = { $and: [] }
    query['$and'].push({ 'instructors': ObjectId(instructorId) })

    allJobs(query).then(jobs => {
        console.log('---JOBS:::::::::::::::::::', jobs)
        res.send({ data: jobs })

    })
}

jobController.getJobUsingClientId = async function (req, res) {
    const clientId = req.query._id;
    console.log("Client Id", clientId);

    let query = { $and: [] }
    query['$and'].push({ 'client': ObjectId(clientId) })

    allJobs(query).then(jobs => {
        console.log('---JOBS:::::::::::::::::::', jobs)
        res.send({ data: jobs })
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
    console.log('BODY', req.body)
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

    sendInstructorRemovedMail(req.body.removedInstructor, req.body._id).then((sendMailResponse) => {
        console.log("UPDATEDJOB = ", updatedJob)
        jobModel.findOneAndUpdate({ _id: req.body._id }, { $set: updatedJob }, (err, job) => {
            console.log("Updated job", job, err);
            if (err) {
                return res.status(500).send({ err })
            }
            return res.send({ data: { job } });
        });
    }).catch((sendMailError) => {
        return res.status(500).send({ sendMailError })
    })
}

const sendInstructorRemovedMail = (instructors, jobId) => {
    return new Promise((resolve, reject) => {
        if (instructors.length == 0) {
            resolve();
        } else {
            console.log('sendInstructorRemovedMail Function Called', instructors, jobId);
            async.eachSeries(instructors, (singleInstructor, callback) => {
                instructorDetail(singleInstructor).then((instructorDetail) => {
                    jobDetail(jobId).then((jobDetail) => {

                        const defaultPasswordEmailoptions = {
                            to: instructorDetail.email,
                            subject: `Removed From Job`,
                            template: 'jobRemove-instructor'
                        };

                        const MailData = { job: jobDetail, instructor: instructorDetail }

                        mailService.sendMail(defaultPasswordEmailoptions, MailData, null, function (err, mailResult) {
                            if (err) {
                                reject(err);
                            } else {
                                callback();
                            }
                        });
                    }).catch((jobError) => {
                        reject(jobError);
                    })
                }).catch((err) => {
                    reject(err);
                })
            }, (callbackError, callbackResponse) => {
                if (callbackError) {
                    reject(callbackError);
                } else {
                    console.log("Final callback");
                    resolve(callbackResponse)
                }
            })
        }

    })
}

const jobDetail = (jobId) => {
    return new Promise((resolve, reject) => {
        jobModel.findOne({ _id: jobId })
            .populate("client")
            .populate("location")
            .populate("course")
            .populate("instructors")
            .exec((err, jobs) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(jobs)
                }
            });
    })
}

const instructorDetail = (instructorId) => {
    return new Promise((resolve, reject) => {
        instructorModel.findOne({ _id: instructorId })
            .exec((err, instructors) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(instructors)
                }
            });
    })
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

    console.log('Assignment List Using Job Id:', jobId);

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
                    allotmentId: '$allotments._id',
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


jobController.allotedAssignmentListUsingJobId = function (req, res) {
    let jobId = req.query._id;

    console.log('Assignment List Using Job Id:', jobId);

    jobModel.aggregate([
        {
            $match:
            {
                '_id': ObjectId(jobId)
            },
        },
        {
            $lookup: {
                from: 'learners',
                localField: '_id',
                foreignField: 'job',
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
            $group: {
                _id: '$_id',
                learner: {
                    $push: '$learner'
                }
            }
        },
        {
            $unwind: {
                path: '$learner',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: '$learner.allotments',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'allotments',
                localField: 'learner.allotments',
                foreignField: '_id',
                as: 'allotment',
            }
        },
        {
            $unwind: {
                path: '$allotment',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: '$_id',
                allotment: {
                    $push: '$allotment'
                }
            }
        },
        {
            $unwind: {
                path: '$allotment',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'materials',
                localField: 'allotment.assignment',
                foreignField: '_id',
                as: 'allotment.assignment',
            }
        },
        {
            $unwind: {
                path: '$allotment.assignment',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'learners',
                localField: 'allotment.learner',
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
                allotemntId: '$allotment._id',
                learnerName: '$learner.name',
                learnerId: '$learner._id',
                assignmentId: '$allotment.assignment._id',
                assignmentTitle: '$allotment.assignment.title',
                assignmentUnit: '$allotment.assignment.unitNo',
                assignmentNo: '$allotment.assignment.assignmentNo',
                assignmentStatus: '$allotment.status',
            }
        }
    ]).exec((error, assignment) => {
        if (error) {
            console.log('Error:', error);
            return res.status(500).send({ err })
        } else {
            console.log('assignment', assignment);
            return res.send({ data: { assignment }, msg: "Assignment List fetch Successfully" });
        }
    });
}



jobController.sendMailToClient = (jobId) => {

    return new Promise((resolve, reject) => {
        console.log('Send Mail To Client For Job Creation', jobId);


        let query = { $and: [] }
        query['$and'].push({ '_id': ObjectId(jobId) })


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



        let query = { $and: [] }
        query['$and'].push({ '_id': ObjectId(jobId) })

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