import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-single-week',
  templateUrl: './single-week.component.html',
  styleUrls: ['./single-week.component.scss']
})
export class SingleWeekComponent implements OnInit {

  pageSizeOptions: number[] = [5, 10, 25, 100];
  jobId;
  displayedColumns: string[] = ['date', 'logIn', 'lunchStart', 'lunchEnd', 'logOut'];
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;


  Days = [
    { id: '0', date: '11/02/2020', day: 'Sunday', checked: false },
    { id: '1', date: '12/02/2020', day: 'Monday', checked: false },
    { id: '2', date: '13/02/2020', day: 'Tuesday', checked: false },
    { id: '3', date: '14/02/2020', day: 'Wednesday', checked: false },
    { id: '4', date: '15/02/2020', day: 'Thursday', checked: false },
    { id: '5', date: '16/02/2020', day: 'Friday', checked: false },
    { id: '6', date: '17/02/2020', day: 'Saturday', checked: false }
  ];



  constructor() { }

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
    console.log('Function Closed');
    console.log('Event::::::::::', event, index);
  }

}
