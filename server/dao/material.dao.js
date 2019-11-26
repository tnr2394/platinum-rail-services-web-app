var materialModel = require('../models/material.model');
var courseDAO = require('./course.dao');
var Q = require('q');

var material = {};
material.createMaterial = function(obj){
    var q = Q.defer();
    var newMaterial = new materialModel(obj);

    newMaterial.save((err,newMaterial)=>{
        if(err) return q.reject(err);
        console.log("newMaterial Uploaded Successfully =  ",newMaterial);
        return q.resolve(newMaterial);
    });   
    return q.promise;
}

material.getMaterialsByQuery = function(query){
    var q = Q.defer();
    console.log("GET materials query = ",query,"Params = ",query);
    
    materialModel.find(query)
    .populate('job')
    .exec((err,materials)=>{
        if(err) q.reject(err)
        q.resolve(materials)
        console.log("SENDING RESPONSE material =  ",materials);
    })
    return q.promise;
}


material.updateMaterial = function(object) {
    console.log("Update material in location DAO",object);
    var q = Q.defer();
    var updatedmaterial = object;
    materialModel.findByIdAndUpdate(object._id,updatedmaterial,{new:true},(err,material)=>{
        if(err) return q.reject(err);
        else{
            console.log("material Uploaded & Updated Successfully =  ",material,q);
            return q.resolve(material);
        }
    });
    return q.promise;
    
}

material.deleteMaterial = function(materialId){
    console.log("Delete Material in DOA");
    var q = Q.defer();
    
    console.log("material to be deleted : ",materialId);
    
    materialModel.findById(materialId,(err,material)=>{
        if(err) q.reject(err);
        if(material == null) return q.reject({msg: "No material found"});
        console.log("Material Found = ",material);
        courseDAO.deleteMaterial(material.course,material._id)
        .then(updatedCourse=>{
            console.log("Deleted from course. Now deleting from material collection",updatedCourse);
            material.remove((err,deleted)=>{
                if(err) q.reject(err);

                console.log('Deleted material from material collection');
                q.resolve({"deleted": material});
            });

            
        },err=>{
            console.error(err);
        }).catch(err=>{
            console.error(err);
        })

    })
    return q.promise;
}

material.addFile = function(materialId){
    var q = Q.defer();
    materialModel.findByIdAndUpdate(materialId,{new:true},(err,updatedMaterial)=>{
        if(err) return q.reject(err);
        else{
            console.log("material Updated with new file Successfully =  ",material,q);
            return q.resolve(updatedMaterial);
        }
    });
}









module.exports = material;