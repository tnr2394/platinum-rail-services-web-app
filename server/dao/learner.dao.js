var learner = require('../models/learner.model');
var Q = require('q');

var learner = {};
learner.createLearner = function(obj){
    var q = Q.defer();
    var newLearner = new learnerModel(obj);

    newlearner.save((err,newLocation)=>{
        if(err) return q.reject(err);
        console.log("newLocation Uploaded Successfully =  ",newLocation);
        return q.resolve(newLocation);
    });   
    return q.promise;
}

learner.getLearnersByQuery = function(query){
    var q = Q.defer();
    console.log("GET locations query = ",query,"Params = ",query);
    learnerModel.find(query,(err,locations)=>{
        if(err) q.reject(err)
        q.resolve(locations)
        console.log("SENDING RESPONSE locations =  ",locations);
    })
    return q.promise;
}


learner.updateLearner = function(object) {
    console.log("Update Learner in location DAO",object);
    var q = Q.defer();
    var updatedLearner = object;
    learnerModel.findByIdAndUpdate(object._id,updatedLearner,{new:true},(err,learner)=>{
        if(err) q.reject(err);
        else{
            console.log("Learner Uploaded & Updated Successfully =  ",learner);
            q.resolve(learner);
        }
    });
    return q.promise;
    
}

learner.deleteLearner = function(learnerId){
    console.log("Delete file");
    var q = Q.defer();
    
    console.log("Learner to be deleted : ",learnerId);
    learnerModel.deleteOne({_id: learnerId},(err,deleted)=>{
        if(err) q.reject(err);
        console.log("Deleted ",deleted);
        q.resolve(deleted);
    });
    return q.promise;
}

module.exports = learner;