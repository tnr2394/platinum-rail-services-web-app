import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent, MatDialog } from '@angular/material';

import { TimeSheetService } from '../../services/time-sheet.service';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

@Component({
  selector: 'app-time-sheet-summary',
  templateUrl: './time-sheet-summary.component.html',
  styleUrls: ['./time-sheet-summary.component.scss']
})
export class TimeSheetSummaryComponent implements OnInit {

  instructorId;
  loading: Boolean;
  clients: any = [];
  bgColors: string[];
  lastColor;
  length;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = ['Date', 'In', 'lunchStart', 'lunchEnd', 'Out', 'workingHours','travelHours','totalHours'];
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  selectedDate: any;

  constructor(public _timeSheetService: TimeSheetService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.selectedDate = moment().format("MM/DD/YYYY")
    this.getWeekDates();
    this.activatedRoute.params.subscribe(params => {
      this.instructorId = params['id'];
      console.log("InstructorId", this.instructorId);
    });
    // this.getInstructorTimeLogs();
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
      console.log(" AFTER WHILE **dates", dates);
    }).then((resolvedArray)=>{
      this.getInstructorTimeLogs(resolvedArray, this.instructorId)
    })
    
  }

  updateData(clients) {
    console.log("UPDATING DATA = ", clients)
    this.dataSource = new MatTableDataSource(clients);
    this.dataSource.paginator = this.paginator;
    console.log("SETTING SORT TO = ", this.dataSource.sort)
    console.log("SETTING paginator TO = ", this.dataSource.paginator)
  }


  getInstructorTimeLogs(datesArray, instructorId) {
    let data = {
      date : datesArray,
      instructorId: instructorId
    }
    console.log("****data", data);
    this._timeSheetService.getTimeLogUsingDates(data).subscribe(res => {
      console.log('Res========>>>>>', res);
      this.updateData(res)
    }, err => {
    })
  }

}
