var jobModel = require('../models/job.model');
const mailService = require('../services/mail.service');
const instructorModel = require('../models/instructor.model');
var Q = require('q');

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

    console.log('Req.user', req.user);

    console.log('current User', req.session.currentUser);

    var query = {};
    if (req.query) {
        query = req.query;
    }

    console.log('GET jobs with query = ', query);

    // console.log('req.session.currentUser', sass.currentUser);

    // const userRole = 'instructor';

    // if (userRole == 'admin') {
    //     query = {}
    // } else if (userRole == 'instructor') {
    //     query = { instructors: { $in: req.user.instructor._id } }
    // } else if (userRole == 'client') {
    //     query = { client: req.user.client._id }
    // }

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

module.exports = jobController;