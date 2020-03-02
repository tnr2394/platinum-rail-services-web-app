// npm modules
const path = require('path')
const mongoose = require('mongoose')
const lodash = require('lodash')
const async = require("async");
const moment = require("moment");


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
module.exports.getInstructorsTimeLogDetails = getInstructorsTimeLogDetails
module.exports.secondReportLogsDetails = secondReportLogsDetails
module.exports.scriptForTimelog = scriptForTimelog

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
            {
                $sort: {
                    date: 1
                }
            }
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
    return new Promise((resolve, reject) => {
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



/**
 * Send Sheet Complete Mail To Instructor Every Friday
 * @param {Object} data 
 */
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


/**
 * Return First Logs Report Details
 * @param {String} date 
 */
function getInstructorsTimeLogDetails(date) {
    successLog("InstructorArray Inside Time Log Details", date);
    return new Promise((resolve, reject) => {
        TimeLog.aggregate([
            {
                $match: { 'date': date }
            },
            {
                $lookup: {
                    from: 'instructortimelogs',
                    localField: '_id',
                    foreignField: 'logs',
                    as: 'logsDetail',
                }
            },
            {
                $unwind: {
                    path: '$logsDetail',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'instructors',
                    localField: 'logsDetail.instructorId',
                    foreignField: '_id',
                    as: 'instructor',
                }
            },
            {
                $unwind: {
                    path: '$instructor',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'files',
                    localField: 'instructor.profilePic',
                    foreignField: '_id',
                    as: 'instructor.profilePic',
                }
            },
            {
                $unwind: {
                    path: '$instructor.profilePic',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    instructor: 1,
                    workingHours: 1,
                    totalHours: 1,
                    logIn: 1,
                    lunchStart: 1,
                    lunchEnd: 1,
                    logOut: 1,
                    travel: 1,
                    date: 1,
                }
            }
        ]).exec((error, data) => {
            if (error) {
                console.log('Errors=>', error);
                return reject(error)
            } else {
                console.log('Response=>', data);
                return resolve(data)
            }
        })
    })
}


/**
 * Return Second Logs Report Details
 * @param {String} instructorId 
 * @param {Array} datesArray 
 */
function secondReportLogsDetails(instructorId, datesArray) {

    successLog("second Report LogsDetails", instructorId, datesArray)

    return new Promise((resolve, reject) => {

        var query = { $and: [] }

        if (datesArray.length != 0) {
            query['$and'].push({ $in: ['$logs.date', datesArray] })
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
                $redact: {
                    $cond: {
                        if: query,
                        then: '$$KEEP',
                        else: '$$PRUNE'
                    }
                }
            },
            {
                $sort: {
                    'logs.date': 1
                }
            },
            {
                $group: {
                    _id: '$instructorId',
                    logs: {
                        $push: '$logs'
                    },
                    totalWorkingHours: {
                        $sum: '$logs.workingHours.hours'
                    },
                    totalWorkingMinutes: {
                        $sum: '$logs.workingHours.minutes'
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

function scriptForTimelog() {
    console.log('script to generate timelogs')
    const instructorId = '5e45310bbb516d2ee082f58d';


    const timeLogArray = [{ "logIn": "7:06", "lunchStart": "13:15", "lunchEnd": "10:24", "logOut": "17:12", "travel": "1:26", "workingHours": { "hours": 14, "minutes": 2 }, "totalHours": { "hours": 15, "minutes": 60 }, "date": "03/02/2020", "day": "Monday" },
    { "logIn": "7:41", "lunchStart": "13:37", "lunchEnd": "14:22", "logOut": "18:41", "travel": "1:54", "workingHours": { "hours": 4, "minutes": 29 }, "totalHours": { "hours": 10, "minutes": 37 }, "date": "05/16/2020", "day": "Saturday" },
    { "logIn": "7:19", "lunchStart": "13:39", "lunchEnd": "5:23", "logOut": "19:03", "travel": "1:32", "workingHours": { "hours": 21, "minutes": 43 }, "totalHours": { "hours": 23, "minutes": 34 }, "date": "02/11/2020", "day": "Tuesday" },
    { "logIn": "7:28", "lunchStart": "13:48", "lunchEnd": "11:57", "logOut": "17:52", "travel": "2:06", "workingHours": { "hours": 13, "minutes": 41 }, "totalHours": { "hours": 21, "minutes": 35 }, "date": "03/05/2020", "day": "Thursday" },
    { "logIn": "7:07", "lunchStart": "13:05", "lunchEnd": "4:08", "logOut": "18:10", "travel": "2:42", "workingHours": { "hours": 8, "minutes": 16 }, "totalHours": { "hours": 16, "minutes": 10 }, "date": "06/19/2020", "day": "Friday" },
    { "logIn": "7:38", "lunchStart": "13:22", "lunchEnd": "7:09", "logOut": "17:51", "travel": "2:54", "workingHours": { "hours": 11, "minutes": 26 }, "totalHours": { "hours": 10, "minutes": 40 }, "date": "02/23/2020", "day": "Sunday" },
    { "logIn": "7:54", "lunchStart": "13:30", "lunchEnd": "12:50", "logOut": "18:56", "travel": "2:52", "workingHours": { "hours": 21, "minutes": 39 }, "totalHours": { "hours": 10, "minutes": 8 }, "date": "07/01/2020", "day": "Wednesday" },
    { "logIn": "7:48", "lunchStart": "13:20", "lunchEnd": "6:57", "logOut": "17:22", "travel": "0:09", "workingHours": { "hours": 1, "minutes": 44 }, "totalHours": { "hours": 15, "minutes": 49 }, "date": "05/01/2020", "day": "Friday" },
    { "logIn": "7:28", "lunchStart": "13:00", "lunchEnd": "2:42", "logOut": "19:28", "travel": "0:15", "workingHours": { "hours": 13, "minutes": 54 }, "totalHours": { "hours": 0, "minutes": 6 }, "date": "04/07/2020", "day": "Tuesday" },
    { "logIn": "7:31", "lunchStart": "13:57", "lunchEnd": "5:24", "logOut": "17:54", "travel": "0:31", "workingHours": { "hours": 12, "minutes": 31 }, "totalHours": { "hours": 21, "minutes": 41 }, "date": "04/23/2020", "day": "Thursday" },
    { "logIn": "7:18", "lunchStart": "13:04", "lunchEnd": "6:25", "logOut": "19:55", "travel": "1:21", "workingHours": { "hours": 1, "minutes": 29 }, "totalHours": { "hours": 6, "minutes": 47 }, "date": "03/23/2020", "day": "Monday" },
    { "logIn": "7:19", "lunchStart": "13:00", "lunchEnd": "8:13", "logOut": "17:33", "travel": "0:27", "workingHours": { "hours": 4, "minutes": 47 }, "totalHours": { "hours": 22, "minutes": 10 }, "date": "02/11/2020", "day": "Tuesday" },
    { "logIn": "7:12", "lunchStart": "13:40", "lunchEnd": "13:36", "logOut": "19:10", "travel": "0:17", "workingHours": { "hours": 3, "minutes": 18 }, "totalHours": { "hours": 23, "minutes": 13 }, "date": "07/09/2020", "day": "Thursday" },
    { "logIn": "7:54", "lunchStart": "13:13", "lunchEnd": "8:49", "logOut": "17:09", "travel": "1:53", "workingHours": { "hours": 9, "minutes": 27 }, "totalHours": { "hours": 20, "minutes": 24 }, "date": "04/20/2020", "day": "Monday" },
    { "logIn": "7:49", "lunchStart": "13:26", "lunchEnd": "7:04", "logOut": "17:44", "travel": "1:30", "workingHours": { "hours": 0, "minutes": 1 }, "totalHours": { "hours": 15, "minutes": 3 }, "date": "04/26/2020", "day": "Sunday" },
    { "logIn": "7:08", "lunchStart": "13:47", "lunchEnd": "8:44", "logOut": "18:58", "travel": "2:39", "workingHours": { "hours": 1, "minutes": 31 }, "totalHours": { "hours": 8, "minutes": 14 }, "date": "05/15/2020", "day": "Friday" },
    { "logIn": "7:19", "lunchStart": "13:49", "lunchEnd": "2:22", "logOut": "18:01", "travel": "0:10", "workingHours": { "hours": 23, "minutes": 50 }, "totalHours": { "hours": 19, "minutes": 59 }, "date": "07/19/2020", "day": "Sunday" },
    { "logIn": "7:16", "lunchStart": "13:24", "lunchEnd": "5:00", "logOut": "19:11", "travel": "1:06", "workingHours": { "hours": 18, "minutes": 47 }, "totalHours": { "hours": 12, "minutes": 6 }, "date": "02/13/2020", "day": "Thursday" },
    { "logIn": "7:47", "lunchStart": "13:01", "lunchEnd": "5:17", "logOut": "17:02", "travel": "0:49", "workingHours": { "hours": 17, "minutes": 14 }, "totalHours": { "hours": 20, "minutes": 22 }, "date": "03/09/2020", "day": "Monday" },
    { "logIn": "7:26", "lunchStart": "13:44", "lunchEnd": "7:21", "logOut": "19:24", "travel": "1:20", "workingHours": { "hours": 21, "minutes": 22 }, "totalHours": { "hours": 3, "minutes": 34 }, "date": "04/15/2020", "day": "Wednesday" },
    { "logIn": "7:32", "lunchStart": "13:04", "lunchEnd": "12:46", "logOut": "19:44", "travel": "1:23", "workingHours": { "hours": 21, "minutes": 58 }, "totalHours": { "hours": 3, "minutes": 16 }, "date": "04/15/2020", "day": "Wednesday" },
    { "logIn": "7:27", "lunchStart": "13:57", "lunchEnd": "9:21", "logOut": "17:45", "travel": "1:27", "workingHours": { "hours": 16, "minutes": 41 }, "totalHours": { "hours": 1, "minutes": 52 }, "date": "07/27/2020", "day": "Monday" },
    { "logIn": "7:56", "lunchStart": "13:58", "lunchEnd": "9:24", "logOut": "18:48", "travel": "2:19", "workingHours": { "hours": 15, "minutes": 21 }, "totalHours": { "hours": 3, "minutes": 51 }, "date": "07/25/2020", "day": "Saturday" },
    { "logIn": "7:55", "lunchStart": "13:51", "lunchEnd": "12:11", "logOut": "18:38", "travel": "2:53", "workingHours": { "hours": 14, "minutes": 48 }, "totalHours": { "hours": 1, "minutes": 47 }, "date": "06/13/2020", "day": "Saturday" },
    { "logIn": "7:11", "lunchStart": "13:12", "lunchEnd": "5:54", "logOut": "19:52", "travel": "1:57", "workingHours": { "hours": 1, "minutes": 42 }, "totalHours": { "hours": 3, "minutes": 51 }, "date": "04/24/2020", "day": "Friday" },
    { "logIn": "7:15", "lunchStart": "13:18", "lunchEnd": "3:33", "logOut": "19:06", "travel": "0:42", "workingHours": { "hours": 17, "minutes": 2 }, "totalHours": { "hours": 12, "minutes": 38 }, "date": "07/13/2020", "day": "Monday" },
    { "logIn": "7:09", "lunchStart": "13:00", "lunchEnd": "7:53", "logOut": "18:30", "travel": "0:14", "workingHours": { "hours": 22, "minutes": 53 }, "totalHours": { "hours": 2, "minutes": 46 }, "date": "05/30/2020", "day": "Saturday" },
    { "logIn": "7:33", "lunchStart": "13:25", "lunchEnd": "2:01", "logOut": "18:00", "travel": "1:56", "workingHours": { "hours": 19, "minutes": 25 }, "totalHours": { "hours": 13, "minutes": 20 }, "date": "03/24/2020", "day": "Tuesday" },
    { "logIn": "7:44", "lunchStart": "13:47", "lunchEnd": "6:19", "logOut": "19:14", "travel": "0:50", "workingHours": { "hours": 23, "minutes": 24 }, "totalHours": { "hours": 6, "minutes": 60 }, "date": "03/05/2020", "day": "Thursday" },
    { "logIn": "7:11", "lunchStart": "13:01", "lunchEnd": "8:29", "logOut": "17:40", "travel": "2:43", "workingHours": { "hours": 2, "minutes": 38 }, "totalHours": { "hours": 10, "minutes": 46 }, "date": "07/16/2020", "day": "Thursday" },
    { "logIn": "7:06", "lunchStart": "13:03", "lunchEnd": "3:44", "logOut": "18:22", "travel": "2:45", "workingHours": { "hours": 7, "minutes": 43 }, "totalHours": { "hours": 23, "minutes": 6 }, "date": "03/23/2020", "day": "Monday" },
    { "logIn": "7:37", "lunchStart": "13:23", "lunchEnd": "13:34", "logOut": "17:33", "travel": "1:53", "workingHours": { "hours": 5, "minutes": 14 }, "totalHours": { "hours": 11, "minutes": 47 }, "date": "07/13/2020", "day": "Monday" },
    { "logIn": "7:11", "lunchStart": "13:52", "lunchEnd": "10:57", "logOut": "17:40", "travel": "1:06", "workingHours": { "hours": 20, "minutes": 17 }, "totalHours": { "hours": 11, "minutes": 25 }, "date": "03/13/2020", "day": "Friday" },
    { "logIn": "7:39", "lunchStart": "13:25", "lunchEnd": "11:50", "logOut": "17:49", "travel": "1:34", "workingHours": { "hours": 16, "minutes": 16 }, "totalHours": { "hours": 4, "minutes": 35 }, "date": "06/23/2020", "day": "Tuesday" },
    { "logIn": "7:12", "lunchStart": "13:27", "lunchEnd": "14:46", "logOut": "19:15", "travel": "1:27", "workingHours": { "hours": 18, "minutes": 11 }, "totalHours": { "hours": 6, "minutes": 30 }, "date": "04/29/2020", "day": "Wednesday" },
    { "logIn": "7:21", "lunchStart": "13:46", "lunchEnd": "9:52", "logOut": "17:40", "travel": "2:11", "workingHours": { "hours": 17, "minutes": 32 }, "totalHours": { "hours": 0, "minutes": 47 }, "date": "06/04/2020", "day": "Thursday" },
    { "logIn": "7:25", "lunchStart": "13:33", "lunchEnd": "13:48", "logOut": "19:37", "travel": "1:05", "workingHours": { "hours": 13, "minutes": 31 }, "totalHours": { "hours": 7, "minutes": 33 }, "date": "05/29/2020", "day": "Friday" },
    { "logIn": "7:35", "lunchStart": "13:07", "lunchEnd": "8:23", "logOut": "18:32", "travel": "0:41", "workingHours": { "hours": 20, "minutes": 56 }, "totalHours": { "hours": 23, "minutes": 11 }, "date": "04/25/2020", "day": "Saturday" },
    { "logIn": "7:00", "lunchStart": "13:34", "lunchEnd": "9:43", "logOut": "17:02", "travel": "0:02", "workingHours": { "hours": 10, "minutes": 52 }, "totalHours": { "hours": 6, "minutes": 13 }, "date": "07/12/2020", "day": "Sunday" },
    { "logIn": "7:58", "lunchStart": "13:37", "lunchEnd": "2:54", "logOut": "19:35", "travel": "1:54", "workingHours": { "hours": 13, "minutes": 14 }, "totalHours": { "hours": 22, "minutes": 53 }, "date": "07/19/2020", "day": "Sunday" },
    { "logIn": "7:00", "lunchStart": "13:08", "lunchEnd": "4:35", "logOut": "19:16", "travel": "1:11", "workingHours": { "hours": 11, "minutes": 43 }, "totalHours": { "hours": 12, "minutes": 29 }, "date": "02/23/2020", "day": "Sunday" },
    { "logIn": "7:58", "lunchStart": "13:23", "lunchEnd": "14:20", "logOut": "19:55", "travel": "0:25", "workingHours": { "hours": 21, "minutes": 12 }, "totalHours": { "hours": 5, "minutes": 9 }, "date": "04/08/2020", "day": "Wednesday" },
    { "logIn": "7:32", "lunchStart": "13:00", "lunchEnd": "7:21", "logOut": "18:56", "travel": "0:35", "workingHours": { "hours": 13, "minutes": 36 }, "totalHours": { "hours": 7, "minutes": 23 }, "date": "07/16/2020", "day": "Thursday" },
    { "logIn": "7:43", "lunchStart": "13:12", "lunchEnd": "12:33", "logOut": "18:55", "travel": "2:42", "workingHours": { "hours": 7, "minutes": 3 }, "totalHours": { "hours": 22, "minutes": 4 }, "date": "03/15/2020", "day": "Sunday" },
    { "logIn": "7:17", "lunchStart": "13:02", "lunchEnd": "3:11", "logOut": "18:00", "travel": "1:27", "workingHours": { "hours": 18, "minutes": 23 }, "totalHours": { "hours": 20, "minutes": 51 }, "date": "04/20/2020", "day": "Monday" },
    { "logIn": "7:57", "lunchStart": "13:15", "lunchEnd": "12:45", "logOut": "19:29", "travel": "0:49", "workingHours": { "hours": 17, "minutes": 25 }, "totalHours": { "hours": 8, "minutes": 26 }, "date": "06/12/2020", "day": "Friday" },
    { "logIn": "7:17", "lunchStart": "13:00", "lunchEnd": "3:26", "logOut": "19:01", "travel": "0:31", "workingHours": { "hours": 5, "minutes": 39 }, "totalHours": { "hours": 23, "minutes": 42 }, "date": "05/28/2020", "day": "Thursday" },
    { "logIn": "7:50", "lunchStart": "13:27", "lunchEnd": "4:21", "logOut": "17:24", "travel": "1:17", "workingHours": { "hours": 23, "minutes": 27 }, "totalHours": { "hours": 22, "minutes": 58 }, "date": "07/19/2020", "day": "Sunday" },
    { "logIn": "7:31", "lunchStart": "13:47", "lunchEnd": "10:16", "logOut": "17:33", "travel": "1:56", "workingHours": { "hours": 3, "minutes": 20 }, "totalHours": { "hours": 10, "minutes": 21 }, "date": "06/11/2020", "day": "Thursday" },
    { "logIn": "7:15", "lunchStart": "13:48", "lunchEnd": "5:36", "logOut": "17:42", "travel": "0:33", "workingHours": { "hours": 10, "minutes": 41 }, "totalHours": { "hours": 16, "minutes": 37 }, "date": "07/21/2020", "day": "Tuesday" },
    { "logIn": "7:24", "lunchStart": "13:46", "lunchEnd": "3:01", "logOut": "17:50", "travel": "1:54", "workingHours": { "hours": 11, "minutes": 27 }, "totalHours": { "hours": 8, "minutes": 18 }, "date": "04/08/2020", "day": "Wednesday" },
    { "logIn": "7:04", "lunchStart": "13:37", "lunchEnd": "14:00", "logOut": "19:47", "travel": "0:36", "workingHours": { "hours": 16, "minutes": 19 }, "totalHours": { "hours": 17, "minutes": 46 }, "date": "06/18/2020", "day": "Thursday" },
    { "logIn": "7:27", "lunchStart": "13:45", "lunchEnd": "8:25", "logOut": "18:17", "travel": "0:36", "workingHours": { "hours": 2, "minutes": 60 }, "totalHours": { "hours": 19, "minutes": 20 }, "date": "03/14/2020", "day": "Saturday" },
    { "logIn": "7:58", "lunchStart": "13:52", "lunchEnd": "3:03", "logOut": "19:51", "travel": "1:40", "workingHours": { "hours": 22, "minutes": 7 }, "totalHours": { "hours": 20, "minutes": 60 }, "date": "07/25/2020", "day": "Saturday" },
    { "logIn": "7:51", "lunchStart": "13:07", "lunchEnd": "10:16", "logOut": "18:48", "travel": "0:07", "workingHours": { "hours": 20, "minutes": 60 }, "totalHours": { "hours": 15, "minutes": 40 }, "date": "03/30/2020", "day": "Monday" },
    { "logIn": "7:01", "lunchStart": "13:01", "lunchEnd": "12:36", "logOut": "19:17", "travel": "2:15", "workingHours": { "hours": 11, "minutes": 20 }, "totalHours": { "hours": 13, "minutes": 30 }, "date": "04/08/2020", "day": "Wednesday" },
    { "logIn": "7:27", "lunchStart": "13:54", "lunchEnd": "6:30", "logOut": "19:41", "travel": "0:19", "workingHours": { "hours": 10, "minutes": 32 }, "totalHours": { "hours": 13, "minutes": 35 }, "date": "03/16/2020", "day": "Monday" },
    { "logIn": "7:06", "lunchStart": "13:28", "lunchEnd": "5:18", "logOut": "19:38", "travel": "1:09", "workingHours": { "hours": 17, "minutes": 34 }, "totalHours": { "hours": 11, "minutes": 18 }, "date": "07/16/2020", "day": "Thursday" },
    { "logIn": "7:05", "lunchStart": "13:40", "lunchEnd": "13:03", "logOut": "18:55", "travel": "1:06", "workingHours": { "hours": 10, "minutes": 34 }, "totalHours": { "hours": 1, "minutes": 24 }, "date": "04/20/2020", "day": "Monday" },
    { "logIn": "7:48", "lunchStart": "13:00", "lunchEnd": "10:24", "logOut": "17:43", "travel": "1:46", "workingHours": { "hours": 20, "minutes": 15 }, "totalHours": { "hours": 1, "minutes": 31 }, "date": "02/03/2020", "day": "Monday" },
    { "logIn": "7:56", "lunchStart": "13:45", "lunchEnd": "2:00", "logOut": "19:55", "travel": "1:08", "workingHours": { "hours": 18, "minutes": 9 }, "totalHours": { "hours": 12, "minutes": 15 }, "date": "03/01/2020", "day": "Sunday" },
    { "logIn": "7:40", "lunchStart": "13:57", "lunchEnd": "3:58", "logOut": "18:06", "travel": "1:21", "workingHours": { "hours": 5, "minutes": 38 }, "totalHours": { "hours": 4, "minutes": 35 }, "date": "02/19/2020", "day": "Wednesday" },
    { "logIn": "7:02", "lunchStart": "13:00", "lunchEnd": "12:09", "logOut": "18:04", "travel": "2:37", "workingHours": { "hours": 13, "minutes": 57 }, "totalHours": { "hours": 4, "minutes": 11 }, "date": "06/18/2020", "day": "Thursday" },
    { "logIn": "7:50", "lunchStart": "13:07", "lunchEnd": "14:07", "logOut": "18:02", "travel": "2:18", "workingHours": { "hours": 11, "minutes": 24 }, "totalHours": { "hours": 5, "minutes": 58 }, "date": "07/28/2020", "day": "Tuesday" },
    { "logIn": "7:15", "lunchStart": "13:38", "lunchEnd": "14:49", "logOut": "19:23", "travel": "1:23", "workingHours": { "hours": 15, "minutes": 15 }, "totalHours": { "hours": 5, "minutes": 45 }, "date": "06/16/2020", "day": "Tuesday" },
    { "logIn": "7:34", "lunchStart": "13:25", "lunchEnd": "3:34", "logOut": "19:54", "travel": "1:12", "workingHours": { "hours": 10, "minutes": 41 }, "totalHours": { "hours": 7, "minutes": 58 }, "date": "04/19/2020", "day": "Sunday" },
    { "logIn": "7:05", "lunchStart": "13:45", "lunchEnd": "11:12", "logOut": "17:02", "travel": "0:27", "workingHours": { "hours": 7, "minutes": 6 }, "totalHours": { "hours": 1, "minutes": 60 }, "date": "05/24/2020", "day": "Sunday" },
    { "logIn": "7:49", "lunchStart": "13:19", "lunchEnd": "9:20", "logOut": "18:29", "travel": "1:36", "workingHours": { "hours": 14, "minutes": 30 }, "totalHours": { "hours": 13, "minutes": 55 }, "date": "02/10/2020", "day": "Monday" },
    { "logIn": "7:22", "lunchStart": "13:46", "lunchEnd": "11:07", "logOut": "18:24", "travel": "2:20", "workingHours": { "hours": 2, "minutes": 45 }, "totalHours": { "hours": 6, "minutes": 38 }, "date": "07/09/2020", "day": "Thursday" },
    { "logIn": "7:16", "lunchStart": "13:41", "lunchEnd": "14:32", "logOut": "17:06", "travel": "1:28", "workingHours": { "hours": 22, "minutes": 5 }, "totalHours": { "hours": 18, "minutes": 48 }, "date": "03/08/2020", "day": "Sunday" },
    { "logIn": "7:23", "lunchStart": "13:24", "lunchEnd": "6:31", "logOut": "19:37", "travel": "1:39", "workingHours": { "hours": 6, "minutes": 46 }, "totalHours": { "hours": 1, "minutes": 0 }, "date": "05/13/2020", "day": "Wednesday" },
    { "logIn": "7:54", "lunchStart": "13:56", "lunchEnd": "6:55", "logOut": "19:42", "travel": "0:20", "workingHours": { "hours": 13, "minutes": 19 }, "totalHours": { "hours": 6, "minutes": 33 }, "date": "04/01/2020", "day": "Wednesday" },
    { "logIn": "7:46", "lunchStart": "13:23", "lunchEnd": "12:44", "logOut": "18:29", "travel": "0:05", "workingHours": { "hours": 8, "minutes": 11 }, "totalHours": { "hours": 1, "minutes": 48 }, "date": "05/12/2020", "day": "Tuesday" },
    { "logIn": "7:36", "lunchStart": "13:56", "lunchEnd": "4:27", "logOut": "19:30", "travel": "0:25", "workingHours": { "hours": 1, "minutes": 20 }, "totalHours": { "hours": 1, "minutes": 38 }, "date": "03/10/2020", "day": "Tuesday" },
    { "logIn": "7:31", "lunchStart": "13:22", "lunchEnd": "5:26", "logOut": "18:55", "travel": "2:49", "workingHours": { "hours": 11, "minutes": 56 }, "totalHours": { "hours": 11, "minutes": 26 }, "date": "07/26/2020", "day": "Sunday" },
    { "logIn": "7:21", "lunchStart": "13:13", "lunchEnd": "14:51", "logOut": "18:17", "travel": "2:54", "workingHours": { "hours": 21, "minutes": 25 }, "totalHours": { "hours": 23, "minutes": 27 }, "date": "05/30/2020", "day": "Saturday" },
    { "logIn": "7:47", "lunchStart": "13:29", "lunchEnd": "8:52", "logOut": "18:43", "travel": "0:47", "workingHours": { "hours": 8, "minutes": 31 }, "totalHours": { "hours": 22, "minutes": 15 }, "date": "07/16/2020", "day": "Thursday" },
    { "logIn": "7:52", "lunchStart": "13:51", "lunchEnd": "3:20", "logOut": "17:38", "travel": "0:18", "workingHours": { "hours": 15, "minutes": 23 }, "totalHours": { "hours": 13, "minutes": 40 }, "date": "02/08/2020", "day": "Saturday" },
    { "logIn": "7:52", "lunchStart": "13:43", "lunchEnd": "10:32", "logOut": "18:10", "travel": "0:50", "workingHours": { "hours": 12, "minutes": 38 }, "totalHours": { "hours": 4, "minutes": 27 }, "date": "02/15/2020", "day": "Saturday" },
    { "logIn": "7:35", "lunchStart": "13:40", "lunchEnd": "11:22", "logOut": "17:01", "travel": "0:53", "workingHours": { "hours": 22, "minutes": 16 }, "totalHours": { "hours": 16, "minutes": 17 }, "date": "02/26/2020", "day": "Wednesday" },
    { "logIn": "7:09", "lunchStart": "13:45", "lunchEnd": "8:57", "logOut": "17:40", "travel": "2:47", "workingHours": { "hours": 2, "minutes": 30 }, "totalHours": { "hours": 10, "minutes": 37 }, "date": "03/20/2020", "day": "Friday" },
    { "logIn": "7:44", "lunchStart": "13:35", "lunchEnd": "5:47", "logOut": "18:47", "travel": "1:07", "workingHours": { "hours": 14, "minutes": 56 }, "totalHours": { "hours": 10, "minutes": 23 }, "date": "05/12/2020", "day": "Tuesday" },
    { "logIn": "7:25", "lunchStart": "13:39", "lunchEnd": "3:00", "logOut": "18:45", "travel": "0:13", "workingHours": { "hours": 23, "minutes": 38 }, "totalHours": { "hours": 18, "minutes": 13 }, "date": "02/14/2020", "day": "Friday" },
    { "logIn": "7:00", "lunchStart": "13:04", "lunchEnd": "6:44", "logOut": "17:54", "travel": "1:41", "workingHours": { "hours": 23, "minutes": 5 }, "totalHours": { "hours": 16, "minutes": 54 }, "date": "06/09/2020", "day": "Tuesday" },
    { "logIn": "7:06", "lunchStart": "13:12", "lunchEnd": "8:41", "logOut": "17:06", "travel": "1:25", "workingHours": { "hours": 18, "minutes": 37 }, "totalHours": { "hours": 0, "minutes": 17 }, "date": "07/20/2020", "day": "Monday" },
    { "logIn": "7:33", "lunchStart": "13:55", "lunchEnd": "12:15", "logOut": "19:02", "travel": "0:03", "workingHours": { "hours": 18, "minutes": 47 }, "totalHours": { "hours": 10, "minutes": 18 }, "date": "06/18/2020", "day": "Thursday" },
    { "logIn": "7:11", "lunchStart": "13:39", "lunchEnd": "2:55", "logOut": "17:06", "travel": "1:36", "workingHours": { "hours": 6, "minutes": 6 }, "totalHours": { "hours": 20, "minutes": 50 }, "date": "06/17/2020", "day": "Wednesday" },
    { "logIn": "7:40", "lunchStart": "13:02", "lunchEnd": "6:21", "logOut": "18:59", "travel": "0:34", "workingHours": { "hours": 4, "minutes": 55 }, "totalHours": { "hours": 2, "minutes": 60 }, "date": "04/24/2020", "day": "Friday" },
    { "logIn": "7:04", "lunchStart": "13:46", "lunchEnd": "2:44", "logOut": "17:48", "travel": "2:11", "workingHours": { "hours": 20, "minutes": 60 }, "totalHours": { "hours": 20, "minutes": 19 }, "date": "07/11/2020", "day": "Saturday" },
    { "logIn": "7:39", "lunchStart": "13:27", "lunchEnd": "2:21", "logOut": "18:50", "travel": "1:48", "workingHours": { "hours": 13, "minutes": 9 }, "totalHours": { "hours": 1, "minutes": 46 }, "date": "03/21/2020", "day": "Saturday" },
    { "logIn": "7:09", "lunchStart": "13:03", "lunchEnd": "9:47", "logOut": "17:38", "travel": "0:36", "workingHours": { "hours": 8, "minutes": 15 }, "totalHours": { "hours": 7, "minutes": 37 }, "date": "02/24/2020", "day": "Monday" },
    { "logIn": "7:13", "lunchStart": "13:16", "lunchEnd": "14:19", "logOut": "17:59", "travel": "1:33", "workingHours": { "hours": 1, "minutes": 12 }, "totalHours": { "hours": 16, "minutes": 9 }, "date": "04/27/2020", "day": "Monday" },
    { "logIn": "7:28", "lunchStart": "13:42", "lunchEnd": "13:26", "logOut": "19:42", "travel": "0:01", "workingHours": { "hours": 16, "minutes": 12 }, "totalHours": { "hours": 12, "minutes": 48 }, "date": "07/23/2020", "day": "Thursday" },
    { "logIn": "7:48", "lunchStart": "13:44", "lunchEnd": "13:31", "logOut": "17:17", "travel": "1:00", "workingHours": { "hours": 15, "minutes": 17 }, "totalHours": { "hours": 18, "minutes": 42 }, "date": "07/28/2020", "day": "Tuesday" },
    { "logIn": "7:11", "lunchStart": "13:27", "lunchEnd": "8:03", "logOut": "17:41", "travel": "2:03", "workingHours": { "hours": 11, "minutes": 38 }, "totalHours": { "hours": 1, "minutes": 33 }, "date": "02/25/2020", "day": "Tuesday" },
    { "logIn": "7:09", "lunchStart": "13:08", "lunchEnd": "6:42", "logOut": "19:38", "travel": "0:13", "workingHours": { "hours": 10, "minutes": 19 }, "totalHours": { "hours": 13, "minutes": 48 }, "date": "06/12/2020", "day": "Friday" },
    { "logIn": "7:27", "lunchStart": "13:20", "lunchEnd": "9:36", "logOut": "17:09", "travel": "2:03", "workingHours": { "hours": 8, "minutes": 37 }, "totalHours": { "hours": 20, "minutes": 7 }, "date": "06/05/2020", "day": "Friday" },
    { "logIn": "7:17", "lunchStart": "13:31", "lunchEnd": "14:26", "logOut": "18:50", "travel": "1:19", "workingHours": { "hours": 5, "minutes": 40 }, "totalHours": { "hours": 11, "minutes": 57 }, "date": "02/13/2020", "day": "Thursday" },
    { "logIn": "7:27", "lunchStart": "13:47", "lunchEnd": "2:03", "logOut": "17:37", "travel": "0:04", "workingHours": { "hours": 19, "minutes": 41 }, "totalHours": { "hours": 2, "minutes": 59 }, "date": "04/04/2020", "day": "Saturday" },
    { "logIn": "7:39", "lunchStart": "13:11", "lunchEnd": "7:30", "logOut": "17:56", "travel": "1:06", "workingHours": { "hours": 22, "minutes": 14 }, "totalHours": { "hours": 10, "minutes": 20 }, "date": "07/05/2020", "day": "Sunday" },
    { "logIn": "7:43", "lunchStart": "13:37", "lunchEnd": "7:21", "logOut": "19:54", "travel": "0:59", "workingHours": { "hours": 13, "minutes": 31 }, "totalHours": { "hours": 20, "minutes": 1 }, "date": "03/29/2020", "day": "Sunday" },
    { "logIn": "7:40", "lunchStart": "13:13", "lunchEnd": "6:22", "logOut": "18:58", "travel": "2:08", "workingHours": { "hours": 19, "minutes": 8 }, "totalHours": { "hours": 21, "minutes": 0 }, "date": "02/05/2020", "day": "Wednesday" },
    { "logIn": "7:31", "lunchStart": "13:42", "lunchEnd": "9:21", "logOut": "18:07", "travel": "0:14", "workingHours": { "hours": 4, "minutes": 6 }, "totalHours": { "hours": 14, "minutes": 12 }, "date": "02/03/2020", "day": "Monday" },
    { "logIn": "7:38", "lunchStart": "13:30", "lunchEnd": "3:26", "logOut": "18:40", "travel": "1:33", "workingHours": { "hours": 7, "minutes": 30 }, "totalHours": { "hours": 17, "minutes": 36 }, "date": "07/06/2020", "day": "Monday" },
    { "logIn": "7:12", "lunchStart": "13:25", "lunchEnd": "2:02", "logOut": "19:19", "travel": "0:21", "workingHours": { "hours": 1, "minutes": 23 }, "totalHours": { "hours": 17, "minutes": 21 }, "date": "04/18/2020", "day": "Saturday" },
    { "logIn": "7:05", "lunchStart": "13:40", "lunchEnd": "5:57", "logOut": "17:27", "travel": "1:10", "workingHours": { "hours": 19, "minutes": 36 }, "totalHours": { "hours": 18, "minutes": 13 }, "date": "02/27/2020", "day": "Thursday" },
    { "logIn": "7:58", "lunchStart": "13:00", "lunchEnd": "13:42", "logOut": "19:53", "travel": "2:45", "workingHours": { "hours": 9, "minutes": 13 }, "totalHours": { "hours": 19, "minutes": 17 }, "date": "02/12/2020", "day": "Wednesday" },
    { "logIn": "7:19", "lunchStart": "13:30", "lunchEnd": "6:39", "logOut": "18:50", "travel": "0:52", "workingHours": { "hours": 11, "minutes": 4 }, "totalHours": { "hours": 16, "minutes": 26 }, "date": "04/06/2020", "day": "Monday" },
    { "logIn": "7:22", "lunchStart": "13:07", "lunchEnd": "5:34", "logOut": "17:02", "travel": "2:15", "workingHours": { "hours": 6, "minutes": 10 }, "totalHours": { "hours": 14, "minutes": 45 }, "date": "06/16/2020", "day": "Tuesday" },
    { "logIn": "7:50", "lunchStart": "13:14", "lunchEnd": "10:15", "logOut": "17:08", "travel": "0:50", "workingHours": { "hours": 1, "minutes": 58 }, "totalHours": { "hours": 5, "minutes": 56 }, "date": "02/09/2020", "day": "Sunday" },
    { "logIn": "7:24", "lunchStart": "13:16", "lunchEnd": "3:07", "logOut": "17:25", "travel": "1:32", "workingHours": { "hours": 11, "minutes": 24 }, "totalHours": { "hours": 6, "minutes": 10 }, "date": "05/02/2020", "day": "Saturday" },
    { "logIn": "7:28", "lunchStart": "13:06", "lunchEnd": "13:48", "logOut": "17:37", "travel": "0:03", "workingHours": { "hours": 2, "minutes": 1 }, "totalHours": { "hours": 2, "minutes": 30 }, "date": "07/05/2020", "day": "Sunday" },
    { "logIn": "7:55", "lunchStart": "13:34", "lunchEnd": "2:26", "logOut": "17:27", "travel": "2:28", "workingHours": { "hours": 11, "minutes": 16 }, "totalHours": { "hours": 6, "minutes": 30 }, "date": "06/09/2020", "day": "Tuesday" },
    { "logIn": "7:16", "lunchStart": "13:44", "lunchEnd": "3:35", "logOut": "18:39", "travel": "2:07", "workingHours": { "hours": 2, "minutes": 23 }, "totalHours": { "hours": 18, "minutes": 47 }, "date": "04/09/2020", "day": "Thursday" },
    { "logIn": "7:56", "lunchStart": "13:03", "lunchEnd": "4:00", "logOut": "18:39", "travel": "2:03", "workingHours": { "hours": 14, "minutes": 32 }, "totalHours": { "hours": 3, "minutes": 53 }, "date": "07/29/2020", "day": "Wednesday" },
    { "logIn": "7:35", "lunchStart": "13:53", "lunchEnd": "4:05", "logOut": "19:38", "travel": "2:32", "workingHours": { "hours": 0, "minutes": 60 }, "totalHours": { "hours": 23, "minutes": 33 }, "date": "06/03/2020", "day": "Wednesday" },
    { "logIn": "7:49", "lunchStart": "13:14", "lunchEnd": "2:00", "logOut": "19:05", "travel": "0:23", "workingHours": { "hours": 18, "minutes": 21 }, "totalHours": { "hours": 11, "minutes": 1 }, "date": "02/16/2020", "day": "Sunday" },
    { "logIn": "7:03", "lunchStart": "13:20", "lunchEnd": "14:45", "logOut": "18:56", "travel": "0:29", "workingHours": { "hours": 2, "minutes": 47 }, "totalHours": { "hours": 16, "minutes": 5 }, "date": "02/14/2020", "day": "Friday" },
    { "logIn": "7:49", "lunchStart": "13:58", "lunchEnd": "11:10", "logOut": "17:08", "travel": "1:48", "workingHours": { "hours": 2, "minutes": 3 }, "totalHours": { "hours": 14, "minutes": 12 }, "date": "03/31/2020", "day": "Tuesday" },
    { "logIn": "7:35", "lunchStart": "13:51", "lunchEnd": "2:24", "logOut": "19:48", "travel": "1:21", "workingHours": { "hours": 0, "minutes": 15 }, "totalHours": { "hours": 14, "minutes": 59 }, "date": "06/18/2020", "day": "Thursday" },
    { "logIn": "7:43", "lunchStart": "13:46", "lunchEnd": "9:21", "logOut": "19:31", "travel": "2:09", "workingHours": { "hours": 22, "minutes": 3 }, "totalHours": { "hours": 4, "minutes": 56 }, "date": "03/28/2020", "day": "Saturday" },
    { "logIn": "7:07", "lunchStart": "13:56", "lunchEnd": "7:10", "logOut": "18:39", "travel": "0:48", "workingHours": { "hours": 3, "minutes": 31 }, "totalHours": { "hours": 5, "minutes": 37 }, "date": "07/15/2020", "day": "Wednesday" },
    { "logIn": "7:11", "lunchStart": "13:58", "lunchEnd": "5:38", "logOut": "19:49", "travel": "2:37", "workingHours": { "hours": 5, "minutes": 53 }, "totalHours": { "hours": 20, "minutes": 8 }, "date": "05/15/2020", "day": "Friday" },
    { "logIn": "7:27", "lunchStart": "13:34", "lunchEnd": "6:29", "logOut": "18:59", "travel": "1:16", "workingHours": { "hours": 21, "minutes": 4 }, "totalHours": { "hours": 13, "minutes": 11 }, "date": "05/05/2020", "day": "Tuesday" },
    { "logIn": "7:37", "lunchStart": "13:03", "lunchEnd": "4:57", "logOut": "18:15", "travel": "2:07", "workingHours": { "hours": 1, "minutes": 10 }, "totalHours": { "hours": 10, "minutes": 31 }, "date": "05/10/2020", "day": "Sunday" },
    { "logIn": "7:37", "lunchStart": "13:15", "lunchEnd": "2:12", "logOut": "18:26", "travel": "1:27", "workingHours": { "hours": 10, "minutes": 55 }, "totalHours": { "hours": 13, "minutes": 15 }, "date": "04/01/2020", "day": "Wednesday" },
    { "logIn": "7:23", "lunchStart": "13:44", "lunchEnd": "7:29", "logOut": "19:58", "travel": "0:04", "workingHours": { "hours": 3, "minutes": 58 }, "totalHours": { "hours": 23, "minutes": 25 }, "date": "03/06/2020", "day": "Friday" },
    { "logIn": "7:02", "lunchStart": "13:42", "lunchEnd": "11:03", "logOut": "19:24", "travel": "0:49", "workingHours": { "hours": 0, "minutes": 23 }, "totalHours": { "hours": 15, "minutes": 21 }, "date": "04/23/2020", "day": "Thursday" },
    { "logIn": "7:55", "lunchStart": "13:11", "lunchEnd": "2:17", "logOut": "18:08", "travel": "2:34", "workingHours": { "hours": 12, "minutes": 2 }, "totalHours": { "hours": 4, "minutes": 49 }, "date": "05/29/2020", "day": "Friday" },
    { "logIn": "7:16", "lunchStart": "13:40", "lunchEnd": "9:28", "logOut": "17:14", "travel": "0:01", "workingHours": { "hours": 7, "minutes": 11 }, "totalHours": { "hours": 20, "minutes": 4 }, "date": "03/08/2020", "day": "Sunday" },
    { "logIn": "7:16", "lunchStart": "13:14", "lunchEnd": "14:25", "logOut": "19:23", "travel": "0:56", "workingHours": { "hours": 6, "minutes": 28 }, "totalHours": { "hours": 11, "minutes": 19 }, "date": "07/16/2020", "day": "Thursday" },
    { "logIn": "7:07", "lunchStart": "13:05", "lunchEnd": "13:10", "logOut": "17:52", "travel": "1:51", "workingHours": { "hours": 3, "minutes": 26 }, "totalHours": { "hours": 19, "minutes": 13 }, "date": "04/26/2020", "day": "Sunday" },
    { "logIn": "7:19", "lunchStart": "13:36", "lunchEnd": "12:03", "logOut": "19:58", "travel": "1:03", "workingHours": { "hours": 8, "minutes": 26 }, "totalHours": { "hours": 4, "minutes": 30 }, "date": "05/11/2020", "day": "Monday" },
    { "logIn": "7:27", "lunchStart": "13:50", "lunchEnd": "9:10", "logOut": "19:03", "travel": "1:28", "workingHours": { "hours": 11, "minutes": 6 }, "totalHours": { "hours": 10, "minutes": 13 }, "date": "06/07/2020", "day": "Sunday" },
    { "logIn": "7:37", "lunchStart": "13:52", "lunchEnd": "3:18", "logOut": "17:37", "travel": "1:52", "workingHours": { "hours": 8, "minutes": 11 }, "totalHours": { "hours": 22, "minutes": 51 }, "date": "04/25/2020", "day": "Saturday" },
    { "logIn": "7:34", "lunchStart": "13:17", "lunchEnd": "3:52", "logOut": "17:59", "travel": "1:25", "workingHours": { "hours": 3, "minutes": 1 }, "totalHours": { "hours": 21, "minutes": 15 }, "date": "07/09/2020", "day": "Thursday" },
    { "logIn": "7:20", "lunchStart": "13:00", "lunchEnd": "13:20", "logOut": "17:38", "travel": "0:26", "workingHours": { "hours": 6, "minutes": 58 }, "totalHours": { "hours": 15, "minutes": 47 }, "date": "07/14/2020", "day": "Tuesday" },
    { "logIn": "7:03", "lunchStart": "13:24", "lunchEnd": "12:14", "logOut": "19:45", "travel": "0:13", "workingHours": { "hours": 5, "minutes": 12 }, "totalHours": { "hours": 0, "minutes": 57 }, "date": "04/19/2020", "day": "Sunday" },
    { "logIn": "7:08", "lunchStart": "13:39", "lunchEnd": "2:20", "logOut": "18:13", "travel": "2:53", "workingHours": { "hours": 11, "minutes": 28 }, "totalHours": { "hours": 18, "minutes": 51 }, "date": "04/20/2020", "day": "Monday" },
    { "logIn": "7:01", "lunchStart": "13:20", "lunchEnd": "11:42", "logOut": "18:52", "travel": "1:30", "workingHours": { "hours": 5, "minutes": 3 }, "totalHours": { "hours": 5, "minutes": 24 }, "date": "06/25/2020", "day": "Thursday" },
    { "logIn": "7:04", "lunchStart": "13:56", "lunchEnd": "9:34", "logOut": "18:17", "travel": "1:22", "workingHours": { "hours": 2, "minutes": 38 }, "totalHours": { "hours": 10, "minutes": 17 }, "date": "02/17/2020", "day": "Monday" },
    { "logIn": "7:02", "lunchStart": "13:37", "lunchEnd": "8:37", "logOut": "19:31", "travel": "1:30", "workingHours": { "hours": 14, "minutes": 46 }, "totalHours": { "hours": 14, "minutes": 60 }, "date": "04/14/2020", "day": "Tuesday" },
    { "logIn": "7:01", "lunchStart": "13:44", "lunchEnd": "8:55", "logOut": "18:30", "travel": "1:08", "workingHours": { "hours": 20, "minutes": 15 }, "totalHours": { "hours": 6, "minutes": 60 }, "date": "02/01/2020", "day": "Saturday" },
    { "logIn": "7:27", "lunchStart": "13:50", "lunchEnd": "10:04", "logOut": "17:36", "travel": "1:47", "workingHours": { "hours": 16, "minutes": 57 }, "totalHours": { "hours": 14, "minutes": 52 }, "date": "02/28/2020", "day": "Friday" },
    { "logIn": "7:44", "lunchStart": "13:24", "lunchEnd": "13:13", "logOut": "18:39", "travel": "0:11", "workingHours": { "hours": 8, "minutes": 53 }, "totalHours": { "hours": 4, "minutes": 11 }, "date": "07/19/2020", "day": "Sunday" },
    { "logIn": "7:07", "lunchStart": "13:07", "lunchEnd": "3:13", "logOut": "19:40", "travel": "0:27", "workingHours": { "hours": 15, "minutes": 33 }, "totalHours": { "hours": 10, "minutes": 33 }, "date": "05/15/2020", "day": "Friday" },
    { "logIn": "7:30", "lunchStart": "13:24", "lunchEnd": "4:33", "logOut": "18:02", "travel": "0:13", "workingHours": { "hours": 5, "minutes": 29 }, "totalHours": { "hours": 13, "minutes": 26 }, "date": "04/19/2020", "day": "Sunday" },
    { "logIn": "7:34", "lunchStart": "13:44", "lunchEnd": "10:37", "logOut": "18:33", "travel": "2:11", "workingHours": { "hours": 19, "minutes": 20 }, "totalHours": { "hours": 16, "minutes": 17 }, "date": "07/16/2020", "day": "Thursday" },
    { "logIn": "7:09", "lunchStart": "13:02", "lunchEnd": "10:19", "logOut": "17:03", "travel": "1:35", "workingHours": { "hours": 23, "minutes": 29 }, "totalHours": { "hours": 8, "minutes": 17 }, "date": "06/08/2020", "day": "Monday" },
    { "logIn": "7:25", "lunchStart": "13:54", "lunchEnd": "4:24", "logOut": "17:49", "travel": "2:18", "workingHours": { "hours": 13, "minutes": 43 }, "totalHours": { "hours": 7, "minutes": 23 }, "date": "03/16/2020", "day": "Monday" }]
    async.eachSeries(timeLogArray, (singleTimeLog, innerCallback) => {
        console.log('singleTimeLog==>>>', singleTimeLog);
        addTimeLog(singleTimeLog).then((response) => {
            let newData = { instructorId: instructorId, logId: response._id }
            addTimeLogInInstructor(newData).then((result) => {
                innerCallback();
            }).catch((error) => {
                errorLog(" Error ", error)
            })
        }).catch((error) => {
            errorLog(" Error ", error)
        })
    }, (callbackError, callbackResponse) => {
        if (callbackError) {
            console.log("callbackError ", callbackError);
        } else {
            console.log("Date set Completed", callbackResponse);
        }
    })
}


const calculateDiff1 = (index) => {
    console.log("CalculateDiff 1");
    var startTime = this.Days[index].logIn;
    var startHours = startTime.split(":")[0]
    var startMinutes = startTime.split(":")[1]
    var endTime = this.Days[index].lunchStart;
    var endHours = endTime.split(":")[0]
    var endMinutes = endTime.split(":")[1]
    var date = moment(this.Days[index].date);
    var time1 = new Date(date.toDate().setHours(startHours, startMinutes)) //new Date(date + ' ' + startTime + ':00 GMT+0000');
    var time2 = new Date(date.toDate().setHours(endHours, endMinutes))//new Date(date + ' ' + endTime + ':00 GMT+0000');
    var difference = (time2 - time1) / 60000;
    console.log("Difference", difference);
    var minutes = difference % 60;
    console.log("minutes", minutes);
    var hours = (difference - minutes) / 60;
    console.log("hours", hours);
    return ({ hours: hours, minutes: minutes })
}

const calculateDiff2 = (index) => {
    console.log("CalculateDiff 2");
    var startTime = this.Days[index].lunchEnd;
    var startHours = startTime.split(":")[0]
    var startMinutes = startTime.split(":")[1]
    var endTime = this.Days[index].logOut;
    var endHours = endTime.split(":")[0]
    var endMinutes = endTime.split(":")[1]
    var date = moment(this.Days[index].date);
    var time1 = new Date(date.toDate().setHours(startHours, startMinutes));
    var time2 = new Date(date.toDate().setHours(endHours, endMinutes));
    var difference = (time2 - time1) / 60000;
    var minutes = difference % 60;
    var hours = (difference - minutes) / 60;
    return ({ hours: hours, minutes: minutes })
}

