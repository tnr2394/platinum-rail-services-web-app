var courseModel = require('../models/course.model');
var Q = require('q');

var course = {};

course.addMaterial = function(courseId,materialId){
    var q = Q.defer();
    console.log("Adding material in course DAO",{courseId,materialId});
    courseModel.findOneAndUpdate({_id:courseId},{$addToSet: {
        materials: materialId
    }},{upsert: true},(err,updatedCourse)=>{
        if(err) return q.reject(err);
        console.log("Updated Course After adding material = ",updatedCourse);
        return q.resolve(updatedCourse);
    });
    return q.promise;
}
module.exports = course;