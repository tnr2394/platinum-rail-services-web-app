const async = require("async");

const fileDAO = require('../dao/file.dao');
const competenciesModel = require('../models/competencies.model');
const instructorModel = require('../models/instructor.model')

const competencies = {};

// Create new folder

competencies.addCompetencies = (obj) => {
    return new Promise((resolve, reject) => {
        console.log('Add New Competencies In DOA File');
        competenciesModel.create(obj, (competencies, error) => {
            if (error) {
                reject(error)
            } else {
                resolve(obj)
            }
        })
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





module.exports = competencies;