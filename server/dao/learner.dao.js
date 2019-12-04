var learnerModel = require('../models/learner.model');
var Q = require('q');

var learner = {};
learner.createLearner = function(obj){
    var q = Q.defer();
    var newLearner = new learnerModel(obj);

    newLearner.save((err,newLocation)=>{
        if(err) return q.reject(err);
        console.log("newLocation Uploaded Successfully =  ",newLocation);
        return q.resolve(newLocation);
    });   
    return q.promise;
}

learner.getLearnersByQuery = function(query){
    var q = Q.defer();
    console.log("GET learners query = ",query,"Params = ",query);
    
    learnerModel.find(query)
    .populate('job')
    .exec((err,learners)=>{
        if(err) q.reject(err)
        q.resolve(learners)
        console.log("SENDING RESPONSE learner =  ",learners);
    })
    return q.promise;
}


learner.updateLearner = function(object) {
    console.log("Update Learner in location DAO",object);
    var q = Q.defer();
    // var updatedLearner = object;
    console.log('----------object', object);
    // let idArray = []
    // let allotments = []
    // object.forEach((doc)=>{
        // idArray.push(doc._id)
        // console.log('ID', idArray)
        // allotments.push(doc.allotments)
        // console.log("ALLOTMENTS ARRAY", allotments);
        
    // })
    console.log("id array", { _id: { $in: object.learner }})
    // console.log("ALLOTMENTS", allotments);
    // learnerModel.updateMany({ _id: { $in: idArray } }, { $addToSet: { 'allotments': allotments } }, { new: true , multi:true },(err,learner)=>{
    learnerModel.updateMany({ _id: { $in: object.learners } }, { $addToSet: { 'allotments': object.materials} }, { new: true, multi: true }, (err, learner) => {
        if(err) return q.reject(err);
        else{
            console.log("Learner Uploaded & Updated Successfully =  ",learner,q);
            return q.resolve(learner);
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