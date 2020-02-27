import { Component, OnInit, ViewChild } from '@angular/core';
import { InstructorService } from 'src/app/services/instructor.service';
import { Select2OptionData } from 'ng2-select2';
import { TimeSheetService } from 'src/app/services/time-sheet.service';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-admin-report-b',
  templateUrl: './admin-report-b.component.html',
  styleUrls: ['./admin-report-b.component.scss']
})
export class AdminReportBComponent implements OnInit {
  public instToDisplay: Array<Select2OptionData> = [];
  public options: Select2Options;
  value: string[];
  allInstructors: any;
  selectedInstructorId: any;
  selectedDates;
  selectedDatesRange: any;
  totalHours;
  overTimeHours;
  totalCalTime;
  sort: MatSort;
  paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  down;

  displayedColumns: string[] = ['Date', 'LogIn', 'LunchStart', 'LunchEnd', 'LogOut', 'WorkHours', 'TravelHours', 'Total'];
  timeLogs: any;
  totalMinutes: any;
  display: boolean = true;
  displayMsg: boolean;
  datesArray: any[];
  dataForSingleWeek;
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

  constructor(private _instructorService: InstructorService, public _timeSheetService: TimeSheetService) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit() {
    // const paginatorIntl = this.paginator._intl;
    // paginatorIntl.nextPageLabel = '';
    // paginatorIntl.previousPageLabel = '';
    this.display = true;
    this.options = {
      multiple: false,
      placeholder: "Choose instructors"
    }
    this.getAllInstructors()
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  instructorChanged(data: { value: string[] }) {
    this.totalHours = 0;
    this.dataSource = new MatTableDataSource<any>();
    console.log("---Inst changed---", data);
    this.selectedInstructorId = data.value;
    if (this.selectedDatesRange && this.selectedInstructorId) this.getTimeLog(this.datesArray)
  }
  datesSelected(event) {
    this.display = false;
    this.selectedDatesRange = event;
    console.log("---datesSelected---", event);
    this.getWeekDates(this.selectedDatesRange)
  }
  getWeekDates(selectedDatesRange) {
    if (selectedDatesRange.startDate && selectedDatesRange.endDate) {
      console.log("-----getWeekDates-----", selectedDatesRange);
      let dates = []
      dates.push(selectedDatesRange.startDate.format('MM/DD/YYYY'))
      return new Promise((resolve, reject) => {
        while (selectedDatesRange.startDate.add(1, 'days').diff(selectedDatesRange.endDate) < 0) {
          console.log("In while loop");
          console.log(selectedDatesRange.startDate.toDate());
          dates.push(selectedDatesRange.startDate.clone().format('MM/DD/YYYY'));
        }
        console.log(" AFTER WHILE **dates", dates);
        this.datesArray = dates;
        resolve(this.datesArray)
      }).then((resolvedDatesArray) => {
        this.getTimeLog(resolvedDatesArray)
      })
    }

    // return new Promise((resolve,reject)=>{
    // dates.push(selectedDatesRange.startDate.format('MM/DD/YYYY'))
    // console.log("");

  }
  updateData(logs) {
    console.log('UPDATING DATA = ', logs)
    this.dataSource = new MatTableDataSource(logs);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log('SETTING SORT TO = ', this.dataSource.sort)
    console.log('SETTING paginator TO = ', this.dataSource.paginator)
  }

  // API
  getAllInstructors() {
    this._instructorService.getInstructors().subscribe(instructorsResponse => {
      console.log("instructorsResponse", instructorsResponse)
      this.allInstructors = instructorsResponse;

      this.selectedInstructorId = instructorsResponse[0]._id
      instructorsResponse.forEach(inst => {
        let temp = {
          id: inst._id,
          text: inst.name
        }
        this.instToDisplay.push(temp)
        console.log("this.instToDisplay", this.instToDisplay);
      })
      // this.dataSource = new MatTableDataSource<any>(instructorsResponse)
    })
  }
  getTimeLog(datesArray) {
    let data = {
      date: datesArray,
      instructorId: this.selectedInstructorId
    }
    this._timeSheetService.getSecondReportDetails(data).subscribe((responseLogs) => {
      console.log("---Got time logs---", responseLogs.response[0]);
      if (responseLogs.response && responseLogs.response.length == 0) {
        this.dataForSingleWeek = 'noData'
        this.displayMsg = true;
        return
      }
      else this.displayMsg = false;
      this.dataForSingleWeek = responseLogs.response[0].logs
      this.timeLogs = responseLogs.response[0].logs
      this.totalHours = responseLogs.response[0].totalWorkingHours
      this.totalMinutes = responseLogs.response[0].totalWorkingMinutes
      if (this.totalMinutes == 60) {
        this.totalHours = this.totalHours + 1
        this.totalMinutes = this.totalMinutes - 60
      }
      else if (this.totalMinutes > 60) {
        this.totalHours = this.totalHours + Math.floor(this.totalMinutes / 60)
        this.totalMinutes = this.totalMinutes % 60
      }
      let tempTotalHours = (this.timeLogs.length) * 12
      this.overTimeHours = this.totalHours <= tempTotalHours ? 0 : (this.totalHours - tempTotalHours + ":" + this.totalMinutes)
      console.log("---tempTotalHours---", tempTotalHours);
      console.log("this.totalHours", this.totalHours, "this.totalMinutes", this.totalMinutes);
      this.updateData(this.timeLogs)
      // this.dataSource = new MatTableDataSource<any>(this.timeLogs);
    })
  }
}
