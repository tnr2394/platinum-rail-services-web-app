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
	const instructorId = ObjectId('5e45310bbb516d2ee082f58d')
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
	const instructorId = ObjectId('5e293b0fa452624cba0dcfd5')
	console.log('Req.body=======>>>>.', req.body);

	async.eachSeries(req.body, (singleRecord, innerCallback) => {
		console.log('singleRecord', singleRecord);

		if (singleRecord._id == 'new') {
			delete singleRecord._id;
			timeLogServices.addTimeLog(singleRecord)
				.then((data) => {
					console.log('Data after add', data);
					if (data && data._id && instructorId) {

						let newData = {
							instructorId: instructorId,
							logId: data._id
						}

						timeLogServices.addTimeLogInInstructor(newData).then((result) => {
							innerCallback();
						}).catch((error) => {
							errorLog(" Error ", error)
						})
					}
					else {
						successLog(" Time Log is not added ")
					}
				}).catch((error) => {
					errorLog(" Return befor erro  ", error)
					return res.status(500).json({ message: ' Error in: Add Time Logs ', error })
				})
		} else {
			timeLogServices.updateTimeLog(singleRecord._id, singleRecord).then((response) => {
				innerCallback();
			}).catch((error) => {
				return res.status(500).json({ message: ' Error in: Update Time Logs ', error })
			})
		}
	}, (callbackError, callbackResponse) => {
		if (callbackError) {
			console.log("callbackError ", callbackError);
			return res.status(500).send({ callbackError })
		} else {
			return res.status(200).json({ message: ' Add Time Logs ', callbackResponse })
		}
	})
}


const calculateDiff = (date, startTime, endTime) => {
	var time1 = new Date(date + ' ' + startTime + ':00 GMT+0000');
	var time2 = new Date(date + ' ' + endTime + ':00 GMT+0000');
	var difference = (time2 - time1) / 60000;
	var minutes = Math.abs(difference % 60);
	var hours = Math.abs((difference - minutes) / 60)
	// var hours = Math.abs(Math.floor((difference - minutes) / 60));
	return ({ hours: hours, minutes: minutes })
}

module.exports.updateTimeLog = (req, res) => {
	successLog(" Update Time Logs ", req.body);

	if (req.body.timeLogId == undefined || req.body.timeLogId == null) {
		return res.status(400).json(badData)
	}

	const timeLogId = ObjectId(req.body.timeLogId)

	let logData = {
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

	console.log('logData=========>>>>>>', logData);

	timeLogServices.updateTimeLog(timeLogId, logData).then((response) => {
		return res.status(200).json({ message: 'Time Logs Update Successfully ', response })
	}).catch((error) => {
		return res.status(500).json({ message: ' Error in: Update Time Logs ', error })
	})
}

module.exports.getInstructorTimeLog = (req, res) => {

	console.log('Req.body======>>>>>', req.body.date);

	const datesArray = req.body.date;

	const instructorId = ObjectId('5e293b0fa452624cba0dcfd5');
	timeLogServices.getInstructorTimeLog(instructorId, datesArray).then((response) => {
		return res.status(200).json({ message: 'Time Logs Fetch Successfully ', response })
	}).catch((error) => {
		return res.status(500).json({ message: ' Error in: Fetch Time Logs ', error })
	})
}

module.exports.getWeeklylog = (req,res) => {
	console.log("*****req.body in", req.body);
	const datesArray = req.body.date
	console.log("datesArray", req.body.array);
	
	const instructorId = ObjectId('5e293b0fa452624cba0dcfd5');
	timeLogServices.getInstructorTimeLog(instructorId, datesArray).then((response)=>{
		console.log("response", response);

		let tempWeeklyHours = 0; //Hours per week
		let tempWeeklyMinutes = 0; //Hours per week
		console.log("here");

		for(var i = 0; i < response.length; i++){
			console.log("in for loop");
			tempWeeklyHours = tempWeeklyHours + response[i].workingHours.hours //Hours per week
			tempWeeklyMinutes = tempWeeklyMinutes + response[i].workingHours.minutes //Hours per week
			console.log("time done");
			
			if (i < response.length - 1) { //Break between turns
				var tempDate2 = moment(i.date).format('MM/DD/YYYY');
				console.log("loop", i);
				var diff = calculateDiff(tempDate2, response[i].logOut, response[i+1].logIn);
				console.log("DIFFERENCE iS", diff);
				if(diff.hours >= 12 && diff.minutes > 00){
					console.log("Not satisfied");
				}
				else console.log("SATISFIED");
			}
		}
		if (tempWeeklyMinutes > 60) { //Hours per week
			console.log("tempWeeklyMinutes before conversion", tempWeeklyMinutes);
			tempWeeklyHours = tempWeeklyHours + Math.floor(tempWeeklyMinutes/60)
			tempWeeklyMinutes = tempWeeklyMinutes%60
		}
		if (tempWeeklyHours > 70) console.log("Not satisfied"); //Hours per week
		console.log("tempWeeklyHours", tempWeeklyHours, "tempWeeklyMinutes", tempWeeklyMinutes);
		

	}).catch((error) => {
		return res.status(500).json({ message: ' Error in getting weekly time log ', error })
	})	
}
