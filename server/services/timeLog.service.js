// npm modules
const path = require('path')
const mongoose = require('mongoose')
const lodash = require('lodash')

// Database model

// const jobModel = require('../models/timeLog.model');

const TimeLog = mongoose.model('timeLog')
const InstructorTimeLog = mongoose.model('instructorTimeLog')
const mailService = require('../services/mail.service')

const instructorController = require('../controllers/instructor.controller')

//
// Local variables
const ObjectId = require('mongodb').ObjectId
const successLog = console.log
const errorLog = console.error
const debugLog = console.debug


module.exports.addTimeLog = addTimeLog
module.exports.updateTimeLog = updateTimeLog
module.exports.addTimeLogInInstructor = addTimeLogInInstructor
module.exports.getInstructorWiseTimeLog = getInstructorWiseTimeLog
module.exports.sendSheetCompleteMailToInstructors = sendSheetCompleteMailToInstructors

function addTimeLog(data) {
    return new Promise((resolve, reject) => {
        let newTimeLog = new TimeLog(data)
        newTimeLog.save((error, successData) => {
            if (successData) return resolve(successData)
            else if (error) return reject(error)
            else return resolve()
        })
    })
}

function addTimeLogInInstructor(data) {
    return new Promise((resolve, reject) => {
        findInInstructorTimeLogs(data)
            .then((found) => {
                if (found) {
                    InstructorTimeLog
                        .updateOne({ _id: found._id }, { $addToSet: { 'logs': data.logId } })
                        .exec((error, update) => {
                            if (error) return reject(error)
                            else return resolve();
                        })
                }
                else {
                    let newInstructorTimeLog = new InstructorTimeLog({
                        instructorId: data.instructorId,
                        logs: [data.logId]
                    })

                    newInstructorTimeLog.save((error, successData) => {
                        if (successData) return resolve(successData)
                        else if (error) return reject(error)
                        else return resolve()
                    })
                }
            })
            .catch((error) => {
                return reject(error)
            })
    })
}

function updateTimeLog(timeLogId,logData) {
    return new Promise((resolve, reject) => {
        TimeLog.findOneAndUpdate({ _id: timeLogId }, { $set: { logData } }, (error, successData) => {
            if (successData) return resolve(successData)
            else if (error) return reject(error)
            else return resolve()
        })
    })
}

function findInInstructorTimeLogs(data) {
    return new Promise((resolve, reject) => {
        InstructorTimeLog
            .findOne({ 'instructorId': data.instructorId })
            .exec((error, data) => {
                if (data) return resolve(data)
                else if (error) return reject(error)
                else return resolve()
            })
    })
}


function getInstructorWiseTimeLog(instructorId) {

    return new Promise((resolve, reject) => {

        successLog("instructorId", instructorId)


        InstructorTimeLog
            .aggregate([
                {
                    $match: {
                        'instructorId': ObjectId(instructorId)
                    }
                },
                {
                    $project: {
                        _id: 1,
                        instructorId: 1,
                        logs: 1,
                    }
                },
                {
                    $unwind: '$logs'
                },
                {
                    $lookup: {
                        from: 'timelogs',
                        let: { logsId: '$logs' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$logsId']
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    date: 1,
                                    travel: 1,
                                    time: 1,
                                    logInTime: {
                                        $concat: ['$time.in.hours', ':', '$time.in.minutes', ':00']
                                    },
                                    lunchStartTime: {
                                        $concat: ['$time.lunchStart.hours', ':', '$time.lunchStart.minutes', ':00']
                                    },
                                    lunchEndTime: {
                                        $concat: ['$time.lunchEnd.hours', ':', '$time.lunchEnd.minutes', ':00']
                                    },
                                    logOutTime: {
                                        $concat: ['$time.out.hours', ':', '$time.out.minutes', ':00']
                                    },
                                }
                            }
                        ],
                        as: 'timeLogs'
                    }
                },
                {
                    $unwind: '$timeLogs'
                },
                {
                    $lookup: {
                        from: 'instructors',
                        localField: 'instructorId',
                        foreignField: '_id',
                        as: 'instructor'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        instructor: {
                            $first: '$instructor'
                        },
                        dateWiseTimeLogs: {
                            $push: '$timeLogs'
                        },
                    }
                }
            ]).exec((error, data) => {
                console.log(data.length)
                if (error) return reject(error)
                else return resolve(data)
            })
    })

}

function sendSheetCompleteMailToInstructors(data) {
    return new Promise((resolve, reject) => {
        console.log('Send Mail To Instructors Every Friday');
        let emailArray = [];

        instructorController.instructorEmailList().then((res) => {
            if (res.length) {
                lodash.forEach((res), (single) => {
                    emailArray.push(single.email)
                })
                const defaultPasswordEmailoptions = {
                    to: emailArray,
                    subject: `Complete Time Sheet`,
                    template: 'timeSheetComplete'
                };
                mailService.sendMail(defaultPasswordEmailoptions, null, null, function (err, mailResult) {
                    if (err) {
                        console.log('Error While Sending Mails',err);
                        reject(err);
                    } else {
                        resolve('Mail Send Successfully.....!!');
                    }
                });
            } else {
                resolve('No Instructor Found....!!');
            }
        }).catch((error) => {
            console.log('Error While Fetching Instructor',error);
            reject(error);
        })
    })
}
