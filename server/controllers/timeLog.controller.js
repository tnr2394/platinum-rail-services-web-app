console.log(" Time Log Controller ")

// Npm Modules
const async = require("async")
const lodash = require('lodash')
const ObjectId = require('mongodb').ObjectId

const successLog = console.log
const errorLog = console.error
const debugLog = console.debug


// Static Variables

const timeLogDOA = require('../dao/folder.dao')

const timeLogModel = require('../models/timeLog.model')
const instructorTimeLog = require('../models/instructorTimeLog.model')

const badData = { message: "Sorry, it's bad data request" }


const timeLogServices = require('../services/timeLog.service')


// All Functions calls form the router

module.exports.getTimeLog = (req, res) => {

	const instructorId = ObjectId("5e2ee7acb3c6121d2b51988f")

	timeLogServices.getInstructorWiseTimeLog(instructorId)
	.then((result)=>{
		return res.status(200).json({ result })
	})
	.catch((error)=>{

	})
}

module.exports.addTimeLog = (req, res) => {

	if(!(req && req.body && req.body.timeLog && req.body.instructorId)) return res.status(400).json(badData)

	const instructorId = ObjectId(req.body.instructorId)

	let newLog = {
		// date: req.body.timeLog.date,
		date: (req.body.timeLog && req.body.timeLog.date) ? new Date(req.body.timeLog.date) : new Date(),
		time: {
			in: {
				hours: (req.body.timeLog.in && req.body.timeLog.in.hours != undefined && req.body.timeLog.in.hours != null) ? req.body.timeLog.in.hours : '-',
				minutes: (req.body.timeLog.in && req.body.timeLog.in.minutes != undefined && req.body.timeLog.in.minutes != null) ? req.body.timeLog.in.minutes : '-',
				type: (req.body.timeLog.in && req.body.timeLog.in.type != undefined && req.body.timeLog.in.type != null) ? req.body.timeLog.in.type : '-' 
			},
			lunchStart: {
				hours: (req.body.timeLog.lunchStart && req.body.timeLog.lunchStart.hours != undefined && req.body.timeLog.lunchStart.hours != null) ? req.body.timeLog.lunchStart.hours : '-',
				minutes: (req.body.timeLog.lunchStart && req.body.timeLog.lunchStart.minutes != undefined && req.body.timeLog.lunchStart.minutes != null) ? req.body.timeLog.lunchStart.minutes : '-',	
				type: (req.body.timeLog.lunchStart && req.body.timeLog.lunchStart.type != undefined && req.body.timeLog.lunchStart.type != null) ? req.body.timeLog.lunchStart.type : '-'
			},
        	lunchEnd:{
            	hours: (req.body.timeLog.lunchEnd && req.body.timeLog.lunchEnd.hours) ? req.body.timeLog.lunchEnd.hours : '-',
            	minutes: (req.body.timeLog.lunchEnd && req.body.timeLog.lunchEnd.minutes) || '-',
				type: (req.body.timeLog.lunchEnd && req.body.timeLog.lunchEnd.type != undefined && req.body.timeLog.lunchEnd.type != null) ? req.body.timeLog.lunchEnd.type : '-'    
        	},
        	out:{
            	hours: (req.body.timeLog.timeOut && req.body.timeLog.timeOut.hours) ? req.body.timeLog.timeOut.hours : '-',
            	minutes: (req.body.timeLog.timeOut && req.body.timeLog.timeOut.minutes)? req.body.timeLog.timeOut.minutes : '-',
				type: (req.body.timeLog.timeOut && req.body.timeLog.timeOut.type != undefined && req.body.timeLog.timeOut.type != null) ? req.body.timeLog.lunchStart.type : '-'
    
        	},
    	},
	}

	successLog(" ***************************** ", instructorId)


	timeLogServices.addTimeLog(newLog)
	.then((data)=>{
		if(data && data._id && instructorId){

			let newData = {
				instructorId : instructorId,
				logId: data._id
			}

			timeLogServices.addTimeLogInInstructor(newData)
			.then((result)=>{
				return res.status(200).json({ message: ' Add Time Logs ', data })
			})
			.catch((error)=>{
				errorLog(" Error ", error)
			})
		}
		else{
			successLog(" Time Log is not added ")
		}


	})
	.catch((error)=>{
		errorLog(" Return befor erro  ",error)
		return res.status(500).json({ message: ' Error in: Add Time Logs ', error })
	})
}

module.exports.updateTimeLog = (req, res) => {
	successLog(" Update Time Logs ")
	return res.status(200).json({ message: ' Update Time Logs ' })
}