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
	// const instructorId = ObjectId('5e45310bbb516d2ee082f58d')
	const instructorId = req.body.instructorId;
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
	const instructorId = req.body.instructorId
	const datesArray = req.body.date
	console.log('Req.body=======>>>>.', req.body);

	async.eachSeries(datesArray, (singleRecord, innerCallback) => {
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
					return innerCallback(error)
					// return res.status(500).json({ message: ' Error in: Add Time Logs ', error })
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
			if (req.body.deletedLog.length != 0) {
				timeLogServices.deleteTimeLogs(req.body.deletedLog).then((response) => {
					console.log('Res in delete then===>>', response)
					return res.status(200).json({ message: ' Add Time Logs ', callbackResponse })
				}).catch((err) => {
					return res.status(500).send({ callbackError })
				})
			} else {
				return res.status(200).json({ message: ' Add Time Logs ', callbackResponse })

			}
		}
	})
}


const calculateDiff = (date, startTime, endTime) => {
	var time1 = new Date(date + ' ' + startTime + ':00 GMT+0000');
	var time2 = new Date(date + ' ' + endTime + ':00 GMT+0000');
	var difference = (time2 - time1) / 60000;
	var minutes = (difference % 60);
	var hours = ((difference - minutes) / 60)
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
	const instructorId = req.body.instructorId


	// const instructorId = ObjectId('5e293b0fa452624cba0dcfd5');
	timeLogServices.getInstructorTimeLog(instructorId, datesArray).then((response) => {
		return res.status(200).json({ message: 'Time Logs Fetch Successfully ', response })
	}).catch((error) => {
		return res.status(500).json({ message: ' Error in: Fetch Time Logs ', error })
	})
}

