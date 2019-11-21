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

//  jobController.getJobs = async function(req, res){
//      console.log('GET jobs')
//      allJobs().then(jobs => {
//          res.send({ data: jobs})
//          console.log('---JOBS---', jobs)
//      } )
//  }
jobController.getJobs = function(req,res){
    jobModel.find({}).populate('course').exec((err, detailedJob)=>{
        if (err) {
            console.log("ERROR IS",err)
        }
        console.log("Populated job", detailedJob)
    })
}

 jobController.addJob = function(req, res){
     console.log('ADD jobs', req.body.instructor.toJSON);

    var newJob = new jobModel({
        title: req.body.title,
        color: req.body.jobColor,
        client: req.body.client,
        location: req.body.location,
        instructor: req.body.instructor,
        course: req.body.course[0].course._id,
        startingDate: req.body.startingDate,
        totalDays: req.body.totalDays,
        singleJobDate: req.body.singleJobDate
    });
    console.log('New Job', newJob)
    // newJob.save((err, job)=>{
        // console.log(err)
        // if (err) return res.status(500).send({ err })
        // console.log("SENDING RESPONSE Jobs =  ", job)
        // return res.send({ data: { job } });
    // });
 }

 jobController.updateJob = function(req, res){
    console.log('BODY',req.body)
    var updatedJob = {
        title: req.body.title,
        color: req.body.color,
        client: req.body.client,
        location: req.body.location,
        instructor: req.body.instructor,
        course: req.body.course,
        startingDate: req.body.startingDate,
        totalDays: req.body.totalDays,
        singleJobDate: req.body.singleJobDate
    }
    console.log("UPDATEDJOB = ",updatedJob)
     jobModel.findOneAndUpdate({ _id: req.body.id }, { $set: updatedJob }, (err, job) => {
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