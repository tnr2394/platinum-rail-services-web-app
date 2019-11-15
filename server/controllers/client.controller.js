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
    console.log("GET clients");
    allClients().then(clients=>{
        console.log("SENDING RESPONSE Clients =  ",clients)
        return res.send({data:{clients}});
    })
}
clientController.getClient =  async  function(req, res, next) {
    console.log("GET client ",req.param.id);
    allClients().then(clients=>{
        console.log("SENDING RESPONSE Clients =  ",clients)
        return res.send({data:{clients}});
    })
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