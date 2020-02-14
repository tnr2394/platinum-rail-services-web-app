console.log(" Time Log Controller ")

// Npm Modules
const async = require("async")
const lodash = require('lodash')
const ObjectId = require('mongodb').ObjectId
const moment = require('moment')

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
	const instructorId = ObjectId("5e352cb9390acb3ff3a0e1f3")
	timeLogServices.getInstructorWiseTimeLog(instructorId)
		.then((result) => {
			async.eachSeries(result[0].dateWiseTimeLogs, function (single, cb) {
				var date2 = moment(single.date).format('MM/DD/YYYY');
				var diff1 = calculateDiff(date2, single.logInTime, single.lunchStartTime);
				var diff2 = calculateDiff(date2, single.lunchEndTime, single.logOutTime);
				let hoursWorking = diff1.hours + diff2.hours
				let totalMinute = diff1.minutes + diff2.minutes
				if (totalMinute > 59) {
					totalMinute = totalMinute - 60;
					hoursWorking = hoursWorking + 1
					single['totalWorkLog'] = { hours: hoursWorking, minutes: totalMinute }
					if ((single.travel.hours != undefined && single.travel.hours != null) || (single.travel.minutes != undefined && single.travel.minutes != null)) {
						single['totalWithTravelWorkLog'] = { hours: hoursWorking, minutes: totalMinute }
						return cb()
					}
					else {
						return cb()
					}
				}
				else {
					single['totalWorkLog'] = { hours: hoursWorking, minutes: totalMinute }

					if ((single.travel.hours != undefined && single.travel.hours != null) || (single.travel.minutes != undefined && single.travel.minutes != null)) {
						single['totalWithTravelWorkLog'] = { hours: hoursWorking + Number(single.travel.hours), minutes: totalMinute + Number(single.travel.minutes) }
						return cb()
					}
					else {
						return cb()
					}
				}

			}, (error) => {
				if (error) {
					return res.status(500).json({ error });
				} else {
					return res.status(200).json({ result });
				}
			})
		}).catch((error) => {
			return res.status(500).json({ error });
		})
}

module.exports.addTimeLog = (req, res) => {

	if (!(req && req.body && req.body.timeLog && req.body.instructorId)) return res.status(400).json(badData)

	const instructorId = ObjectId(req.body.instructorId)

	let newLog = {
		// date: req.body.timeLog.date,
		date: (req.body.timeLog && req.body.timeLog.date) ? new Date(req.body.timeLog.date) : new Date(),
		time: {
			in: {
				hours: (req.body.timeLog.in && req.body.timeLog.in.hours != undefined && req.body.timeLog.in.hours != null) ? req.body.timeLog.in.hours : '-',
				minutes: (req.body.timeLog.in && req.body.timeLog.in.minutes != undefined && req.body.timeLog.in.minutes != null) ? req.body.timeLog.in.minutes : '-',
			},
			lunchStart: {
				hours: (req.body.timeLog.lunchStart && req.body.timeLog.lunchStart.hours != undefined && req.body.timeLog.lunchStart.hours != null) ? req.body.timeLog.lunchStart.hours : '-',
				minutes: (req.body.timeLog.lunchStart && req.body.timeLog.lunchStart.minutes != undefined && req.body.timeLog.lunchStart.minutes != null) ? req.body.timeLog.lunchStart.minutes : '-',
			},
			lunchEnd: {
				hours: (req.body.timeLog.lunchEnd && req.body.timeLog.lunchEnd.hours) ? req.body.timeLog.lunchEnd.hours : '-',
				minutes: (req.body.timeLog.lunchEnd && req.body.timeLog.lunchEnd.minutes) || '-',
			},
			out: {
				hours: (req.body.timeLog.timeOut && req.body.timeLog.timeOut.hours) ? req.body.timeLog.timeOut.hours : '-',
				minutes: (req.body.timeLog.timeOut && req.body.timeLog.timeOut.minutes) ? req.body.timeLog.timeOut.minutes : '-',
			},
		},
	}

	successLog(" ***************************** ", instructorId)


	timeLogServices.addTimeLog(newLog)
		.then((data) => {
			if (data && data._id && instructorId) {

				let newData = {
					instructorId: instructorId,
					logId: data._id
				}

				timeLogServices.addTimeLogInInstructor(newData)
					.then((result) => {
						return res.status(200).json({ message: ' Add Time Logs ', data })
					})
					.catch((error) => {
						errorLog(" Error ", error)
					})
			}
			else {
				successLog(" Time Log is not added ")
			}


		})
		.catch((error) => {
			errorLog(" Return befor erro  ", error)
			return res.status(500).json({ message: ' Error in: Add Time Logs ', error })
		})
}


const calculateDiff = (date, startTime, endTime) => {
	var time1 = new Date(date + ' ' + startTime + ':00 GMT+0000');
	var time2 = new Date(date + ' ' + endTime + ':00 GMT+0000');
	var difference = (time2 - time1) / 60000;
	var minutes = difference % 60;
	var hours = (difference - minutes) / 60;
	return ({ hours: hours, minutes: minutes })
}

module.exports.updateTimeLog = (req, res) => {
	successLog(" Update Time Logs ")
	return res.status(200).json({ message: ' Update Time Logs ' })
}
