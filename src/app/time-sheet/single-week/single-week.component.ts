import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
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




  // Days = [
  //   { id: '0', date: '02/11/2020', logIn: '00:00', lunchStart: '00:00', lunchEnd: '00:00', logOut: '00:00', workingHours: { hours: 0, minutes: 0 }, travelHours: '00:00', day: 'Sunday', checked: false },
  //   { id: '1', date: '02/12/2020', logIn: '00:00', lunchStart: '00:00', lunchEnd: '00:00', logOut: '00:00', workingHours: { hours: 0, minutes: 0 }, travelHours: '00:00', day: 'Monday', checked: false },
  //   { id: '2', date: '02/13/2020', logIn: '00:00', lunchStart: '00:00', lunchEnd: '00:00', logOut: '00:00', workingHours: { hours: 0, minutes: 0 }, travelHours: '00:00', day: 'Tuesday', checked: false },
  //   { id: '3', date: '02/14/2020', logIn: '00:00', lunchStart: '00:00', lunchEnd: '00:00', logOut: '00:00', workingHours: { hours: 0, minutes: 0 }, travelHours: '00:00', day: 'Wednesday', checked: false },
  //   { id: '4', date: '02/15/2020', logIn: '00:00', lunchStart: '00:00', lunchEnd: '00:00', logOut: '00:00', workingHours: { hours: 0, minutes: 0 }, travelHours: '00:00', day: 'Thursday', checked: false },
  //   { id: '5', date: '02/16/2020', logIn: '00:00', lunchStart: '00:00', lunchEnd: '00:00', logOut: '00:00', workingHours: { hours: 0, minutes: 0 }, travelHours: '00:00', day: 'Friday', checked: false },
  // ];



  constructor(private router: Router, public _timeSheetService: TimeSheetService) {
    this.datesOfWeek = this.router.getCurrentNavigation().extras.state.datesOfTheWeek;
  }

  ngOnInit() {
    this.getDays();
    this.getValuesUsingDates();
  }

  getDays() {
    this.updateData(this.Days);
  }

  updateData(weekDays) {
    console.log("UPDATING DATA = ", weekDays)
    this.dataSource = new MatTableDataSource(weekDays);
    this.dataSource.paginator = this.paginator;
    console.log("SETTING paginator TO = ", this.dataSource.paginator)
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
      let totalMinute = diff1.minutes + diff1.minutes
      if (totalMinute > 59) {
        totalMinute = totalMinute - 60;
        hoursWorking = hoursWorking + 1
        this.Days[index].workingHours.hours = hoursWorking;
        this.Days[index].workingHours.minutes = totalMinute;
      } else {
        this.Days[index].workingHours.hours = hoursWorking;
        this.Days[index].workingHours.minutes = totalMinute;
      }
      this.totalWorkingHours();
    }
    else if (this.Days[index].logIn != '00:00' && this.Days[index].lunchStart != '00:00') {
      var diff1 = this.calculateDiff1(index)
      let hoursWorking = diff1.hours
      let totalMinute = diff1.minutes
      console.log(" hoursWorking else ", diff1)
      if (totalMinute > 59) {
        totalMinute = totalMinute - 60;
        hoursWorking = hoursWorking + 1
        this.Days[index].workingHours.hours = hoursWorking;
        this.Days[index].workingHours.minutes = totalMinute;
      } else {
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
        totalMinute = totalMinute - 60;
        hoursWorking = hoursWorking + 1
        this.Days[index].workingHours.hours = hoursWorking;
        this.Days[index].workingHours.minutes = totalMinute;

      } else {
        this.Days[index].workingHours.hours = hoursWorking;
        this.Days[index].workingHours.minutes = totalMinute;
      }
      this.totalWorkingHours();
    }
  }

  totalWeekHours(index) {
    console.log('Calculating Total Week Hours');
  }

  travelPlusWork(index) {
    let travel, totalHr, totalMin;
    travel = this.Days[index].travel.split(":")
    totalHr = this.Days[index].workingHours.hours + Number(travel[0])
    totalMin = this.Days[index].workingHours.minutes + Number(travel[1])
    if (totalMin > 59) {
      totalMin = totalMin - 60;
      totalHr = totalHr + 1
      this.Days[index].totalHours.hours = totalHr;
      this.Days[index].totalHours.minutes = totalMin;
    } else {
      this.Days[index].totalHours.hours = totalHr;
      this.Days[index].totalHours.minutes = totalMin;
    }
  }

  calculateTravelPlusWorkHours(index) {
    let travel, totalHr, totalMin;
    travel = this.Days[index].travel.split(":")
    totalHr = this.Days[index].workingHours.hours + Number(travel[0])
    totalMin = this.Days[index].workingHours.minutes + Number(travel[1])
    if (totalMin > 59) {
      totalMin = totalMin - 60;
      totalHr = totalHr + 1
      return totalHr;
    } else {
      return totalHr;
    }
  }

  calculateTravelPlusWorkMinutes(index) {
    let travel, totalHr, totalMin;
    travel = this.Days[index].travel.split(":")
    totalHr = this.Days[index].workingHours.hours + Number(travel[0])
    totalMin = this.Days[index].workingHours.minutes + Number(travel[1])
    if (totalMin > 59) {
      totalMin = totalMin - 60;
      totalHr = totalHr + 1
      return totalMin;
    } else {
      return totalMin;
    }
  }

  totalWorkingHours() {
    var totalH = 0;
    var totalM = 0;
    _.forEach(this.Days, (day) => {
      totalH = totalH + day.workingHours.hours;
      totalM = totalM + day.workingHours.minutes;
    })
    if (totalM > 59) {
      this.totalHoursWorked.hours = totalH + 1;
      this.totalHoursWorked.minutes = totalM - 60;
    } else {
      this.totalHoursWorked.hours = totalH;
      this.totalHoursWorked.minutes = totalM;
    }
    console.log('This.totalHoursWorked', this.totalHoursWorked);
  }

  calculateWorkHours(index) {
    var date2 = moment(this.Days[index].date).format('MM/DD/YYYY');
  }

  calculateDiff1 = (index) => {
    var startTime = this.Days[index].logIn;
    var endTime = this.Days[index].lunchStart;
    var date = moment(this.Days[index].date).format('MM/DD/YYYY');
    var time1: any = new Date(date + ' ' + startTime + ':00 GMT+0000');
    var time2: any = new Date(date + ' ' + endTime + ':00 GMT+0000');
    var difference = (time2 - time1) / 60000;
    var minutes = difference % 60;
    var hours = (difference - minutes) / 60;
    return ({ hours: hours, minutes: minutes })
  }

  calculateDiff2 = (index) => {
    var startTime = this.Days[index].lunchEnd;
    var endTime = this.Days[index].logOut;
    var date = moment(this.Days[index].date).format('MM/DD/YYYY');
    var time1: any = new Date(date + ' ' + startTime + ':00 GMT+0000');
    var time2: any = new Date(date + ' ' + endTime + ':00 GMT+0000');
    var difference = (time2 - time1) / 60000;
    var minutes = difference % 60;
    var hours = (difference - minutes) / 60;
    return ({ hours: hours, minutes: minutes })
  }


  getValuesUsingDates() {
    console.log('Get Values Using Dates');
    this._timeSheetService.getTimeLogUsingDates(this.datesOfWeek).subscribe(res => {
      console.log('Inside Res=======>>>>', res);
      this.arrayFromDb = res;
      console.log('Arrayform db', this.arrayFromDb);
      this.mergeAndCompareBothArrays();
    }, error => {

    })
  }

  mergeAndCompareBothArrays() {
    var filterDates;
    filterDates = this.datesOfWeek.filter(o => !this.arrayFromDb.find(o2 => o === o2.date))
    console.log('Fiter Dates===>>>>', filterDates);
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

    console.log('finalArray===========>>>>>>', this.finalArray);
    this._timeSheetService.addTime(this.finalArray).subscribe((res) => {
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
    console.log('Check Total Working Hours===>>>', hours);
    if (hours > 72) {
      return 'break';
    } else {
      return 'ok';
    }
  }

}
