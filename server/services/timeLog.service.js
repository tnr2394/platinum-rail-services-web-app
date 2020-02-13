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
module.exports.getInstructorWiseTimeLog = getInstructorWiseTimeLog

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


function getInstructorWiseTimeLog(instructorId){

    return new Promise((resolve, reject)=>{

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
                timeLog: {
                    in: '$time.in',
                    lunchStart: '$time.lunchStart',
                    lunchEnd: '$time.lunchEnd',
                    out: '$time.out'
                },     
                logInTime: { 
                    $concat: ['$time.in.hours', ':' ,'$time.in.minutes', ' ', '$time.in.type' ] 
                },
                lunchStartTime: { 
                    $concat: ['$time.lunchStart.hours', ':' ,'$time.lunchStart.minutes', ' ' , '$time.lunchStart.type' ] 
                },
                lunchEndTime: { 
                    $concat: ['$time.lunchEnd.hours', ':' ,'$time.lunchEnd.minutes' , ' ', '$time.lunchEnd.minutes' ] 
                },
                logOutTime: { 
                    $concat: ['$time.out.hours', ':' ,'$time.out.minutes', ' ', '$time.out.type' ] 
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
      ])
            .exec((error, data)=>{
                if(error) return reject(error)
                else return resolve(data)
            })
    })

}