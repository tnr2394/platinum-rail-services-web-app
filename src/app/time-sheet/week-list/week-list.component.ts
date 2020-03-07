import { Component, OnInit } from '@angular/core';
import { SlideInOutAnimation } from './animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { Router } from '@angular/router';
import { TimeSheetService } from 'src/app/services/time-sheet.service';

const moment = extendMoment(Moment);


@Component({
  selector: 'app-week-list',
  templateUrl: './week-list.component.html',
  styleUrls: ['./week-list.component.scss'],
  animations: [SlideInOutAnimation]
})
export class WeekListComponent implements OnInit {

  months = [{ id: '0', name: 'January' }, { id: '1', name: 'February' }, { id: '2', name: 'March' }, { id: '3', name: 'April' }, { id: '4', name: 'May' }, { id: '5', name: 'June' },
  { id: '6', name: 'July' }, { id: '7', name: 'August' }, { id: '8', name: 'September' }, { id: '9', name: 'October' }, { id: '10', name: 'November' }, { id: '11', name: 'December' }]

  animationState = 'out';
  testId: any;
  show: Boolean = false;
  index;
  loading: Boolean = false;
  dateOfWeek = [];
  allWeeks = [];
  hideme = [];
  lastColor: number;
  bgColors: string[];
  panelOpenState = false;
  step: number;
  currentUser;
  instructorId;
  instByAdmin: any;

  constructor(private router: Router, private _timeSheetService: TimeSheetService) {
    this.bgColors = ["bg-info", "bg-success", "bg-warning", "bg-primary", "bg-danger"];
    if (this.router.getCurrentNavigation().extras.state) this.instByAdmin = this.router.getCurrentNavigation().extras.state.instructor;
    // if (this.router.getCurrentNavigation().extras.state.instructor) console.log(this.router.getCurrentNavigation().extras.state.instructor);
  }

  ngOnInit() {
    if (this.instByAdmin != undefined) {
      this.instructorId = this.instByAdmin
      console.log("this.instructorId", this.instructorId);
    }
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (this.currentUser.userRole == 'instructor') this.instructorId = this.currentUser._id
  }

