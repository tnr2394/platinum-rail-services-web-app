var learnerDOA = require('../dao/learner.dao');
var clientDOA = require('../dao/client.dao');
var Q = require('q');

var learnerController = {};

async function allLearners(){
    var deferred = Q.defer();
    
    learnerModel.find({},(err,clients)=>{
        if(err) deferred.reject(err);
        // console.log("RETRIVED DATA = ",clients);
        deferred.resolve(clients);
    });
    return deferred.promise;
}



learnerController.getLearners =  async  function(req, res, next) {
    let query = {};
    if(req.query._id){
        query = req.query
    }
    console.log("GET learners query = ",query,"Params = ",req.query);
    learnerModel.find(query)
    .populate('job')
    .exec((err,learners)=>{
        console.log("SENDING RESPONSE Learners =  ",learners);
        return res.send({data:{learners}});
    })
}
learnerController.getLearner =  async  function(req, res, next) {
    console.log("GET client ",req.params.id);
    learnerModel.findById(req.param.id,(err,learner)=>{
        console.log("GET learner RES = ",learner);
        return res.send({data:{learner}})
    })
}

learnerController.addLearner = function(req, res, next) {
    console.log("ADD learner",req.body);
    
    var newLearner = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    };
    learnerDOA.createLearner(newLearner).then(newLearner=>{
        console.log("Created Learner",newLearner);
        return res.send({data:{learner}})
    },err=>{
        return res.status(500).send({err});
    });
}


learnerController.updateLearner = function(req, res, next) {
    console.log("Update Learner DOA in Learner-Controller",req.body);
    
    var updatedLearner = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    };
    learnerDOA.updateLearner(updatedLearner)
    .then(learner=>{
        console.log("Updated learner",learner,err);
        return res.send({data:{learner}});
    },err=>{
        return res.status(500).send({err})
    })
}

learnerController.deleteLearner = function(req,res,next){
    console.log("Delete learner");
    let learnerId = req.query._id;
    console.log("learner to be deleted : ",learnerId);
    learnerDOA.deleteLearner(learnerId)
    .then(deleted=>{
        console.log("Deleted ",deleted);
        return res.send({data:{}, msg:"Deleted Successfully"});
    },err=>{
        return res.status(500).send({err})
    })
}

module.exports = learnerController;