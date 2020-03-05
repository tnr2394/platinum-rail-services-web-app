const async = require("async");

const fileDAO = require('../dao/file.dao');
const competenciesModel = require('../models/competencies.model');
const instructorModel = require('../models/instructor.model')

const competencies = {};

// Create new folder

competencies.addCompetencies = (obj) => {
    return new Promise((resolve, reject) => {
        console.log('Add New Competencies In DOA File');

        if (obj.file) {
            competencies.addFiles(obj.file).then((fileResponse) => {
                obj.file = fileResponse;
            }).catch((fileErr) => {
                reject(fileErr)
            })
        }

        competenciesModel.create(obj, (competencies, error) => {
            if (error) {
                reject(error)
            } else {
                resolve(obj)
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


competencies.addFiles = function (file) {
    return new Promise((resolve, reject) => {
        let filesArray = [];
        async.eachSeries(obj.file, (singleFile, innerCallback) => {
            fileDAO.addNewFile(singleFile).then((response) => {
                filesArray.push(response);
                innerCallback()
            }).catch((error) => {
                reject(error);
            })
        }, (callbackError, callbackResponse) => {
            if (callbackError) {
                reject(callbackError)
            } else {
                resolve(filesArray)
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

competencies.pullCompetenciesFromInstructor = function (instructorId, competenciesId) {
    return new Promise((resolve, reject) => {
        console.log("Adding Competencies To Instructor", { instructorId, competenciesId });
        instructorModel.findOneAndUpdate({ _id: instructorId }, {
            $pull: {
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


competencies.getCompetencies = function (instructorId) {
    return new Promise((resolve, reject) => {
        console.log("Get Competencies List", { instructorId });
        instructorModel.aggregate([
            {

            }
        ])
    })
}






module.exports = competencies;