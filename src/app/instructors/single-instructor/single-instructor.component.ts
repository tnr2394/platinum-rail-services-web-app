import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatPaginator, PageEvent, MatDialog, MatSidenav } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JobService } from '../../services/job.service';
import { InstructorService } from '../../services/instructor.service';
import { FilterService } from '../../services/filter.service';
import { EditInstructorModalComponent } from '../../instructors/edit-instructor-modal/edit-instructor-modal.component'
import { SchedulerComponent } from 'src/app/scheduler/scheduler.component';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { NgSelectConfig } from '@ng-select/ng-select';
const moment = extendMoment(Moment);
@Component({
  selector: 'app-single-instructor',
  templateUrl: './single-instructor.component.html',
  styleUrls: ['./single-instructor.component.scss']
})
export class SingleInstructorComponent implements OnInit {

  instructor;
  instructorId;
  // dataSource: MatTableDataSource<any>;
  length;
  currentUser;
  jobs;
  job;
  selectedMonths;
  // pageSize = 5;
  // pageSizeOptions: number[] = [5, 10, 25, 100];
  // sort: MatSort;
  // paginator: MatPaginator;
  // searchText;
  loading;
  profilePath;
  view;
  mobile;
  email;

  isPrint: boolean;
  file: any;
  compId: any;
  deleteEvent: any;
  @HostListener('window:beforeprint', ['$event'])
  onBeforePrint(event) {
    this.isPrint = true;
    $('.mat-tab-header').hide()
  }
  @HostListener('window:afterprint', ['$event'])
  onAfterPrint(event) {
    this.isPrint = false
    $('.mat-tab-header').show()
  }

  // MatPaginator Output
  // pageEvent: PageEvent;


