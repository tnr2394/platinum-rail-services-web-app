 var jobModel = require('../models/job.model');
 var Q = require('q');

 var jobController = {};

async function allJobs() {
    var deferred = Q.defer();

    jobModel.find({}, (err, jobs) => {
        if (err) deferred.reject(err);
        deferred.resolve(jobs);
    });
    return deferred.promise;
}

 jobController.getJobs = async function(req, res){
     console.log('GET jobs')
     allJobs().then(jobs => {
         res.send({ data: jobs})
     } )
 }

 jobController.addJob = function(req, res){
    console.log('ADD jobs');

    var newJob = new jobModel({
        title: req.body.title,
        color: req.body.color,
        client: req.body.client,
        location: req.body.location,
        instructor: req.body.instructor,
        course: req.body.course,
        startingDate: req.body.startingDate,
        frequency: req.body.totalDays,
        singleJobDate: req.body.singleJobDate
    });

    newJob.save((err, job)=>{
        if (err) return res.status(500).send({ err })
        console.log("SENDING RESPONSE Jobs =  ", job)
        return res.send({ data: { job } });
    });
 }

 jobController.updateJob = function(req, res){
    var updatedJob = {
        title: req.body.title,
        color: req.body.color,
        client: req.body.client,
        location: req.body.location,
        instructor: req.body.instructor,
        course: req.body.course,
        startingDate: req.body.startingDate,
        frequency: req.body.totalDays,
        singleJobDate: req.body.singleJobDate
    }
     jobModel.findOneAndUpdate({ _id: req.body._id }, { $set: updatedJob }, { new: true }, (err, job) => {
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