module.exports.getWeeklylog = (req, res) => {
	const arrayRecieved = req.body.dateArray
	console.log("***array", arrayRecieved);
	let res2 = []
	async.eachOfSeries(arrayRecieved, (singleWeek, index, innerCallback) => {
		console.log("***singleWeek", singleWeek);

		const datesArray = JSON.parse(JSON.stringify(singleWeek))
		const datesArray2 = JSON.parse(JSON.stringify(singleWeek))

		const instructorId = req.body.instructorId;
		Promise.all([
			getLast13Logs(instructorId, datesArray),
			weeklyLogsWithOtherRules(instructorId, datesArray2)
		]).then(response => {
			let finalStatus;
			let last13Status = [];
			let dateCompared = [];
			let weekLogsOf = [];
			let last13daysLogs = response[0].logs
			let dates = response[0].dates
			let weekLogs = response[1].weeklyLogs
			let status = response[1].status

			let countForEachDay = [];
	let sortedDates = (dates.sort(function (a, b) {
		return new Date(b + ' ' + '00:00' + ':00 GMT+0000') - new Date(a + ' ' + '00:00' + ':00 GMT+0000');
	})).reverse();
			if (weekLogs.length > 0 && last13daysLogs.length > 0) {
		// console.log("---IN IF---");
		for (var i = 0; i < weekLogs.length; i++) {
			count = 0;
			// console.log("weekLogs of", i, weekLogs[i].date);
			// weekLogsOf.push("weekLogs of" + i + weekLogs[i].date)
			for (d = i; d <= i + 13; d++) {
				// console.log("DATE COMPARED IS",dates[d])

				var index = lodash.findIndex(last13daysLogs, (o) => {
					// console.log("o.date", o.date, "------ ", "sortedDates[d]", sortedDates[d]);
					dateCompared.push("o.date" + o.date + "------ " + "sortedDates[d]" + sortedDates[d])
					return o.date == sortedDates[d]
				})
				if (index > -1) count = count + 1;
			}
			countForEachDay.push(count)
			// console.log("COUNT FOR i", i, count);
		}

		let finalLast13Status = getLast13Status(countForEachDay)

		let finalWorkingHrsStatus = getFinalStatus(response[1].workingHrsStatus)
		let finaltravelHrsStatus = getFinalStatus(response[1].travelHrsStatus)
		let finalbreakBtnTurnsStatus = getFinalStatus(response[1].breakBtnTurnsStatus)
		let finalweekHrs = getFinalStatus(response[1].weekHrs)


		// console.log("Test 555555555555555555555555555555555555555555")

		res2.push({
			message: 'Status sent ', workingHrsStatus: finalWorkingHrsStatus,
			travelHrsStatus: finaltravelHrsStatus, breakBtnTurnsStatus: finalbreakBtnTurnsStatus, weekHrs: finalweekHrs,
			last13Status: finalLast13Status
		})

		return innerCallback()
		}
	else{
		console.log("Error")
		// return res.status(200).json({ message: 'Status sent ', finalStatus: 'Not enough data' })
	}
	}).catch((error) => {
		console.log('Inside Error=====>>>', error);
	})
	}, (callbackError, callbackResponse) => {
		if (callbackError) {
			return res.status(500).send({ callbackError })
		}
		else {
			// console.log(res2)
			return res.status(200).send({ res2 })
		}
	})

}
function isEqualThan13(count) {
	// console.log("CoUnT", count);
	return count == 13;
}
function isGreaterThan13(count) {
	// console.log("CoUnT", count);
	return count > 13;
}
function exceeded(status) {
	return status == "Regulation exceeded"
}
function getLast13Status(array) {
	// console.log("getLast13Status called");
	let index = lodash.findIndex(array, function (o) {
		// console.log(" > 13 compared");
		return o > 13
	})
	if (index >= 0) {
		// console.log("Regulation exceeded at ", index);
		return finalStatus = "Regulation exceeded"
	}
	else {
		var lessThen = lodash.findIndex(array, function (o) {
			// console.log(" < 13 compared");
			return o < 13
		})
		if (lessThen >= 0) {
			// console.log("Less than Regulation used at ", lessThen);
			return finalStatus = "Less than Regulation used"
		}
		else {
			// console.log("Regulation Achieved");
			return finalStatus = "Regulation Achieved"
		}
	}
}
function getFinalStatus(array) {

	// console.log("array", JSON.stringify(array, null, 2))

	let index = lodash.findIndex(array, function (o) { return o == "Regulation exceeded" })

	// console.log("getFinalStatus", index)

	if (index >= 0) {
		return "Regulation exceeded"
	}
	else {
		var lessThen = lodash.findIndex(array, function (o) { return o == "Less than Regulation used" })
		if (lessThen >= 0) return finalStatus = "Less than Regulation used"
		else return "Regulation Achieved"
	}
}