  showWeeks(month, i) {
    this.step = i;
    return new Promise((resolve, reject) => {
      this.allWeeks = [];
      let year = moment().year()
      let startDate = moment.utc([year, month])
      let monthStart = moment(startDate).startOf('month')
      let monthEnd = moment(startDate).endOf('month')

      let monthStartWeekNumber = moment(monthStart).isoWeek()
      let monthEndWeekNumber = moment(monthEnd).isoWeek()
      console.log("monthStartWeekNumber", monthStartWeekNumber, "monthEndWeekNumber", monthEndWeekNumber);
      if (monthEndWeekNumber == 1) monthEndWeekNumber = 52

      for (let i = monthStartWeekNumber; i <= monthEndWeekNumber; i++) {
        console.log("in loop", i);
        let weekStartDate = moment().startOf('isoWeek').isoWeek(i);
        if (i == 1 && weekStartDate < moment().startOf('year')) weekStartDate = moment().startOf('year');
        // let weekEndDate = moment('2020').startOf('week').day('Saturday').week(i);
        let weekEndDate = moment().endOf('isoWeek').isoWeek(i);
        // console.log("weekEndDate", weekEndDate.date(), weekEndDate.month());
        if (weekEndDate > moment().endOf('year')) {
          // console.log("weekEndDate > moment().endOf('year')", weekEndDate, moment().endOf('year'));
          weekEndDate = moment().endOf('year')
        }
        this.allWeeks.push({ weekNumber: i, weekStartDate: weekStartDate, weekEndDate: weekEndDate })
        console.log("weekNumber: i", i, "weekStartDate", weekStartDate, "weekEndDate", weekEndDate);
      }
      this.show = true;
      console.log("$$allWeeks", this.allWeeks);
      resolve(this.allWeeks)
    }).then((resolvedAllWeeks) => {
      console.log("---resolvedAllWeeks-- in AFTER FOR LOOP", resolvedAllWeeks);
      this.getStatus(resolvedAllWeeks).then((resolvedWeeks) => {
        console.log("$$resolvedWeeks-----", resolvedWeeks);
      })
    })
    // this.index = i;
  }
  getWeekDates(week) {
    console.log("-----getWeekDates-----", week);
    let dates = []
    // return new Promise((resolve,reject)=>{
    dates.push(week.weekStartDate.format('MM/DD/YYYY'))
    return new Promise((resolve, reject) => {
      while (week.weekStartDate.add(1, 'days').diff(week.weekEndDate) < 0) {
        console.log("In while loop");
        console.log(week.weekStartDate.toDate());
        dates.push(week.weekStartDate.clone().format('MM/DD/YYYY'));
      }
      resolve(dates)
    })
    console.log(" AFTER WHILE **dates", dates);
    // resolve(dates)
    // })
    // console.log("*****dates:", dates);
    // this.router.navigate(['action-selection'], { state: { example: 'bar' } });
    // this.router.navigate(['single-week'], { state: { datesOfTheWeek: dates } })
  }
  getStatus(weeks) {
    this.loading = true;
    console.log("-----getStatus-----", weeks);
    return new Promise((resolve, reject) => {
      let tempdatesArrayResolved = []
      weeks.forEach((singleWeek) => {
        console.log("singleWeek", singleWeek);
        this.getWeekDates(singleWeek).then((datesArrayResolved: any) => {
          // tempdatesArrayResolved = datesArrayResolved
          console.log("datesArrayResolved", datesArrayResolved);
          // console.log("-------datesArrayResolved---------", datesArrayResolved);
          singleWeek['datesOfTheWeek'] = datesArrayResolved;
          singleWeek.weekStart = datesArrayResolved[0]
          singleWeek.weekEnd = datesArrayResolved[datesArrayResolved.length - 1]
          //       console.log("datesOfTheWeek", singleWeek.datesOfTheWeek);

          this._timeSheetService.getWeeklyStatus({ date: datesArrayResolved, instructorId: this.instructorId }).subscribe((statusResponse) => {
            //   console.log("-----statusResponse-----",statusResponse.finalStatus );
            this.loading = false;
            singleWeek['status'] = statusResponse.finalStatus;
            //   console.log("-----weeklySTATUS of-----", singleWeek.weekNumber, singleWeek.status, singleWeek.datesOfTheWeek );
            // console.log("-----statusResponse-----",statusResponse.finalStatus );
            // singleWeek['status'] = statusResponse.finalStatus;
            singleWeek['breakBtnTurnsStatus'] = statusResponse.breakBtnTurnsStatus
            singleWeek['last13Status'] = statusResponse.last13Status
            singleWeek['travelHrsStatus'] = statusResponse.travelHrsStatus
            singleWeek['weekHrs'] = statusResponse.weekHrs
            singleWeek['workingHrsStatus'] = statusResponse.workingHrsStatus
            console.log("-----weeklySTATUS of-----", singleWeek);
          })
        })
        resolve(weeks)
      })
      //   console.log("after API call", weeks);

    })
  }
  singleWeek(week) {
    // let dates = []
    // dates.push(week.weekStartDate.format('MM/DD/YYYY'))
    // while (week.weekStartDate.add(1, 'days').diff(week.weekEndDate) < 0) {
    //   console.log(week.weekStartDate.toDate());
    //   dates.push(week.weekStartDate.clone().format('MM/DD/YYYY'));
    // }
    // console.log("*****dates:", dates);
    // this.router.navigate(['action-selection'], { state: { example: 'bar' } });
    console.log("ALL DATES ARRAY", week.datesOfTheWeek);

    console.log("this.instructorId====>>>>>", this.instructorId);

    // this.router.navigate(['single-week'], { state: { datesOfTheWeek: week.datesOfTheWeek, instructorId: this.instructorId } })

    this.router.navigate(['single-week'], { queryParams: { datesOfTheWeek: week.datesOfTheWeek, instructorId: this.instructorId } })

  }
  getRandomColorClass(i) {
    var rand = Math.floor(Math.random() * this.bgColors.length);
    rand = i % 5;
    this.lastColor = rand;
    return this.bgColors[rand];
  }
  panelClosed(event) {
    console.log("event", event);
  }
  // setStep(index: number) {
  //   this.step = index;
  // }

}
