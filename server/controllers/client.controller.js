var clientModel = require('../models/client.model');
var Q = require('q');

var clientController = {};

async function allClients(){
    var deferred = Q.defer();

    clientModel.find({},(err,clients)=>{
        if(err) deferred.reject(err);
        // console.log("RETRIVED DATA = ",clients);
        deferred.resolve(clients);
    });
    return deferred.promise;
}
clientController.getClients =  async  function(req, res, next) {
    let query = {};
    if(req.query._id){
        query = req.query
    }
    console.log("GET clients query = ",query,"Params = ",req.query);
    clientModel.find(query,(err,clients)=>{
        console.log("SENDING RESPONSE Clients =  ",clients);
        return res.send({data:{clients}});
    })
}
clientController.getClient =  async  function(req, res, next) {
    console.log("GET client ",req.params.id);
    // clientModel.findById(req.param.id,(err,client)=>{
    //     console.log("GET CLIENT RES = ",client);
    //     return res.send({data:{client}})
    // })
}

clientController.addClient = function(req, res, next) {
    console.log("ADD clients",req.body);

    var newClient = new clientModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    newClient.save((err,client)=>{
        if(err) return res.status(500).send({err})
        console.log("SENDING RESPONSE Clients =  ",client)
        return res.send({data:{client}});
    
    })
}



clientController.addLocation = function(req, res, next) {
    console.log("Add Location",req.body);

    var newLocation = {
        title: req.body.location.title
    };
    console.log("Adding Location",newLocation);
    clientModel.findOneAndUpdate({_id: req.body._id},{$addToSet: {
        locations: newLocation
    }},{new: true},(err,client)=>{
        console.log("Updated client",client,err);
        if(err){
            return res.status(500).send({err})
        }

        return res.send({data:{client}});
    
    })
}




clientController.updateClient = function(req, res, next) {
    console.log("Update clients",req.body);

    var updatedClient = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    };
    clientModel.findOneAndUpdate({_id: req.body._id},{$set: updatedClient},{new: true},(err,client)=>{
        console.log("Updated client",client,err);
        if(err){
            return res.status(500).send({err})
        }

        return res.send({data:{client}});
    
    })
}

clientController.deleteClient = function(req,res,next){
    console.log("Delete client");
    let clientId = req.query._id;
    console.log("client to be deleted : ",clientId);
    clientModel.deleteOne({_id: clientId},(err,deleted)=>{
        if(err){
            return res.status(500).send({err})
        }
        console.log("Deleted ",deleted);
        return res.send({data:{}, msg:"Deleted Successfully"});
    })
}

module.exports = clientController;