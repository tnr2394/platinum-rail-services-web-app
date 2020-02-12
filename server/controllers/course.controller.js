var courseModel = require('../models/course.model');
var Q = require('q');

const preService = require('../services/predelete.service');

var courseController = {};

async function allCourses(query) {
    var deferred = Q.defer();
    courseModel.find(query)
        .populate("materials")
        .exec((err, courses) => {
            if (err) deferred.reject(err);
            console.log("RETRIVED DATA = ", courses);
            deferred.resolve(courses);
        });
    return deferred.promise;
}

courseController.getCourses = async function (req, res, next) {
    var query = {};
    if (req.query) {
        query = req.query;
    }
    console.log("GET COURSES query = ", query);
    allCourses(query).then(courses => {
        console.log("SENDING RESPONSE COURSES = ", courses)
        return res.send({ data: { courses } });
    })
}

courseController.addCourse = function (req, res, next) {
    console.log("ADD COURSES", req.body);

    var newCourse = new courseModel({
        title: req.body.title,
        duration: req.body.duration
    });
    newCourse.save((err, course) => {
        console.log("SENDING RESPONSE COURSES = ", course)
        return res.send({ data: { course } });

    })
}



courseController.updateCourse = function (req, res, next) {
    console.log("Update COURSES", req.body);

    var updatedCourse = {};

    if (req.body.title) updatedCourse['title'] = req.body.title;
    if (req.body.duration) updatedCourse['duration'] = req.body.duration;

    courseModel.findOneAndUpdate({ _id: req.body._id }, { $set: updatedCourse }, { new: true }, (err, course) => {
        console.log("Updated Course", course, err);
        if (err) {
            return res.status(500).send({ err })
        }
        return res.send({ data: { course } });
    })
}

courseController.deleteCourse = function (req, res, next) {
    console.log("Delete COURSE");
    let courseId = req.query._id;

    preService.preCourseDelete(courseId).then((reponse) => {

        console.log('reponse::::::', reponse);
        if (reponse) {
            console.log("Course to be deleted : ", courseId);
            courseModel.remove({ _id: courseId }, (err, deleted) => {
                if (err) {
                    return res.status(500).send({ err })
                }
                console.log("Deleted ", deleted);
                return res.send({ data: {}, msg: "Deleted Successfully" });
            })

        } else {
            console.log('Couse Not deleted');
            return res.status(400).send({ data: {}, msg: "Couse Not deleted" });
        }

    }).catch((error) => {
        return res.status(500).send({ error })
    })

}

module.exports = courseController;