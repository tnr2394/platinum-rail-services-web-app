 var jobModel = require('../models/job.model');
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

 jobController.getJobs = async function(req, res){
     var query = {};
     if(req.query){
         query = req.query;
     }
     console.log('GET jobs with query = ',query);
     allJobs(query).then(jobs => {
         res.send({ data: jobs})
         console.log('---JOBS---', jobs)
     } )
 }
 
 jobController.addJob = function(req, res){
     console.log('ADD jobs', req.body);

    var newJob = new jobModel({
        title: req.body.title,
        color: req.body.jobColor,
        client: req.body.client,
        location: req.body.location,
        instructors: req.body.instructor,
        course: req.body.course,
        startingDate: req.body.startingDate,
        totalDays: req.body.totalDays,
        singleJobDate: req.body.singleJobDate
    });
    console.log('New Job', newJob)
    newJob.save((err, job)=>{
        console.log(err)
        if (err) return res.status(500).send({ err })
        console.log("SENDING RESPONSE Jobs =  ", job)
        return res.send({ data: { job } });
    });
 }

 jobController.updateJob = function(req, res){
    console.log('BODY',req.body._id)
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
    console.log("UPDATEDJOB = ",updatedJob)
     jobModel.findOneAndUpdate({ _id: req.body._id }, { $set: updatedJob }, (err, job) => {
         console.log("Updated job", job, err);
         if (err) {
             return res.status(500).send({ err })
         }
         return res.send({ data: { job } });
    });
 }

 jobController.deleteJob = function(req, res){
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

 module.exports = jobController;