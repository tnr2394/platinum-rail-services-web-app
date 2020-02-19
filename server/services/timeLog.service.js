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

module.exports.getInstructorTimeLog = getInstructorTimeLog;
module.exports.addTimeLog = addTimeLog
module.exports.updateTimeLog = updateTimeLog
module.exports.addTimeLogInInstructor = addTimeLogInInstructor
module.exports.getInstructorWiseTimeLog = getInstructorWiseTimeLog
module.exports.getWeeklyTimeLog = getWeeklyTimeLog;
module.exports.sendSheetCompleteMailToInstructors = sendSheetCompleteMailToInstructors

function addTimeLog(data) {
    return new Promise((resolve, reject) => {
        TimeLog.create(data, (error, successData) => {
            console.log('Success DATA:::', successData);
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

function updateTimeLog(timeLogId, logData) {
    return new Promise((resolve, reject) => {
        console.log('Inside Update Time Log', timeLogId, logData);
        TimeLog.updateOne({ _id: timeLogId }, { $set: logData }, { upsert: true, new: true }, (error, successData) => {
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


function getInstructorWiseTimeLog(instructorId, date) {

    return new Promise((resolve, reject) => {

        successLog("instructorId", instructorId)

        InstructorTimeLog.aggregate([
            {
                $match: { 'instructorId': ObjectId(instructorId) }
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
            }
        ]).exec((error, data) => {
            console.log(data.length)
            if (error) return reject(error)
            else return resolve(data)
        })
    })

}


function getInstructorTimeLog(instructorId, datesArray) {

    successLog("instructorId", instructorId, datesArray)

    return new Promise((resolve, reject) => {

        var query = { $and: [] }

        if (datesArray.length != 0) {
            query['$and'].push({ $in: ['$date', datesArray] })
        }

        InstructorTimeLog.aggregate([
            {
                $match: { 'instructorId': ObjectId(instructorId) }
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
                    localField: 'logs',
                    foreignField: '_id',
                    as: 'logs'
                }
            },
            {
                $unwind: {
                    path: '$logs',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: '$logs._id',
                    workingHours: '$logs.workingHours',
                    totalHours: '$logs.totalHours',
                    logIn: '$logs.logIn',
                    lunchStart: '$logs.lunchStart',
                    lunchEnd: '$logs.lunchEnd',
                    logOut: '$logs.logOut',
                    travel: '$logs.travel',
                    date: '$logs.date',
                    createdAt: '$logs.createdAt',
                    updatedAt: '$logs.updatedAt',
                }
            },
            {
                $redact: {
                    $cond: {
                        if: query,
                        then: '$$KEEP',
                        else: '$$PRUNE'
                    }
                }
            },
        ]).exec((error, data) => {
            if (error) {
                return reject(error)
            } else {
                return resolve(data)
            }
        })
    })

}

function getWeeklyTimeLog(instructorId) {
    console.log("in service", instructorId);
    return new Promise((resolve,reject)=>{
        InstructorTimeLog.aggregate([
            {
                $match: { 'instructorId': ObjectId(instructorId) }
            },
            {
                $project: {
                    _id: 1,
                    instructorId: 1,
                    logs: 1,
                }
            }
            ,
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
        ]).exec((error, data) => {
            if (error) {
                console.log("Error", error);
                return reject(error)
            } else {
                console.log("Data", data);
                return resolve(data)
            }
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
                        console.log('Error While Sending Mails', err);
                        reject(err);
                    } else {
                        resolve('Mail Send Successfully.....!!');
                    }
                });
            } else {
                resolve('No Instructor Found....!!');
            }
        }).catch((error) => {
            console.log('Error While Fetching Instructor', error);
            reject(error);
        })
    })
}
