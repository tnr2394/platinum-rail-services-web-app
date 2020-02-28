import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
import { TimeSheetService } from '../../services/time-sheet.service';
import { single } from 'rxjs/operators';




@Component({
  selector: 'app-single-week',
  templateUrl: './single-week.component.html',
  styleUrls: ['./single-week.component.scss']
})
export class SingleWeekComponent implements OnInit {

  @Input('instFromAdminReport') instFromAdminReport;
  @Input('calWeekDates') doGetWeekDates;
  @Input('logsFromAdmin') logsFromAdmin;
  @Input('overTimeHours') overTimeHours;

  totalHoursWorked = { hours: 0, minutes: 0 };
  pageSizeOptions: number[] = [5, 10, 25, 100];
  jobId;
  displayedColumns: string[] = ['date', 'logIn', 'lunchStart', 'lunchEnd', 'logOut', 'travelHours', 'hoursWorked', 'totalHours'];
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  currentTime;
  totalHours = 0;
  totalMinutes = 0;
  datesOfWeek;
  Days: any = [];
  finalArray: any = [];

  arrayFromDb: any = [];
  arrayFromParam: any = [];
  queryParamsObj = {};
  instructorId: any;
  displayMsg: boolean = false;
  displayNoDataMsg: boolean;
  loading: boolean;
  currentUser: any;
  displayTitle: boolean = true;

  overH = 0;
  overM = 0;




  // Days = [
  //   { id: '0', date: '02/11/2020', logIn: '00:00', lunchStart: '00:00', lunchEnd: '00:00', logOut: '00:00', workingHours: { hours: 0, minutes: 0 }, travelHours: '00:00', day: 'Sunday', checked: false },
  //   { id: '1', date: '02/12/2020', logIn: '00:00', lunchStart: '00:00', lunchEnd: '00:00', logOut: '00:00', workingHours: { hours: 0, minutes: 0 }, travelHours: '00:00', day: 'Monday', checked: false },
  //   { id: '2', date: '02/13/2020', logIn: '00:00', lunchStart: '00:00', lunchEnd: '00:00', logOut: '00:00', workingHours: { hours: 0, minutes: 0 }, travelHours: '00:00', day: 'Tuesday', checked: false },
  //   { id: '3', date: '02/14/2020', logIn: '00:00', lunchStart: '00:00', lunchEnd: '00:00', logOut: '00:00', workingHours: { hours: 0, minutes: 0 }, travelHours: '00:00', day: 'Wednesday', checked: false },
  //   { id: '4', date: '02/15/2020', logIn: '00:00', lunchStart: '00:00', lunchEnd: '00:00', logOut: '00:00', workingHours: { hours: 0, minutes: 0 }, travelHours: '00:00', day: 'Thursday', checked: false },
  //   { id: '5', date: '02/16/2020', logIn: '00:00', lunchStart: '00:00', lunchEnd: '00:00', logOut: '00:00', workingHours: { hours: 0, minutes: 0 }, travelHours: '00:00', day: 'Friday', checked: false },
  // ];

