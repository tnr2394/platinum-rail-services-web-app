var clientModel = require('../models/client.model');
var Q = require('q');

var clientDao = {};

async function allClients(){
    var deferred = Q.defer();

    clientModel.find({},(err,clients)=>{
        if(err) deferred.reject(err);
        // console.log("RETRIVED DATA = ",clients);
        deferred.resolve(clients);
    });
    return deferred.promise;
}
clientDao.getClients =  async  function(query) {
    console.log("GET clients query = ",query,"Params = ",req.query);
    clientModel.find(query,(err,clients)=>{
        console.log("SENDING RESPONSE Clients =  ",clients);
        return res.send({data:{clients}});
    })
}
clientDao.getClient =  async  function(obj) {
    console.log("GET client ",req.params.id);
    // clientModel.findById(req.param.id,(err,client)=>{
    //     console.log("GET CLIENT RES = ",client);
    //     return res.send({data:{client}})
    // })
}

clientDao.addClient = function(obj) {
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



clientDao.addLocationToClient = function(location) {
    console.log("Reached DAO for Client to add Location =",location);
    var q = Q.defer();
    var newLocation = location;
    console.log("Adding Location in client by DAO",newLocation);
    clientModel.findOneAndUpdate({_id: location.client},{$addToSet: {
        locations: location._id
    }},{new: true},(err,client)=>{
        console.log("Updated client in doa",client,err);
        if(err) q.reject(err);
        q.resolve(client);
    })
    return q.promise;
}




clientDao.updateClient = function(obj) {
    console.log("Update clients in client DOA",req.body);

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

clientDao.deleteClient = function(obj){
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

module.exports = clientDao;