import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';



@Component({
  selector: 'app-single-week',
  templateUrl: './single-week.component.html',
  styleUrls: ['./single-week.component.scss']
})
export class SingleWeekComponent implements OnInit {

  pageSizeOptions: number[] = [5, 10, 25, 100];
  jobId;
  displayedColumns: string[] = ['date', 'logIn', 'lunchStart', 'lunchEnd', 'logOut', 'hoursWorked'];
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  currentTime;


  Days = [
    { id: '0', date: '11/02/2020', logIn: '00:00', lunchStart: '00:00', lunchEnd: '00:00', logOut: '00:00', workingHours: '00:00', day: 'Sunday', checked: false },
    { id: '1', date: '12/02/2020', logIn: '00:00', lunchStart: '00:00', lunchEnd: '00:00', logOut: '00:00', workingHours: '00:00', day: 'Monday', checked: false },
    { id: '2', date: '13/02/2020', logIn: '00:00', lunchStart: '00:00', lunchEnd: '00:00', logOut: '00:00', workingHours: '00:00', day: 'Tuesday', checked: false },
    { id: '3', date: '14/02/2020', logIn: '00:00', lunchStart: '00:00', lunchEnd: '00:00', logOut: '00:00', workingHours: '00:00', day: 'Wednesday', checked: false },
    { id: '4', date: '15/02/2020', logIn: '00:00', lunchStart: '00:00', lunchEnd: '00:00', logOut: '00:00', workingHours: '00:00', day: 'Thursday', checked: false },
    { id: '5', date: '16/02/2020', logIn: '00:00', lunchStart: '00:00', lunchEnd: '00:00', logOut: '00:00', workingHours: '00:00', day: 'Friday', checked: false },
    { id: '6', date: '17/02/2020', logIn: '00:00', lunchStart: '00:00', lunchEnd: '00:00', logOut: '00:00', workingHours: '00:00', day: 'Saturday', checked: false }
  ];



  constructor(private router: Router) { 
    console.log(this.router.getCurrentNavigation().extras.state.datesOfTheWeek);
  }

  ngOnInit() {
    this.getDays();
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
    console.log('Event::::::::::', event, index);
    this.currentTime = event;
    // this.calculateWorkHours(index);
  }
  eventFromTimePicker(event){
    console.log("eventFromTimePicker($event)", event);
  }

  closed() {
    console.log('Closed Function', this.currentTime);
  }

  totalWeekHours(index) {
    console.log('Calculating Total Week Hours');
  }

  calculateWorkHours(index) {
    console.log('Calculate DayWise Working Hours');
    console.log('Single Day Details===>>>>', this.Days[index]);
    var date2 = moment(this.Days[index].date).format('MM/DD/YYYY');

    console.log('Date==========>>>>>', date2);

    if (this.Days[index].logIn != null && this.Days[index].lunchStart != null) {
      var diff1 = this.calculateDiff(index)
    }

    // console.log('Diff1======>>>>>', diff1);
    // var diff2 = this.calculateDiff(date2, single.lunchEndTime, single.logOutTime);
    // let hoursWorking = diff1.hours + diff2.hours
    // let totalMinute = diff1.minutes + diff2.minutes
  }

  calculateDiff = (index) => {
    var startTime = this.Days[index].logIn;
    var endTime = this.Days[index].lunchStart;

    console.log('Single Day Details===>>>>', this.Days[index]);

    console.log('Start Time=====>>>', this.Days[index].logIn, startTime);

    console.log('End Time=====>>>', this.Days[index].lunchStart, endTime);

    // console.log('Inside Calculate Diff====>>', startTime, endTime)
    // var time1: any = new Date(this.Days[index].date + ' ' + time1 + ':00 GMT+0000');
    // var time2: any = new Date(this.Days[index].date + ' ' + time2 + ':00 GMT+0000');
    // var difference = (time2 - time1) / 60000;
    // var minutes = difference % 60;
    // var hours = (difference - minutes) / 60;
    // return ({ hours: hours, minutes: minutes })
  }


  getValuesUsingDates() {
    console.log('Get Values Using Dates');
  }



}
