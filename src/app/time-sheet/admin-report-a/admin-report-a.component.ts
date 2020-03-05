import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { InstructorService } from 'src/app/services/instructor.service';
import { FilterService } from 'src/app/services/filter.service';
import { TimeSheetService } from 'src/app/services/time-sheet.service';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

@Component({
  selector: 'app-admin-report-a',
  templateUrl: './admin-report-a.component.html',
  styleUrls: ['./admin-report-a.component.scss']
})
export class AdminReportAComponent implements OnInit {
  selectedDate: any;
  sort: MatSort;
  paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  searchText;
  today = new Date()

  displayedColumns: string[] = ['Instructor', 'LogIn', 'LunchStart', 'LunchEnd', 'LogOut', 'WorkHours', 'TravelHours', 'Total'];
  allInstrutorsLogs: any;
  displayMsg: boolean;
  loading: boolean;
  isPrint: boolean;

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  @HostListener('window:beforeprint', ['$event'])
  onBeforePrint(event) {
    // this.isPrint = true
    $('th').addClass('printTableHeader')
    // this.print.emit({ msg: 'printing' })
    // this.displayedColumns = ['date', 'logIn', 'lunchStart', 'lunchEnd', 'logOut', 'travelHours', 'hoursWorked', 'totalHours'];
    // this.dataSource.paginator = null;
  }

  @HostListener('window:afterprint', ['$event'])
  onAfterPrint(event) {
    // this.isPrint = false
    $('th').removeClass('printTableHeader')
    // this.print.emit({ msg: 'printing complete' })
    // this.displayedColumns = ['copyPaste', 'date', 'logIn', 'lunchStart', 'lunchEnd', 'logOut', 'travelHours', 'hoursWorked', 'totalHours', 'edit'];
    // this.dataSource.paginator = this.paginator;
  }
  constructor(private _instructorService: InstructorService, public _filter: FilterService, public _timeSheetService: TimeSheetService) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit() {
    this.loading = true;
    this.displayMsg = false
    this.selectedDate = moment().format("MM/DD/YYYY")
    this.getInstructorTime(this.selectedDate)
    // this.getAllInstructors()
  }
  dateChanged(event) {
    this.displayMsg = false
    this.dataSource = new MatTableDataSource()
    console.log("event", event);
    this.selectedDate = moment(event.value).format("MM/DD/YYYY");
    console.log("this.selectedDate", this.selectedDate);
    this.getInstructorTime(this.selectedDate)
  }


  filter(searchText) {
    if (searchText === '') {
      this.dataSource = new MatTableDataSource(this.allInstrutorsLogs);
      this.dataSource.paginator = this.paginator;
      return;
    } else {
      const finalarray = [];
      this.allInstrutorsLogs.forEach((e1) => {
        if (e1.instructor.name.toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
          finalarray.push(e1)
        }
        this.updateData(finalarray);
      })
    }
  }

  updateData(logs) {
    this.dataSource = new MatTableDataSource(logs);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // API
  // getAllInstructors(){
  //   this._instructorService.getInstructors().subscribe(instructorsResponse=>{
  //     console.log("instructorsResponse", instructorsResponse)
  //     this.allInstrutors = instructorsResponse;
  //     // this.dataSource = new MatTableDataSource<any>(this.allInstrutors)
  //   })
  // }
  getInstructorTime(date) {
    let data = {
      date: date
    }
    this._timeSheetService.getMultipleInstructorTime(data).subscribe(instLogs => {
      this.loading = false;
      this.allInstrutorsLogs = instLogs.response;
      if (this.allInstrutorsLogs.length == 0) { this.displayMsg = true; return; }
      console.log("---this.allInstrutorsLogs---", this.allInstrutorsLogs);
      if (this.allInstrutorsLogs.length > 0) this.updateData(this.allInstrutorsLogs)
    })
  }
}

// Time logs for ALL Instructors at a given date... API?
