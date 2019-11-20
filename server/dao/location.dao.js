var locationModel = require('../models/location.model');
var Q = require('q');

var file = {};
var location = {};
location.addLocation = function(obj){
    var q = Q.defer();
    var newLocation = new locationModel({
        title: obj.title,
        client:obj.client
    });
    newLocation.save((err,newLocation)=>{
        if(err) return q.reject(err);
        console.log("newLocation Uploaded Successfully =  ",newLocation);
        return q.resolve(newLocation);
    });   
    return q.promise;
}

location.getLocationsByQuery = function(query){
    var q = Q.defer();
    console.log("GET locations query = ",query,"Params = ",query);
    locationModel.find(query,(err,locations)=>{
        if(err) q.reject(err)
        q.resolve(locations)
        console.log("SENDING RESPONSE locations =  ",locations);
    })
    return q.promise;
}


file.getFiles =  async  function(query) {
    var q = Q.defer();
    console.log("GET files query = ",query,"Params = ",query);
    locationModel.find(query,(err,files)=>{
        if(err) q.reject(err)
        q.resolve(files)
        console.log("SENDING RESPONSE Clients =  ",files);
    })
    return q.promise;
}
file.getfile =  async  function(query) {
    console.log("GET FILE ",query);
    var q = Q.defer();
    locationModel.findById(query._id,(err,file)=>{
        console.log("GET file RES = ",file);
        if(err) q.reject(err);
        else q.resolve(file);
    })
    return q.promise;
}


file.addFile = function(object) {
    console.log("ADD File",object);
    var q = Q.defer();
    // UPLOAD FILE CODE HERE. 
    // 1. UPLOAD FILE TO S3 Bucket
    // 2. Add path to the newFile object
    // 3. Return New File object after uploading it to "files" collection
    var newFile = new locationModel({
        title: file.title,
        path: "NEW PATH",
        uploadedBy: object.uploadedBy
    });
    newFile.save((err,file)=>{
        if(err) return q.reject(err);
        
        console.log("File Uploaded Successfully =  ",file);
        return q.resolve(file);
        
    });
    return q.promise;
}




location.updateLocation = function(object) {
    console.log("Update Location in location DAO",object);
    var q = Q.defer();
    var updatedLocation = {
        title: object.title,
    };
    locationModel.findByIdAndUpdate(object._id,updatedLocation,{new:true},(err,location)=>{
        if(err) q.reject(err);
        else{
            console.log("location Uploaded & Updated Successfully =  ",location);
            q.resolve(location);
        }
    });
    return q.promise;
    
}

file.deleteFile = function(object){
    console.log("Delete file");
    var q = Q.defer();
    
    let fileId = object._id;
    console.log("file to be deleted : ",fileId);
    locationModel.deleteOne({_id: fileId},(err,deleted)=>{
        if(err) q.reject(err);
        console.log("Deleted ",deleted);
        q.resolve(deleted);
    });
    return q.promise;
}

module.exports = location;