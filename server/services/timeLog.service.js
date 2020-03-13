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
module.exports.deleteTimeLogs = deleteTimeLogs

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

    successLog("instructorId in getInstructorTimeLog==========>>>>>>>>>>", instructorId, JSON.stringify(datesArray, null, 2))

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
                    },
                    totalHours: {
                        $sum: '$logs.totalHours.hours'
                    },
                    totalMinutes: {
                        $sum: '$logs.totalHours.minutes'
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



function deleteTimeLogs(timeLogArray) {

    return new Promise((resolve, reject) => {

        deleteTimeLogFromTimeLogModel(timeLogArray).then((response) => {
            deleteTimeLogFromIns(timeLogArray).then((res) => {
                resolve(res)
            }).catch((error) => {
                reject(error);
            })
        }).catch((err) => {
            reject(err);
        })
        // async.eachSeries(timeLogArray, (singleTimeLog, innerCallback) => {
        //     deleteTimeLogFromTimeLogModel(singleTimeLog).then((response) => {
        //         deleteTimeLogFromIns(singleTimeLog).then((result) => {
        //             innerCallback();
        //         }).catch((error) => {
        //             errorLog(" Error ", error)
        //         })
        //     }).catch((error) => {
        //         errorLog(" Error ", error)
        //     })
        // }, (callbackError, callbackResponse) => {
        //     if (callbackError) {
        //         console.log("callbackError ", callbackError);
        //     } else {
        //         console.log("Date set Completed", callbackResponse);
        //     }
        // })
    })
}


const deleteTimeLogFromTimeLogModel = (logsArray) => {
    return new Promise((resolve, reject) => {
        console.log('Remove Time Log From TimeLog', logsArray)
        TimeLog
            .deleteMany(
                {
                    _id: { $in: logsArray }
                })
            .exec((err, res) => {
                if (res) return resolve(res)
                else if (err) return reject(err)
                else return resolve()
            })
    })
}

const deleteTimeLogFromIns = (logsArray) => {
    return new Promise((resolve, reject) => {
        console.log('Remove Time Log From Instimelogs', logsArray)
        InstructorTimeLog
            .updateMany(
                {
                    _id: { $in: logsArray }
                },
                {
                    $pull: {
                        logs: logsArray
                    }
                },
                {
                    upsert: true,
                    new: true
                }).exec((err, res) => {
                    if (res) return resolve(res)
                    else if (err) return reject(err)
                    else return resolve()
                })
    })
}

// Functions For Script Start Here

function scriptForTimelog() {
    console.log('script to generate timelogs')
    const instructorId = '5e45310bbb516d2ee082f58d';


    const timeLogArray = []



    let timeLogIds = []

    async.eachSeries(timeLogArray, (singleTimeLog, innerCallback) => {

        if (singleTimeLog.day != 'Sunday' && singleTimeLog.day != 'Saturday') {

            var diff1 = calculateDiff1(singleTimeLog)
            var diff2 = calculateDiff2(singleTimeLog)
            let hoursWorking = diff1.hours + diff2.hours
            let totalMinute = diff1.minutes + diff2.minutes
            if (totalMinute > 60) {
                totalMinute = totalMinute % 60;
                hoursWorking = hoursWorking + Math.floor(totalMinute / 60)
                singleTimeLog.workingHours.hours = hoursWorking;
                singleTimeLog.workingHours.minutes = totalMinute;
            }
            else if (totalMinute == 60) {
                singleTimeLog.workingHours.hours = hoursWorking + 1;
                singleTimeLog.workingHours.minutes = totalMinute - 60;
            }
            else {
                singleTimeLog.workingHours.hours = hoursWorking;
                singleTimeLog.workingHours.minutes = totalMinute;
            }

            singleTimeLog.totalHours = { hours: calculateTravelPlusWorkHours(singleTimeLog), minutes: calculateTravelPlusWorkMinutes(singleTimeLog) }
            // console.log(" datat ", datassss)
            delete singleTimeLog.day
            console.log(" singleTimeLog ::: ", singleTimeLog)

            // innerCallback()

            addTimeLog(singleTimeLog).then((response) => {
                let newData = { instructorId: ObjectId("5e352cb9390acb3ff3a0e1f3"), logId: response._id }
                console.log(" Yash CHeck this ")
                addTimeLogInInstructor(newData).then((result) => {
                    innerCallback();
                }).catch((error) => {
                    errorLog(" Error ", error)
                })
            }).catch((error) => {
                errorLog(" Error ", error)
            })
        }
        else {
            console.log(" +++++++++++ Holiday ++++++++++ ")
            innerCallback()
        }

    }, (callbackError, callbackResponse) => {
        if (callbackError) {
            console.log("callbackError ", callbackError);
        } else {
            console.log("Date set Completed", callbackResponse);
        }
    })
}


const calculateDiff1 = (timelog) => {
    // console.log("CalculateDiff 1", timelog);
    var startTime = timelog.logIn;
    var startHours = startTime.split(":")[0]
    var startMinutes = startTime.split(":")[1]
    var endTime = timelog.lunchStart;
    var endHours = endTime.split(":")[0]
    var endMinutes = endTime.split(":")[1]
    var date = moment(new Date(timelog.date))
    var time1 = new Date(date.toDate().setHours(startHours, startMinutes)) //new Date(date + ' ' + startTime + ':00 GMT+0000');
    var time2 = new Date(date.toDate().setHours(endHours, endMinutes))//new Date(date + ' ' + endTime + ':00 GMT+0000');
    var difference = (time2 - time1) / 60000;
    var minutes = difference % 60;
    var hours = (difference - minutes) / 60;
    return ({ hours: hours, minutes: minutes })
}

const calculateDiff2 = (timelog) => {
    // console.log("CalculateDiff 2");
    var startTime = timelog.lunchEnd;
    var startHours = startTime.split(":")[0]
    var startMinutes = startTime.split(":")[1]
    var endTime = timelog.logOut;
    var endHours = endTime.split(":")[0]
    var endMinutes = endTime.split(":")[1]
    var date = moment(new Date(timelog.date));
    var time1 = new Date(date.toDate().setHours(startHours, startMinutes));
    var time2 = new Date(date.toDate().setHours(endHours, endMinutes));
    var difference = (time2 - time1) / 60000;
    var minutes = difference % 60;
    var hours = (difference - minutes) / 60;
    return ({ hours: hours, minutes: minutes })
}

const calculateTravelPlusWorkMinutes = (timelog) => {
    let travel, totalHr, totalMin;
    travel = timelog.travel.split(":")
    totalHr = timelog.workingHours.hours + Number(travel[0])
    totalMin = timelog.workingHours.minutes + Number(travel[1])
    if (totalMin > 59) {
        // totalMin = totalMin - 60;
        // totalHr = totalHr + 1
        totalHr = totalHr + Math.floor(totalMin / 60)
        totalMin = totalMin % 60
        timelog.totalHours.minutes = totalMin;
        return totalMin;
    }
    else if (totalMin == 60) {
        totalHr = totalHr + 1
        totalMin = totalMin - 60
        timelog.totalHours.minutes = totalMin;
        return totalMin;
    }
    else {
        timelog.totalHours.minutes = totalMin;
        return totalMin;
    }
}

const calculateTravelPlusWorkHours = (timelog) => {
    let travel, totalHr, totalMin;
    travel = timelog.travel.split(":")
    totalHr = timelog.workingHours.hours + Number(travel[0])
    totalMin = timelog.workingHours.minutes + Number(travel[1])
    if (totalMin > 59) {
        totalHr = totalHr + Math.floor(totalMin / 60)
        totalMin = totalMin % 60
        timelog.totalHours.hours = totalHr;
        return timelog.totalHours.hours;
    } else if (totalMin == 60) {
        totalHr = totalHr + 1
        totalMin = totalMin - 60
        timelog.totalHours.hours = totalHr;
        return timelog.totalHours.hours;
    }
    else {
        timelog.totalHours.hours = totalHr;
        return timelog.totalHours.hours;
    }
}


const updateTimeLogRecords = () => {
    console.log('Update Logs Date');

    async.eachSeries(timeLogArray, (singleTimeLog, innerCallback) => {
        addTimeLog(singleTimeLog).then((response) => {
            let newData = { instructorId: ObjectId("5e352cb9390acb3ff3a0e1f3"), logId: response._id }
            console.log(" Yash CHeck this ")
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



// scriptForTimelog()