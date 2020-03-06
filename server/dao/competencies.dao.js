const async = require("async");

const fileDAO = require('../dao/file.dao');
const competenciesModel = require('../models/competencies.model');
const instructorModel = require('../models/instructor.model');
const ObjectId = require('mongodb').ObjectId;


const competencies = {};

// Create new folder

competencies.addCompetencies = (obj) => {
    return new Promise((resolve, reject) => {
        console.log('Add New Competencies In DOA File', obj);
        competenciesModel.create(obj, (error, competencies) => {
            if (error) {
                console.log('error::::', error);
                reject(error)
            } else {
                resolve(competencies)
            }
        })
    })
}


competencies.updateCompetencies = (competenciesId, competenciesData) => {
    return new Promise((resolve, reject) => {
        competenciesModel.findByIdAndUpdate(
            { _id: competenciesId },
            { $set: competenciesData },
            { upsert: true, new: true }, (err, response) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(response)
                }
            })
    })
}

competencies.deleteCompetencies = function (competenciesId) {
    return new Promise((resolve, reject) => {
        console.log("delete Competencies", { competenciesId });
        competenciesModel.findOneAndRemove({ _id: competenciesId }, (err, response) => {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        })
    })
}

competencies.pullCompetenciesFromInstructor = function (competenciesId, instructorId) {
    return new Promise((resolve, reject) => {
        console.log("Pull Competencies From Instructor", { competenciesId });
        instructorModel.updateMany({ _id: instructorId }, {
            $pull: {
                competencies: competenciesId
            }
        }, { upsert: true, new: true }, (err, updatedIns) => {
            if (err) {
                console.log('Error while $pull', err);
                reject(err);
            } else {
                console.log("Updated Instructor After remove competencies = ", updatedIns);
                resolve(updatedIns);
            }
        });
    })
}

competencies.pushCompetenciesIntoInstructor = function (instructorId, competenciesId) {
    return new Promise((resolve, reject) => {
        console.log("Adding Competencies To Instructor", { instructorId, competenciesId });
        instructorModel.findOneAndUpdate({ _id: instructorId }, {
            $addToSet: {
                competencies: competenciesId
            }
        }, { upsert: true }, (err, updatedIns) => {
            if (err) {
                reject(err);
            } else {
                console.log("Updated Instructor After adding competencies = ", updatedIns);
                resolve(updatedIns);
            }
        });
    })
}

competencies.uploadFileToCompetencies = function (competenciesId, obj) {
    console.log('File Upload In Competencies', competenciesId, obj);
    var q = Q.defer();
    fileDAO.addNewFile(obj).then((response) => {
        console.log('File added now update Folder', response._id);
        competenciesModel.updateOne({
            _id: competenciesId
        }, {
            $addToSet: {
                files: response._id
            },
        }, {
            new: true
        }, (err, updatedComp) => {
            if (err) q.reject(err);
            else {
                q.resolve(response);
            }
        });
    }).catch((error) => {
        q.reject(error);
    });
    return q.promise;
}


competencies.getCompetencies = function (instructorId) {
    return new Promise((resolve, reject) => {
        console.log("Get Competencies List", { instructorId });
        instructorModel.aggregate([
            {
                $match: {
                    '_id': ObjectId(instructorId)
                }
            },
            {
                $unwind: {
                    path: '$competencies',
                }
            },
            {
                $lookup: {
                    from: 'competencies',
                    localField: 'competencies',
                    foreignField: '_id',
                    as: 'competencies',
                }
            },
            {
                $unwind: {
                    path: '$competencies',
                }
            },
            {
                $unwind: {
                    path: '$competencies.files',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'files',
                    localField: 'competencies.files',
                    foreignField: '_id',
                    as: 'competencies.files',
                }
            },
            {
                $project: {
                    competencies: 1,
                    competencies: {
                        competenciesId: '$competencies._id',
                        title: '$competencies.title',
                        files: '$competencies.files',
                        expiryDate: '$competencies.expiryDate',
                        isValid: {
                            $cond: { if: { $lte: ["$competencies.expiryDate", Date.now()] }, then: true, else: false }
                        },
                    }

                }
            },
            {
                $group: {
                    _id: '$_id',
                    competencies: {
                        $push: '$competencies'
                    }
                }
            }
        ]).exec((err, response) => {
            if (err) {
                console.log('Error====>>>', err);
                reject(err)
            } else {
                console.log('Response===>>', response);
                resolve(response)
            }
        })
    })
}


module.exports = competencies;