  displayedColumns: string[] = ['sr.no', 'client', 'location', 'instructor', 'course', 'actions']
  jobForScheduler: any;
  dateOfJoining: any;
  months = [{ id: '0', name: 'January' }, { id: '1', name: 'February' }, { id: '2', name: 'March' }, { id: '3', name: 'April' }, { id: '4', name: 'May' }, { id: '5', name: 'June' },
  { id: '6', name: 'July' }, { id: '7', name: 'August' }, { id: '8', name: 'September' }, { id: '9', name: 'October' }, { id: '10', name: 'November' }, { id: '11', name: 'December' }]
  datesRange;
  allWeeks: any[];
  selectedWeeks: any;
  doCalWeekDates = true;
  weekDates: unknown;
  monthChanged: boolean;
  // @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
  //   this.sort = ms;
  //   this.setDataSourceAttributes();
  // }
  // @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
  //   this.paginator = mp;
  //   this.setDataSourceAttributes();
  // }
  // setDataSourceAttributes() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }
  @ViewChild('sidenav', { static: false }) public mydsidenav: MatSidenav;
  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar, public _filter: FilterService, public _instrctorService: InstructorService, public _jobService: JobService,
    private activatedRoute: ActivatedRoute, private router: Router, private config: NgSelectConfig) {
    this.activatedRoute.params.subscribe(params => {
      this.instructorId = params.id;
    });
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.config.notFoundText = 'Please select a month to display dates';
    // this.dataSource = new MatTableDataSource<any>(this.jobs);
  }

  ngOnInit() {
    // this.dataSource = new MatTableDataSource<any>(this.jobs);
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    // this.getJob(this.instructorId);
    this.getInstructor(this.instructorId);
    console.log("On init instructor id is", this.instructorId);
  }

  // getJob(instructorId) {
  //   console.log('Get Job Called');
  //   this._jobService.getJobByInstructorId(instructorId).subscribe((res => {
  //     this.dataSource = new MatTableDataSource<any>(this.jobs);
  //     console.log('Get Jobs', res);
  //     this.jobs = res;
  //     this.updateData(res);
  //   }))
  // }

  getInstructor(instructorId) {
    this._instrctorService.getInstructorById(instructorId).subscribe((res => {
      console.log('Get Instructor Detail', res[0]);
      this.instructor = res[0];
      this.profilePath = this.instructor.profilePic;
      this.mobile = this.instructor.mobile;
      this.email = this.instructor.email;
      this.dateOfJoining = new Date(this.instructor.dateOfJoining);
    }))
  }

  scheduler() {
    console.log("JOB found in scheculer", this.jobs);
    this.jobForScheduler = this.jobs;
    let dialogRefScheduler = this.dialog.open(SchedulerComponent, {
      data: this.jobForScheduler,
      // minWidth: '100vw',
      // height: '100vh'
      panelClass: 'customScheduler',
      width: '100%',
      // margin: 'auto',
      height: '100vh'
    })
  }
  generateMonthWeeks() {
    this.selectedWeeks = []
    this.monthChanged = true
    if (this.selectedMonths) {
      console.log(this.selectedMonths.id)
      let month = this.selectedMonths.id
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
          let tempStartDate = weekStartDate
          let tempEndDate = weekEndDate
          this.allWeeks.push({
            weekNumber: i, weekStartDate: weekStartDate, weekEndDate: weekEndDate,
            from: "From: " + tempStartDate.format('MM/DD/YYYY') + " - " + "To: " + tempEndDate.format('MM/DD/YYYY')
          })
          console.log("weekNumber: i", i, "weekStartDate", weekStartDate, "weekEndDate", weekEndDate);
        }
        // this.show = true;
        console.log("$$allWeeks", this.allWeeks);
        resolve(this.allWeeks)
      }).then((resolvedAllWeeks) => {
        console.log("---resolvedAllWeeks-- in AFTER FOR LOOP", resolvedAllWeeks);
        this.datesRange = resolvedAllWeeks
      })
    }

    // this.index = i
  }
  generateWeekDates() {
    console.log("**generatingWeekDates");
    this.monthChanged = false
    console.log("this.selectedWeeks", this.selectedWeeks)
    if (this.selectedWeeks && this.selectedWeeks.from) {
      let week = this.selectedWeeks
      console.log("-----getWeekDates-----", week);
      let temp = week.from.split(" ")
      let weekStartDate = moment(temp[1])
      let weekEndDate = moment(temp[4])
      console.log("**temp", temp);
      console.log("**weekStartDate", weekStartDate, "**weekEndDate", weekEndDate);

      let dates = []
      // return new Promise((resolve,reject)=>{
      dates.push(temp[1])
      return new Promise((resolve, reject) => {
        while (weekStartDate.add(1, 'days').diff(weekEndDate) < 0) {
          console.log("In while loop");
          // console.log(weekStartDate.toDate());
          dates.push(weekStartDate.clone().format('MM/DD/YYYY'));
        }
        dates.push(temp[4])
        resolve(dates)
      }).then(resolvedDates => {
        console.log("this.generatedDates are", resolvedDates);
        this.doCalWeekDates = false
        this.weekDates = resolvedDates
      })
    }
  }
  clearMonth() {
    this.monthChanged = true
    this.doCalWeekDates = true
    this.selectedWeeks = []
    this.datesRange = []
    // this.datesRange = []
  }
  clearWeek() {
    this.doCalWeekDates = true
  }
  fileDetails(event) {
    console.log("event file tile clicked", event);
    this.file = event.file.file
    this.compId = event.compId._id
    this.mydsidenav.open();
  }
  deleteFile(event){
    console.log("event in single-instructor", event);
    this.deleteEvent = event
    this.mydsidenav.close()
  }
  // updateData(jobs) {
  //   this.dataSource = new MatTableDataSource(jobs);
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  //   console.log('SETTING SORT TO = ', this.dataSource.sort)
  //   console.log('SETTING paginator TO = ', this.dataSource.paginator)
  // }

  // filter(searchText) {
  //   console.log('FILTER CALLED', searchText);
  //   if (searchText === '') {
  //     this.dataSource = this.jobs;
  //     this.dataSource.paginator = this.paginator;
  //     // this.handlePage({pageIndex:0, pageSize:this.pageSize});
  //     return;
  //   }
  //   this.dataSource = this._filter.filter(searchText, this.jobs, ['title', 'client']);
  //   this.dataSource.paginator = this.paginator;
  //   // this.iterator();
  // }

}
