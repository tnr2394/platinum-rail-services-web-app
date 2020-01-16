const jobModel = require('../models/job.model');



const preCourseDelete = (courseId) => {
    console.log('Pre Course Delete::::::::', courseId)
    return new Promise((resolve, reject) => {
        jobModel.find({ course: courseId }, (error, job) => {
            if (error) {
                console.log('Error:', error);
                reject(error)
            } else if (job.length != 0) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}

const preInstructorDelete = (instructorId) => {
    console.log('Pre Instructor Delete::::::::', instructorId)
    return new Promise((resolve, reject) => {
        jobModel.find({ instructors: instructorId }, (error, job) => {
            if (error) {
                console.log('Error:', error);
                reject(error)
            } else if (job.length != 0) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}

const preClientDelete = (clientId) => {
    console.log('Pre Client Delete::::::::', clientId)
    return new Promise((resolve, reject) => {
        jobModel.find({ client: clientId }, (error, job) => {
            if (error) {
                console.log('Error:', error);
                reject(error)
            } else if (job.length != 0) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}

const preClientLocationDelete = (locationId) => {
    console.log('Pre Location Delete::::::::', locationId)
    return new Promise((resolve, reject) => {
        jobModel.find({ location: locationId }, (error, job) => {
            if (error) {
                console.log('Error:', error);
                reject(error)
            } else if (job.length != 0) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}

module.exports.preInstructorDelete = preInstructorDelete;
module.exports.preClientDelete = preClientDelete;
module.exports.preClientLocationDelete = preClientLocationDelete;
module.exports.preCourseDelete = preCourseDelete;