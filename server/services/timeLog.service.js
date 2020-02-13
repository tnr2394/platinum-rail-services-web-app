// npm modules
const path = require('path')
const mongoose = require('mongoose')
const lodash = require('lodash')

// Database model

// const jobModel = require('../models/timeLog.model');

const TimeLog = mongoose.model('timeLog')
const InstructorTimeLog = mongoose.model('instructorTimeLog')
// 
// Local variables
const ObjectId = require('mongodb').ObjectId
const successLog = console.log
const errorLog = console.error
const debugLog = console.debug


module.exports.addTimeLog = addTimeLog
module.exports.addTimeLogInInstructor = addTimeLogInInstructor

function addTimeLog(data){
    return new Promise((resolve, reject)=>{
        let newTimeLog = new TimeLog(data)
        newTimeLog.save((error, successData)=>{
            if(successData) return resolve(successData)
            else if(error) return reject(error)
            else return resolve()     
        })
    })
}

function addTimeLogInInstructor(data){
    return new Promise((resolve, reject)=>{
        findInInstructorTimeLogs(data)
        .then((found)=>{
            if(found){
                InstructorTimeLog
                .updateOne({ _id: found._id }, { $addToSet: { 'logs': data.logId } })
                .exec((error, update)=>{
                    if(error) return reject(error)
                    else return resolve();
                })
            }
            else{
                let newInstructorTimeLog = new InstructorTimeLog({
                    instructorId: data.instructorId,
                    logs: [data.logId]
                })

                newInstructorTimeLog.save((error, successData)=>{
                    if(successData) return resolve(successData)
                    else if(error) return reject(error)
                    else return resolve()
                })  
            }
        })
        .catch((error)=>{
            return reject(error)
        })
    })
}

function findInInstructorTimeLogs(data){
    return new Promise((resolve, reject)=>{
        InstructorTimeLog
            .findOne({ 'instructorId': data.instructorId })
            .exec((error, data)=>{
                if(data) return resolve(data)
                else if(error) return reject(error)  
                else return resolve()
            })
    })
}