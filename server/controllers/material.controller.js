var materialDOA = require('../dao/material.dao');
var courseDOA = require('../dao/course.dao');
var Q = require('q');

var materialController = {};

async function allMaterials(){
    var deferred = Q.defer();
    
    materialModel.find({},(err,clients)=>{
        if(err) deferred.reject(err);
        // console.log("RETRIVED DATA = ",clients);
        deferred.resolve(clients);
    });
    return deferred.promise;
}



materialController.getMaterials =  async  function(req, res, next) {
    let query = {};
    if(req.query){
        query = req.query
    }
    console.log("GET Materials query = ",query,"Params = ",req.query);
    materialDOA.getMaterialsByQuery(query)
    .then(material=>{
        console.log("Returing material - "+material.length);
        return res.send({data:{material}});
    },err=>{
        console.error(err);
        return res.status(500).send({err});
    })
}

materialController.getMaterial =  async  function(req, res, next) {
    console.log("GET client ",req.params.id);
    materialModel.findById(req.param.id,(err,material)=>{
        console.log("GET material RES = ",material);
        return res.send({data:{material}})
    })
}

materialController.addMaterial = async function(req, res, next) {
    console.log("ADD material",req.body);
    
    var newmaterial = {
        course: req.body.course,
        title: req.body.title,
        type: req.body.type
    };
    materialDOA.createMaterial(newmaterial).then(newmaterial=>{
        console.log("Material Created in controller. Calling AddMaterial for courseDOA",newmaterial);

        // Adding it to course.materials
        courseDOA.addMaterial(newmaterial.course,newmaterial._id)
        .then(updatedCourse=>{
            console.log("Course added to material and back to controller",updatedCourse);
            return res.send({data:{material: newmaterial}})
        })
        .catch(err=>{
            console.error(err);
            return res.status(500).send({err});
        })
        


        // console.log("Created material",newmaterial);
    },err=>{
        return res.status(500).send({err});
    });
}


materialController.updateMaterial = async function(req, res, next) {
    
    var updatedMaterial = {
        _id: req.body._id,
        title: req.body.title,
    };
    console.log("Update material DOA in material-Controller",req.body);
     
    materialDOA.updateMaterial(updatedMaterial).then(material=>{
        console.log("Updated material in controller",material);
        courseDOA.addMaterial(req.body.course,material._id)
        .then(updatedCourse=>{
            console.log("Material ID added to Course ",updatedCourse);
            return res.send({data:{material}});
        })
    },err=>{
        console.error(err); 
        return res.status(500).send({err})
    })
    .catch(err=>{
        console.error(err);
    })
}

materialController.deleteMaterial = function(req,res,next){
    console.log("Delete material");
    let materialId = req.query._id;
    console.log("material to be deleted : ",materialId);
    materialDOA.deleteMaterial(materialId)
    .then(deleted=>{
        console.log("Deleted ",deleted);
        return res.send({data:{}, msg:"Deleted Successfully"});
    },err=>{
        return res.status(500).send({err})
    })
}

module.exports = materialController;