import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { InstructorService } from 'src/app/services/instructor.service';
import { FilterService } from 'src/app/services/filter.service';
import { TimeSheetService } from 'src/app/services/time-sheet.service';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import * as _ from 'lodash';

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
  allInstrutors: any;
  tempInst: any = [];
  finalList: any = [];

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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
   
    this.dataSource.sort = this.sort;
    this.loading = true;
    this.displayMsg = false
    this.selectedDate = moment().format("MM/DD/YYYY")
    this.getInstructorTime(this.selectedDate)
    this.getAllInstructors()
  }
   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    console.log("Update data called in admin report a", logs)
    this.dataSource = new MatTableDataSource(logs);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      console.log("inside switch case", item, property);
      switch (property) {
        case 'instructor.name': return item.instructor.name;
        default: return item[property];
      }
    };
    this.dataSource.sort = this.sort;
    console.log("After Update data called in admin report a", this.dataSource)
  }
  getFinalList(){
    if (this.tempInst.length > 0 && this.allInstrutors){
      var filteredArray = _.differenceBy(this.allInstrutors, this.tempInst, '_id');
      if(filteredArray.length > 0){
        filteredArray.forEach(item=>{
          let data = {
            date: this.selectedDate,
            instructor: item,
            logIn: '00:00',
            logOut: '00:00',
            lunchStart: '00:00',
            lunchEnd: '00:00',
            totalHours: { hours: '00', minutes: '00' },
            travel: "00:00",
            workingHours: { hours: '00', minutes: '00' }
          }
          this.allInstrutorsLogs.push(data)
        })
        console.log("*****this.allInstrutorsLogs*****", this.allInstrutorsLogs);
        this.allInstrutorsLogs.sort((a, b) => a.instructor.name.localeCompare(b.instructor.name))
        this.updateData(this.allInstrutorsLogs)
      }
      console.log("#####filteredArray", filteredArray);
    }
  }

  // API
  getAllInstructors(){
    this._instructorService.getInstructors().subscribe(instructorsResponse=>{
      console.log("instructorsResponse", instructorsResponse)
      this.allInstrutors = instructorsResponse;
      this.getFinalList()
      // this.dataSource = new MatTableDataSource<any>(this.allInstrutors)
    })
  }
  getInstructorTime(date) {
    let data = {
      date: date
    }
    this._timeSheetService.getMultipleInstructorTime(data).subscribe(instLogs => {
      this.loading = false;
      this.allInstrutorsLogs = instLogs.response;
      if (this.allInstrutorsLogs.length == 0) { this.displayMsg = true; return; }
      console.log("---this.allInstrutorsLogs---", this.allInstrutorsLogs);
      this.allInstrutorsLogs.forEach(item=>{
        this.tempInst.push(item.instructor)
      })
      if (this.allInstrutorsLogs.length > 0) this.getFinalList()
    })
  }

  someMethod(event){
    console.log("sort in admin report a", event)
  }
}

// Time logs for ALL Instructors at a given date... API?
