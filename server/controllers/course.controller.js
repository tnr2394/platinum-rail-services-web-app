var courseModel = require('../models/course.model');

var courseController = {};

courseController.getCourses = function(req, res, next) {
    console.log("GET COURSES");
    courseModel.find({},(data,err)=>{
        console.log("RETRIVED DATA = ",data);
        return res.send({msg:'respond with a resource', data});

    });
}

courseController.addCourse = function(req, res, next) {
    console.log("ADD COURSES",req.body);

    var newCourse = new courseModel({
        title: req.body.title,
        duration: req.body.duration
    });
    newCourse.save((err,course)=>{
        console.log("Course",course);
        return res.send({course});
    })
}

courseController.updateCourse = function(req, res, next) {
    console.log("Update COURSES",req.body);

    var updatedCourse = {
        title: req.body.title,
        duration: req.body.duration
    };
    courseModel.findOneAndUpdate({_id: req.body._id},{$set: updatedCourse},{new: true},(err,course)=>{
        console.log("Updated Course",course);
        return res.send({course});
    })
}


courseController.deleteCourse = function(req,res,next){
    console.log("Delete COURSE");
    let courseId = req.query._id;
    console.log("Course to be deleted : ",courseId);
    courseModel.deleteOne({_id: courseId},(err,deleted)=>{
        console.log("Deleted ",deleted);
        res.send({courseId});
    })
}

module.exports = courseController;