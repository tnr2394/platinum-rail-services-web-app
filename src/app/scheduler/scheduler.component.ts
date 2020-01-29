import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, Input, Inject, Injector, ComponentRef } from '@angular/core';
import { JobService } from "../services/job.service";
import { Router, ActivatedRoute } from "@angular/router";
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA, throwToolbarMixedModesError, MatSnackBar } from '@angular/material';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject, Observable } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { MatDialog } from "@angular/material";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddJobModalComponent } from '../jobs/add-job-modal/add-job-modal.component';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};


@Component({
  selector: 'app-scheduler',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @Input('mwlCalendarTooltip') contents: string;

  private tooltipRef: ComponentRef<SchedulerComponent>;

  view: CalendarView = CalendarView.Month;
  jobs: any;
  //  jobs = [{ client: "SKUK", value: 1 }, { client: "Shipley", value: 2 }, { client: "FOC", value: 3 }, { client: "Shipley", value: 4 }];
  CalendarView = CalendarView;
  events = [];
  viewDate: Date = new Date();
  jobId;
  viewDropdown: Boolean = true;

  jobsForFilter;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  allevents = []

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  // DATES ARRAY FOR JOBS
  oldevents: CalendarEvent[] = [
    {
      start: new Date("2019-10-28T18:30:00.000Z"),
      title: "SCUK - L3 W14",
      color: {
        primary: "#ad2121",
        secondary: "#FAE3E3"
      },
      actions: this.actions,

      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    },
    {
      start: new Date("2019-10-30"),
      title: "New Location",
      color: {
        primary: "#3322ff",
        secondary: "#FAE3E3"
      },
      actions: this.actions,

      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }


    // {
    //   start: subDays(startOfDay(new Date()), 1),
    //   end: addDays(new Date(), 1),
    //   title: 'A 3 day event',
    //   color: colors.red,
    //   actions: this.actions,
    //   allDay: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // },
    // {
    //   start: startOfDay(new Date()),
    //   title: 'An event with no end date',
    //   color: colors.yellow,
    //   actions: this.actions
    // },
    // {
    //   start: subDays(endOfMonth(new Date()), 3),
    //   end: addDays(endOfMonth(new Date()), 3),
    //   title: 'A long event that spans 2 months',
    //   color: colors.blue,
    //   allDay: true
    // },
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   end: new Date(),
    //   title: 'A draggable and resizable event',
    //   color: colors.yellow,
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // }
  ];

  externalEvents: CalendarEvent[] = []

  activeDayIsOpen: boolean = true;
  job: any;
  selectedJob;
  jobsForModal: any;
  dialogref = null;
  // allevents = [];
  loading: Boolean = true;
  displayTitle: Boolean = true;
  newJobdate: any;

  constructor(private activatedRoute: ActivatedRoute, private modal: NgbModal, private _jobService: JobService,
    private router: Router, private injector: Injector, public dialog: MatDialog, public _snackBar: MatSnackBar) {
    if (this.router.url.includes('/jobs') || this.router.url.includes('/client') || this.router.url.includes('/instructors')) {
      this.jobsForModal = this.injector.get(MAT_DIALOG_DATA)
      this.dialogref = this.injector.get(MatDialogRef)
      this.displayTitle = false;
      console.log("IN IF CONDITION Of Constructor", this.jobsForModal);
    }
  }
  createNewJob(){
    let job = {
      title: 'New Job',
      start: new Date(),
      color: colors.yellow,
      draggable: true
    }
    this.externalEvents.push(job)
  }
  eventDropped({
    event,
    newStart,
    newEnd,
    allDay
  }: CalendarEventTimesChangedEvent): void {
    const externalIndex = this.externalEvents.indexOf(event);
    if (typeof allDay !== 'undefined') {
      event.allDay = allDay;
    }
    if (externalIndex > -1) {
      this.externalEvents.splice(externalIndex, 1);
      this.events.push(event);
    }
    event.start = newStart;
    if (newEnd) {
      event.end = newEnd;
    }
    if (this.view === 'month') {
      this.viewDate = newStart;
      this.activeDayIsOpen = true;
    }
    this.allevents = [...this.events];
    if(this.externalEvents.length < 1){
      this.createNewJob()
    }
  }
  

  externalDrop(event){
    console.log("ecternal event dropped");
    
    if (this.externalEvents.indexOf(event) === -1) {
      this.events = this.events.filter(iEvent => iEvent !== event);
      this.externalEvents.push(event);
    }
  }
  
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log("DAY CLICKED", date , events);
    this.newJobdate = date;
    
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  openDialog(someComponent, data = {}): Observable<any> {
    console.log('OPENDIALOG', 'DATA = ', data)
    const dialogRef = this.dialog.open(someComponent, { data, width: '1000px', height: '967px' });
    return dialogRef.afterClosed();
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }


  // Model Opener
  handleEvent(action: string, event): void {
    console.log("Handling event", { action, event })
    if(event.title == "New Job"){
      this.openDialog(AddJobModalComponent, event).subscribe(job=>{
        if(job == undefined) return
        console.log("JOB ADDED", job);
        this.populateAllJobs([job])
      })
    }
    else{
      this.router.navigate(['/jobs/' + event.jobid]);
      if (this.dialogref != null) {
        this.dialogref.close();
        this.displayTitle = false;
      }
    }
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  addJobModel(event){
    console.log("add job modal", event);
    
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }



  ngOnInit() {
    this.createNewJob();
    console.log("this.loading", this.loading);
    console.log("jobsForModal**********", this.jobsForModal);

    if (this.router.url.includes('/jobs') || this.router.url.includes('/client') || this.router.url.includes('/instructors')) {
      if (this.jobsForModal != undefined) {
        this.populateAllJobs( this.jobsForModal)
      }
      else if (this.jobsForModal == undefined) {
        this.getJobs()
      }
    }
    else {
      console.log("IN ELSE");
      this.getJobs();
    }
  }
  // Utility
  createEventObject(obj) {
    console.log("Creating Event object from = ", obj);
    var newEvent = {
      start: new Date(obj.startingDate),
      title: obj.title,
      color: {
        primary: obj.color,
      },
      allDay: true,
      jobid: obj.jobid
    }
    console.log("Event object created = ", newEvent);
    return newEvent;
  }


  makeEventsArrayForJob(job) {
    if(job.length < 1) return
    console.log("job in makeEvents", job);
    
    var dates = job.singleJobDate;
    console.log("Dates", dates);
    
    console.log("Processing Job with dates = ", job.title);
    var events = [];
    for (var i = 0; i < dates.length; i++) {
      var newObj = this.createEventObject({
        startingDate: dates[i],
        title: job.title + " - " + job.location.title,
        color: job.color,
        jobid: job._id
      })
      this.allevents.push(newObj);
      events.push(newObj);
      this.refresh.next();
      // this.allevents.push(events)
    }
    console.log("Events = ", events);
    return events;
    // this.events = events;
  }

  // jobChanged(event) {
  //   this.job = event.value;
  //   this.resetEvents();
  //   this.populateAllJobs([this.job]);
  //   console.log("this.job = ", this.job);
  //   // this.loadDatesForJob(this.job);
  // }

  populateAllJobs(jobs) {
    console.log("PopulateAllJobs Called with jobs = ", jobs);
    for (var i = 0; i < jobs.length; i++) {
      console.log("IN FOR LOOP");
      var events = this.makeEventsArrayForJob(jobs[i]);
    }
    console.log("After for loop", this.allevents);
  }
  resetEvents() {
    this.events = [];
  }

  // APIs
  getJobs() {
    this._jobService.getJobs().subscribe(jobs => {
      this.jobs = jobs;
      this.populateAllJobs(this.jobs)
      // this.jobsForFilter = jobs;
      // this.jobs.forEach(job => {
      //   console.log("in for each");
      //   this.populateAllJobs([job])
      // })
      // this.loading = false;
      // this.populateAllJobs(this.jobs);
      // this.selectedJob = jobs[0]
      // this.jobId = this.selectedJob._id;
      // console.log('this.jobs', this.jobs);
      // this.filterJobUsingJobId(this.jobId)
    }, err => {
      console.error(err);
    })
  }


  // filterJobUsingJobId() {
  //   // console.log("JOBID", this.jobId);

  //   let finalJob;
  //   console.log('this.jobs', this.jobsForFilter);
  //   _.forEach(this.jobsForFilter, (singleJob) => {
  //     console.log('singleJob:::::::::::::', singleJob);
  //     this.populateAllJobs([singleJob])
  //     // if (singleJob._id == jobId) {
  //     //   finalJob = singleJob;
  //     // }
  //   })
  //   console.log('finalJob:::::::::::::::::::::::::::::::::::', finalJob);
  //   this.resetEvents();
  //   setTimeout(() => {    //<<<---    using ()=> syntax
  //     this.populateAllJobs([finalJob]);
  //   },500);
  // }
}
