var jobModel = require('../models/job.model');
const mailService = require('../services/mail.service');
const instructorModel = require('../models/instructor.model');
var Q = require('q');
const ObjectId = require('mongodb').ObjectId;

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
    if (req.query) {
        query = req.query;
    }

    if (req.user.userRole == 'admin') {
        query = {}
    } else if (req.user.userRole == 'instructor') {
        query = { instructors: { $in: req.user._id } }
    } else if (req.user.userRole == 'client') {
        query = { client: req.user._id }
    }

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

        getEmailOfInstructor(req.body.instructors).then((res) => {

            console.log('Email Response:', res);

            const defaultPasswordEmailoptions = {
                to: res,
                subject: `Job Added For You`,
                template: 'forgot-password'
            };

            mailService.sendMail(defaultPasswordEmailoptions, null, null, function (err, mailResult) {
                if (err) {
                    console.log('error:', error);
                    return res.status(500).send({ err })
                } else {
                    return res.send({ data: { job } });
                }
            });

        }).catch((err) => {
            console.log('ERROR While Instructor Email', err);
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
        return q.resolve(instructor.email);
    });
    return q.promise;
}


jobController.assignmentListUsingJobId = function (req, res) {
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
                _id: 1,
                assignment: {
                    $filter: {
                        input: "$assignment",
                        as: "assignments",
                        cond: { $and: [{ $eq: ["$$assignments.assignmentType", 'Assignment'] }] }
                    }
                }
            }
        },

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

module.exports = jobController;