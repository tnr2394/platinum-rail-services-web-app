import { Component, OnInit } from '@angular/core';
import { SlideInOutAnimation } from './animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { Router } from '@angular/router';

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
  dateOfWeek = [];
  allWeeks = [];
  hideme = [];
  lastColor: number;
  bgColors: string[];
  panelOpenState = false;
  step: number;

  constructor(private router: Router) {
    this.bgColors = ["bg-info", "bg-success", "bg-warning", "bg-primary", "bg-danger"];
    // if (this.router.getCurrentNavigation().extras.state.instructor) console.log(this.router.getCurrentNavigation().extras.state.instructor);
   }

  ngOnInit() {

  }

  showWeeks(month, i) {
    this.step = i;
    // this.index = i;

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
      if (i == 1 && weekStartDate < moment().startOf('year')) weekStartDate = moment().startOf('year')
      // let weekEndDate = moment('2020').startOf('week').day('Saturday').week(i);
      let weekEndDate = moment().endOf('isoWeek').isoWeek(i);
      console.log("weekEndDate", weekEndDate.date(), weekEndDate.month());
      if (weekEndDate > moment().endOf('year')) {
        console.log("weekEndDate > moment().endOf('year')", weekEndDate, moment().endOf('year'));
        weekEndDate = moment().endOf('year')
      }
      this.allWeeks.push({ weekNumber: i, weekStartDate: weekStartDate, weekEndDate: weekEndDate })
    }
    this.show = true;
    console.log("allWeeks", this.allWeeks);
  }
  getWeekDates(week) {
    let dates = []
    dates.push(week.weekStartDate.format('MM/DD/YYYY'))
    while (week.weekStartDate.add(1, 'days').diff(week.weekEndDate) < 0) {
      console.log(week.weekStartDate.toDate());
      dates.push(week.weekStartDate.clone().format('MM/DD/YYYY'));
    }
    console.log("*****dates:", dates);
    // this.router.navigate(['action-selection'], { state: { example: 'bar' } });
    this.router.navigate(['single-week'], { state: { datesOfTheWeek: dates } })
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