const weeklyLogsWithOtherRules = (instructorId, datesArray) => {
	console.log("weeklyLogsWithOtherRules", datesArray);

	return new Promise((resolve, reject) => {
		let status = [];
		let workingHrsStatus = [];
		let travelHrsStatus = [];
		let breakBtnTurnsStatus = [];
		let weekHrs = [];
		// status = 'satisfied'
		timeLogServices.getInstructorTimeLog(instructorId, datesArray).then((response) => {
			// console.log("***getInstructorTimeLog***", response);
			let tempWeeklyHours = 0; //Hours per week
			let tempWeeklyMinutes = 0; //Hours per week
			// console.log("here");

			console.log("response", response)
			console.log("response.length", response.length)

			for (var i = 0; i < response.length; i++) {
				// Working hours
				if ((response[i].workingHours.hours == 12 && response[i].workingHours.minutes == 00)) {
					// status = "Regulation achieved"
					workingHrsStatus.push("Regulation achieved")
				}
				else if (response[i].workingHours.hours < 12) workingHrsStatus.push("Less than Regulation used")  //status = "Less than Regulation used"
				else workingHrsStatus.push("Regulation exceeded") //status = "Regulation exceeded"

				// traver + work
				if (response[i].totalHours && (response[i].totalHours.hours == 14 && response[i].workingHours.minutes == 00)) {
					travelHrsStatus.push("Regulation achieved") // status = "Regulation achieved"
				} else if (response[i].totalHours && response[i].totalHours.hours < 14) travelHrsStatus.push("Less than Regulation used") //status = "Less than Regulation used"
				else travelHrsStatus.push("Regulation exceeded") //status = "Regulation exceeded"

				// console.log("tempWeeklyMinutes:", tempWeeklyMinutes, "tempWeeklyHours", tempWeeklyHours);
				// console.log("in for loop", "SATISFIED at", i, status);
				tempWeeklyHours = tempWeeklyHours + response[i].workingHours.hours //Hours per week
				console.log("tempWeeklyHours => 2", tempWeeklyHours);
				tempWeeklyMinutes = tempWeeklyMinutes + response[i].workingHours.minutes //Hours per week
				// console.log("tempWeeklyMinutes =>", tempWeeklyMinutes, "+", response[i].workingHours.minutes, "=", tempWeeklyMinutes + response[i].workingHours.minutes);
				// console.log("time done");
				if (i < response.length - 1) { //Break between turns
					var time1 = new Date(response[i].date + ' ' + response[i].logOut + ':00 GMT+0000');
					var time2 = new Date(response[i + 1].date + ' ' + response[i + 1].logIn + ':00 GMT+0000');
					// console.log("time1", time1, "time2", time2);
					var difference = (time2 - time1) / 60000;
					var minutes = (difference % 60);
					var hours = ((difference - minutes) / 60)
					// console.log("loop", i);
					// console.log("DIFFERENCE iS", hours, minutes);
					if (hours < 12) breakBtnTurnsStatus.push("Regulation exceeded") //status = 'Regulation exceeded';
					else if (hours == 12 && minutes == 00) breakBtnTurnsStatus.push("Regulation achieved") //status = 'Regulation achieved'
					else breakBtnTurnsStatus.push("Less than Regulation used") //status = "Less than Regulation used"
				}
			}
			if (tempWeeklyMinutes > 60) { //Hours per week
				// console.log("tempWeeklyMinutes before conversion", tempWeeklyMinutes);
				tempWeeklyHours = tempWeeklyHours + Math.floor(tempWeeklyMinutes / 60)
				console.log("tempWeeklyHours => 3", tempWeeklyHours);

				tempWeeklyMinutes = tempWeeklyMinutes % 60
			}
			else if (tempWeeklyMinutes == 60) {
				tempWeeklyHours = tempWeeklyHours + 1
				console.log("tempWeeklyHours => 4", tempWeeklyHours);

				tempWeeklyMinutes = tempWeeklyMinutes - 60
			}


			console.log(" ********* tempWeeklyHours  ****************** ", tempWeeklyHours, typeof tempWeeklyHours)

			if (tempWeeklyHours == 72) weekHrs.push("Regulation Achieved") //status = "Regulation Achieved";
			else if (tempWeeklyHours > 72) weekHrs.push("Regulation exceeded") //status = "Regulation Exceeded" 
			else weekHrs.push("Less than Regulation used") //status = 'Less than Regulation used' //Hours per week

			console.log("weekHrs" + tempWeeklyHours + " &&&&&&&&&& " + weekHrs[weekHrs.length - 1])

			//Break between turns
			console.log("tempWeeklyHours", tempWeeklyHours, "tempWeeklyMinutes", tempWeeklyMinutes, "status", status);
			let weeklyResponse = {
				weeklyLogs: response,
				status: status,
				workingHrsStatus: workingHrsStatus,
				travelHrsStatus: travelHrsStatus,
				breakBtnTurnsStatus: breakBtnTurnsStatus,
				weekHrs: weekHrs
			}
			resolve(weeklyResponse)
		}).catch((error) => {
			console.log("error", error);
			// return res.status(500).json({ message: ' Error in getting weekly time log ', error })
		})
	})
}
const getLast13Logs = (instructorId, datesArray) => {
	// console.log("getLast13Logs", datesArray);
	return new Promise((resolve, reject) => {
		numberOfTurns(instructorId, datesArray).then((response) => {
			// console.log("response ++++++++", response)
			return resolve(response)
		}).catch((error) => {
			console.error("Error", error)
			return reject(error)
		})
	})
}