  @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }


  constructor(private route: ActivatedRoute, private router: Router, public _timeSheetService: TimeSheetService) {
    // this.datesOfWeek = this.router.getCurrentNavigation().extras.state.datesOfTheWeek;
    // this.instructorId = this.router.getCurrentNavigation().extras.state.instructorId;
    this.dataSource = new MatTableDataSource<any>();

    this.route.queryParams.subscribe(params => {
      console.log('Query Params=>', params);
      this.datesOfWeek = params.datesOfTheWeek;
      this.instructorId = params.instructorId;
    });
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (this.currentUser.userRole == 'admin') this.displayTitle = false;
    if (this.currentUser.userRole == 'instructor') this.displayMsg = false; else this.displayMsg = true;

    // this.loading = true;
    console.log("**ON INIT**", this.datesOfWeek)
    if (this.datesOfWeek) {
      this.getDays();
      this.getValuesUsingDates();
    }
    else if (this.doGetWeekDates) {
      console.log("**On init this.instructorId", this.instructorId);
      this.instructorId = this.instFromAdminReport;
      this.displayMsg = false;
      // this.selectedDate = moment().format("MM/DD/YYYY")
      this.getWeekDates();
    }
    else {
      console.log("-----CALLED FROM ADMIN REPORT-----");
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loading = true
    console.log("Something changed", changes);
    console.log("Something changed ADMINlOGS", changes.logsFromAdmin);
    if (changes.instFromAdminReport) {
      this.instructorId = changes.instFromAdminReport.currentValue
      this.dataSource = new MatTableDataSource()
      // this.loading = true;
      this.getValuesUsingDates()
    }
    else if (changes.logsFromAdmin && changes.logsFromAdmin.currentValue != 'noData') {
      this.displayMsg = false
      this.displayNoDataMsg = false
      this.Days = changes.logsFromAdmin.currentValue
      this.updateData(changes.logsFromAdmin.currentValue)
      this.totalWorkingHours();
    }
    else if (changes.logsFromAdmin && changes.logsFromAdmin.currentValue == 'noData') {
      this.loading = false
      this.displayNoDataMsg = true
      this.displayMsg = false;
    };
    if (changes.overTimeHours) this.overTimeHours = changes.overTimeHours.currentValue;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  getWeekDates() {
    console.log("-----getWeekDates-----", moment().startOf('week'), moment().endOf('week'));
    let weekStartDate = moment().startOf('week')
    let weekEndDate = moment().endOf('week')
    let dates = []
    // // return new Promise((resolve,reject)=>{
    dates.push(weekStartDate.format('MM/DD/YYYY'))
    return new Promise((resolve, reject) => {
      while (weekStartDate.add(1, 'days').diff(weekEndDate) < 0) {
        console.log("In while loop");
        console.log(weekStartDate.toDate());
        dates.push(weekStartDate.clone().format('MM/DD/YYYY'));
      }
      resolve(dates)
      this.datesOfWeek = dates;

      console.log(" AFTER WHILE **dates", dates);
      // })
    }).then((resolvedArray) => {
      this.getValuesUsingDates()
    })

  }

  getDays() {
    this.updateData(this.Days);
  }

  updateData(weekDays) {
    console.log("UPDATING DATA = ", weekDays)
    this.dataSource = new MatTableDataSource(weekDays);
    this.dataSource.paginator = this.paginator;
    console.log("SETTING paginator TO = ", this.dataSource.paginator)
    this.loading = false
  }


  timeChanged(event, index) {
    this.currentTime = event;
  }
  eventFromTimePicker(event) {
    console.log("eventFromTimePicker($event)", event);
  }

  closed(index) {
    console.log('Closed Function', this.Days[index]);
    if (this.Days[index].logIn != '00:00' && this.Days[index].lunchStart != '00:00' && this.Days[index].lunchEnd != '00:00' && this.Days[index].logOut != '00:00') {
      var diff1 = this.calculateDiff1(index)
      var diff2 = this.calculateDiff2(index)
      let hoursWorking = diff1.hours + diff2.hours
      console.log("-----hoursWorking-----", hoursWorking);
      let totalMinute = diff1.minutes + diff2.minutes
      console.log("-----totalMinute-----", totalMinute);
      if (totalMinute > 60) {
        // tempWeeklyHours = tempWeeklyHours + Math.floor(tempWeeklyMinutes / 60)
        // tempWeeklyMinutes = tempWeeklyMinutes % 60
        totalMinute = totalMinute % 60;
        console.log("-----total Minutes----", totalMinute);
        console.log("-----total Minutes/60----", totalMinute / 60);
        console.log("--IN IF--totalMinute", totalMinute);
        hoursWorking = hoursWorking + Math.floor(totalMinute / 60)
        console.log("--IN IF--hoursWorking", hoursWorking);
        this.Days[index].workingHours.hours = hoursWorking;
        this.Days[index].workingHours.minutes = totalMinute;
      }
      else if (totalMinute == 60) {
        this.Days[index].workingHours.hours = hoursWorking + 1;
        this.Days[index].workingHours.minutes = totalMinute - 60;
      }
      else {
        this.Days[index].workingHours.hours = hoursWorking;
        this.Days[index].workingHours.minutes = totalMinute;
      }
      this.totalWorkingHours();
    }
    else if (this.Days[index].logIn != '00:00' && this.Days[index].lunchStart != '00:00') {
      var diff1 = this.calculateDiff1(index)
      let hoursWorking = diff1.hours
      let totalMinute = diff1.minutes
      console.log("hoursWorking else ", diff1)
      if (totalMinute > 59) {
        // totalMinute = totalMinute - 60;
        // hoursWorking = hoursWorking + 1
        totalMinute = totalMinute % 60;
        console.log("--IN ELSE IF--totalMinute", totalMinute);
        hoursWorking = hoursWorking + Math.floor(totalMinute / 60)
        console.log("--IN ELSE IF--hoursWorking", hoursWorking);

        this.Days[index].workingHours.hours = hoursWorking;
        this.Days[index].workingHours.minutes = totalMinute;
      }
      else if (totalMinute == 60) {
        this.Days[index].workingHours.hours = hoursWorking + 1;
        this.Days[index].workingHours.minutes = totalMinute - 60;
      }
      else {
        this.Days[index].workingHours.hours = hoursWorking;
        this.Days[index].workingHours.minutes = totalMinute;
      }
      this.totalWorkingHours();
    }
    else if (this.Days[index].lunchEnd != '00:00' && this.Days[index].logOut != '00:00') {
      var diff2 = this.calculateDiff2(index)
      let hoursWorking = diff2.hours
      let totalMinute = diff2.minutes
      console.log(" hoursWorking else ", hoursWorking)
      if (totalMinute > 59) {
        // totalMinute = totalMinute - 60;
        // hoursWorking = hoursWorking + 1
        totalMinute = totalMinute % 60;
        console.log("**IN else IF**totalMinute", totalMinute);
        hoursWorking = hoursWorking + Math.floor(totalMinute / 60)
        console.log("**IN else IF**hoursWorking", hoursWorking);

        this.Days[index].workingHours.hours = hoursWorking;
        this.Days[index].workingHours.minutes = totalMinute;

      } else if (totalMinute == 60) {
        this.Days[index].workingHours.hours = hoursWorking + 1;
        this.Days[index].workingHours.minutes = totalMinute - 60;
      }
      else {
        this.Days[index].workingHours.hours = hoursWorking;
        this.Days[index].workingHours.minutes = totalMinute;
      }
      this.totalWorkingHours();
    }
  }

  totalWeekHours(index) {
    console.log('Calculating Total Week Hours');
  }

  travelPlusWork(event, index) {
    // console.log("index", index, "event", event);
    // console.log("this.Days[index]", this.Days[index]);
    // let travel, totalHr, totalMin;
    // travel = this.Days[index].travel.split(":")
    // totalHr = this.Days[index].workingHours.hours + Number(travel[0])
    // totalMin = this.Days[index].workingHours.minutes + Number(travel[1])
    // if (totalMin > 60) {
    //   // totalMinute = totalMinute % 60;
    //   // console.log("--IN ELSE IF--totalMinute", totalMinute);
    //   // hoursWorking = hoursWorking + Math.floor(totalMinute / 60)
    //   // console.log("--IN ELSE IF--hoursWorking", hoursWorking);
    //   // totalMin = totalMin - 60;
    //   // totalHr = totalHr + 1
    //   totalHr = totalHr + Math.floor(totalMin / 60)
    //   totalMin = totalMin % 60
    //   this.Days[index].totalHours.hours = totalHr;
    //   this.Days[index].totalHours.minutes = totalMin;
    // }
    // else if (totalMin == 60) {
    //   this.Days[index].totalHours.hours = totalHr + 1;
    //   this.Days[index].totalHours.minutes = totalMin - 60;
    // }
    // else {
    //   this.Days[index].totalHours.hours = totalHr;
    //   this.Days[index].totalHours.minutes = totalMin;
    // }
    // console.log("this.Days[index]", this.Days[index]);
  }

  calculateTravelPlusWorkHours(index) {
    let travel, totalHr, totalMin;
    travel = this.Days[index].travel.split(":")
    totalHr = this.Days[index].workingHours.hours + Number(travel[0])
    totalMin = this.Days[index].workingHours.minutes + Number(travel[1])
    if (totalMin > 59) {
      // totalMin = totalMin - 60;
      // totalHr = totalHr + 1
      totalHr = totalHr + Math.floor(totalMin / 60)
      totalMin = totalMin % 60
      this.Days[index].totalHours.hours = totalHr;
      return totalHr;
    } else if (totalMin == 60) {
      totalHr = totalHr + 1
      totalMin = totalMin - 60
      this.Days[index].totalHours.hours = totalHr;
      return totalHr;
    }
    else {
      this.Days[index].totalHours.hours = totalHr;
      return totalHr;
    }
  }

  calculateOverTimeHours() {
    var totalH = 0;
    _.forEach(this.Days, (day) => {
      if (day.workingHours.hours > 12) {
        totalH = totalH + day.workingHours.hours - 12
      }
      this.overH = totalH;
    })
    return this.overH;
  }

  calculateOverTimeMinutes() {
    var totalH = 0;
    var totalM = 0;
    _.forEach(this.Days, (day) => {
      if (day.workingHours.hours > 12) {
        totalM = totalM + day.workingHours.minutes
      }
    })

    if (totalM > 59) {
      totalH = totalH + Math.floor(totalM / 60)
      totalM = totalM % 60
      return totalM;
    } else if (totalM == 60) {
      this.overH = this.overH + 1
      totalM = totalM - 60
      this.overM = totalM;
      return this.overM;
    }
    else {
      this.overM = totalM;
      return this.overM;
    }


    return totalM;
  }

  calculateTravelPlusWorkMinutes(index) {
    let travel, totalHr, totalMin;
    travel = this.Days[index].travel.split(":")
    totalHr = this.Days[index].workingHours.hours + Number(travel[0])
    totalMin = this.Days[index].workingHours.minutes + Number(travel[1])
    if (totalMin > 59) {
      // totalMin = totalMin - 60;
      // totalHr = totalHr + 1
      totalHr = totalHr + Math.floor(totalMin / 60)
      totalMin = totalMin % 60
      this.Days[index].totalHours.minutes = totalMin;
      return totalMin;
    }
    else if (totalMin == 60) {
      totalHr = totalHr + 1
      totalMin = totalMin - 60
      this.Days[index].totalHours.minutes = totalMin;
      return totalMin;
    }
    else {
      this.Days[index].totalHours.minutes = totalMin;
      return totalMin;
    }
  }

  totalWorkingHours() {
    console.log("this.Days", this.Days);
    console.log('call After Api call');
    var totalH = 0;
    var totalM = 0;
    _.forEach(this.Days, (day) => {
      totalH = totalH + day.workingHours.hours;
      console.log("totalH", totalH);
      totalM = totalM + day.workingHours.minutes;
      console.log("totalM", totalM);
    })
    if (totalM > 59) {
      totalH = totalH + Math.floor(totalM / 60)
      totalM = totalM % 60
      this.totalHoursWorked.hours = totalH;
      this.totalHoursWorked.minutes = totalM;
    } else if (totalM == 60) {
      this.totalHoursWorked.hours = totalH + 1;
      this.totalHoursWorked.minutes = totalM - 60
    }
    else {
      this.totalHoursWorked.hours = totalH;
      this.totalHoursWorked.minutes = totalM;
    }
    console.log('This.totalHoursWorked', this.totalHoursWorked);
  }

  calculateWorkHours(index) {
    var date2 = moment(this.Days[index].date).format('MM/DD/YYYY');
  }

  calculateDiff1 = (index) => {
    console.log("CalculateDiff 1");
    var startTime = this.Days[index].logIn;
    var startHours = startTime.split(":")[0]
    var startMinutes = startTime.split(":")[1]
    var endTime = this.Days[index].lunchStart;
    var endHours = endTime.split(":")[0]
    var endMinutes = endTime.split(":")[1]
    var date = moment(this.Days[index].date);
    var time1: any = new Date(date.toDate().setHours(startHours, startMinutes)) //new Date(date + ' ' + startTime + ':00 GMT+0000');
    var time2: any = new Date(date.toDate().setHours(endHours, endMinutes))//new Date(date + ' ' + endTime + ':00 GMT+0000');
    var difference = (time2 - time1) / 60000;
    console.log("Difference", difference);
    var minutes = difference % 60;
    console.log("minutes", minutes);
    var hours = (difference - minutes) / 60;
    console.log("hours", hours);
    return ({ hours: hours, minutes: minutes })
  }

  calculateDiff2 = (index) => {
    console.log("CalculateDiff 2");
    var startTime = this.Days[index].lunchEnd;
    var startHours = startTime.split(":")[0]
    var startMinutes = startTime.split(":")[1]
    var endTime = this.Days[index].logOut;
    var endHours = endTime.split(":")[0]
    var endMinutes = endTime.split(":")[1]
    var date = moment(this.Days[index].date);
    var time1: any = new Date(date.toDate().setHours(startHours, startMinutes));
    console.log("--time 1--", time1);
    var time2: any = new Date(date.toDate().setHours(endHours, endMinutes));
    console.log("--time 2--", time2);
    var difference = (time2 - time1) / 60000;
    var minutes = difference % 60;
    console.log("minutes", minutes);
    var hours = (difference - minutes) / 60;
    console.log("hours", hours);
    return ({ hours: hours, minutes: minutes })
  }

  copyPreviousLogs(i) {
    console.log("**this.dataSource", this.dataSource.data[i])
    console.log("**this.Days", this.Days[i]);
    let newData = this.Days[i]
    let previousData = this.Days[i - 1]
    newData.logIn = previousData.logIn
    newData.logOut = previousData.logOut
    newData.lunchEnd = previousData.lunchEnd
    newData.lunchStart = previousData.lunchStart
    // newData.totalHours = previousData.totalHours
    newData.travel = previousData.travel
    // newData.workingHours = previousData.workingHours
    this.closed(i)
    // this.totalWorkingHours();
    this.updateData(this.Days)
    // this.dataSource
    // logIn: "08:00"
    // logOut: "21:00"
    // lunchEnd: "14:30"
    // lunchStart: "13:30"
    // totalHours: { hours: 14, minutes: 0 }
    // travel: "02:00"
    // updatedAt: "2020-02-21T08:00:05.324Z"
    // workingHours: { hours: 12, minutes: 0 }
  }

  getValuesUsingDates() {
    console.log('Get Values Using Dates');
    let data = {
      date: this.datesOfWeek,
      instructorId: this.instructorId
    }
    if (data.date && data.instructorId) {
      this._timeSheetService.getTimeLogUsingDates(data).subscribe(res => {
        console.log('Inside Res=======>>>>', res);
        this.arrayFromDb = res;
        // console.log('Arrayform db', this.arrayFromDb);
        this.mergeAndCompareBothArrays();
      }, error => {

      })
    }
  }

  mergeAndCompareBothArrays() {
    var filterDates;
    filterDates = this.datesOfWeek.filter(o => !this.arrayFromDb.find(o2 => o === o2.date))
    // console.log('Fiter Dates===>>>>', filterDates);
    _.forEach((filterDates), (singleDate, index) => {
      let newObj;
      newObj = {
        date: singleDate,
        _id: 'new',
        logIn: '00:00',
        lunchStart: '00:00',
        lunchEnd: '00:00',
        logOut: '00:00',
        workingHours: {
          hours: 0,
          minutes: 0,
        },
        travel: '00:00',
        totalHours: {
          hours: 0,
          minutes: 0,
        }
      }
      this.arrayFromDb.push(newObj);
    })

    this.Days = this.arrayFromDb;
    this.updateData(this.Days);
    this.totalWorkingHours();
  }

  submitDetail() {
    _.forEach((this.Days), (singleDate, index) => {
      if ((singleDate.logIn != '00:00' && singleDate.lunchStart != '00:00') || (singleDate.lunchEnd != '00:00' && singleDate.logOut != '00:00')) {
        this.finalArray.push(singleDate);
      }
    })
    let data = {
      date: this.finalArray,
      instructorId: this.instructorId
    }
    // console.log('finalArray===========>>>>>>', this.finalArray);
    this._timeSheetService.addTime(data).subscribe((res) => {
    }, err => {

    })
  }

  checkTotalWorkHour(hours) {
    if (hours > 12) {
      return 'break';
    } else {
      return 'ok';
    }
  }

  checkTravelPlusWorkHour(index) {

    let travel, totalHr, totalMin;
    travel = this.Days[index].travel.split(":")
    totalHr = this.Days[index].workingHours.hours + Number(travel[0])
    totalMin = this.Days[index].workingHours.minutes + Number(travel[1])
    if (totalHr < 14) {
      return 'ok';
    } else {
      return 'break';
    }
  }

  checkTotalWorkingHours(hours) {
    // console.log('Check Total Working Hours===>>>', hours);
    if (hours > 72) {
      return 'break';
    } else {
      return 'ok';
    }
  }

  getInstructorTimeLogs(datesArray, instructorId) {
    let data = {
      date: datesArray,
      instructorId: instructorId
    }
    console.log("****data", data);
    if (data.date) {
      console.log("data.date is found", data.date);
      this._timeSheetService.getTimeLogUsingDates(data).subscribe(res => {
        console.log('Res========>>>>>', res);
        this.updateData(res)
      }, err => {
      })
    }

  }

}
