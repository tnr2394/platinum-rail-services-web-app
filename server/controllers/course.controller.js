var courseModel = require('../models/course.model');
var Q = require('q');

const preService = require('../services/predelete.service');

var courseController = {};
const ObjectId = require('mongodb').ObjectId;


async function allCourses(query) {
    var deferred = Q.defer();
    courseModel.find(query)
        .populate([
            {
                path: "materials",
                model: 'material'
            },
            {
                path: 'materials',
                populate: [{
                    path: 'files',
                    model: 'file'
                }]
            }
        ])
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
            return res.status(400).send({ data: {}, msg: "This Cource Is Currently Active" });
        }

    }).catch((error) => {
        return res.status(500).send({ error })
    })

}


courseController.allMaterialsUsingCourseIdWithUnitGroup = function (req, res) {

    let courseId = req.query._id;


    console.log('CourseId=========?>>>>>>', courseId);


    courseModel.aggregate([
        {
            $match: {
                '_id': ObjectId(courseId)
            },
        },
        {
            $unwind: {
                path: '$materials',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'materials',
                localField: 'materials',
                foreignField: '_id',
                as: 'material',
            }
        },
        {
            $unwind: {
                path: '$material',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                assignment: {
                    assignmentTitle: '$material.title',
                    assignmentNo: '$material.assignmentNo',
                    assignmentUnit: '$material.unitNo',
                    assignmentId: '$material._id',
                    assignmentType: '$material.type',
                }
            }
        },
        {
            $group: {
                _id: '$assignment.assignmentUnit',
                assignment: {
                    $push: '$assignment'
                }
            }
        },
        {
            $project: {
                _id: 0,
                unitNo: '$_id',
                assignment: 1
            }
        },
        {
            $sort: {
                'assignment.assignmentUnit': 1
            }
        }
    ]).exec((error, material) => {
        if (error) {
            console.log('Error:', error);
            return res.status(500).send({ err })
        } else {
            return res.send({ data: { material }, msg: "material fetch Successfully" });
        }
    });
}


module.exports = courseController;