// module.exports.numberOfTurns = (req, res, dateRecieved) => {
// 	console.log("numberOfTurns called", dateRecieved);
// 	let date;
// 	if (dateRecieved) date = dateRecieved; else date = req.body.date
// 	let datesArray
// 	let status;
// 	return new Promise((resolve, reject)=>{
// 		datesArray = calculateLast13Days(date) 	
// 		resolve(datesArray)
// 	}).then(datesArray=>{
// 		const instructorId = ObjectId('5e293b0fa452624cba0dcfd5');
// 		timeLogServices.getInstructorTimeLog(instructorId, datesArray).then((response) => {
// 			if(response.length == 13) status = "satisfied"; else status = "Not satisfied"
// 			return res.status(200).json({ message: 'Status sent ', status })
// 		}).catch((error) => {
// 			return res.status(500).json({ message: ' Error in: Fetch Time Logs ', error })
// 		})
// 	})
// }

const numberOfTurns = (instructorId, weekDates) => {
	// console.log("----------numberOfTurns called---------");
	return new Promise((resolve, reject) => {
		let datesArray = weekDates
		calculateLast13Days(weekDates[0]).then((data) => {
			datesArray.push(...data)
			timeLogServices.getInstructorTimeLog(instructorId, datesArray)
				.then((response) => {
					let logsToReturn = {
						logs: response,
						dates: datesArray
					}
					return resolve(logsToReturn)
				})
				.catch(() => {

				})
		})
			.catch(() => {

			})
		// return resolve(datesArray)

	})
}


const calculateLast13Days = (date) => {
	// console.log("numberOfShifts", date);
	// let date = '02/06/2020'
	// console.log(req.date);

	return new Promise((resolve, reject) => {
		var result = [];
		for (var i = 1; i <= 14; i++) {
			var d = new Date(date);
			d.setDate(d.getDate() - i);
			formatDate(d).then((response) => {
				// console.log("----------response----------", response);

				result.push(response)
			}).catch((error) => {

			})
		}
		// console.log('Result inside in 13Dyas', result);
		resolve(result)
	})

}
function formatDate(date) {
	return new Promise((resolve, reject) => {
		var dd = date.getDate();
		var mm = date.getMonth() + 1;
		var yyyy = date.getFullYear();
		if (dd < 10) { dd = '0' + dd }
		if (mm < 10) { mm = '0' + mm }
		date = mm + '/' + dd + '/' + yyyy;
		// console.log("formatDate", date);
		resolve(date)
	})
}



module.exports.instructorsTimeLogDetails = (req, res) => {
	console.log('Instructor Time Log Details', req.body.date);

	const date = req.body.date;

	// let instructorList = [];

	// lodash.forEach(req.body.instructor, (singleIns) => {
	// 	console.log('Single Ins', singleIns);
	// 	instructorList.push(ObjectId(singleIns))
	// })

	// console.log('Instructor Time Log Details', instructorList);


	timeLogServices.getInstructorsTimeLogDetails(date).then((response) => {
		return res.status(200).json({ message: 'Time Logs Fetch Successfully ', response })
	}).catch((error) => {
		return res.status(500).json({ message: ' Error in: Fetch Time Logs ', error })
	})
}


module.exports.secondReportLogsDetails = (req, res) => {
	console.log('Instructor Time Log Details', req.body.date);

	const date = req.body.date;
	const instructorId = req.body.instructorId;

	timeLogServices.secondReportLogsDetails(instructorId, date).then((response) => {
		return res.status(200).json({ message: 'Time Logs Fetch Successfully ', response })
	}).catch((error) => {
		return res.status(500).json({ message: ' Error in: Fetch Time Logs ', error })
	})
}







// let x = this.numberOfTurns(req, res, response[i].date)
// console.log("SATISFIED at", i, satisfied, "STATUS", x);
