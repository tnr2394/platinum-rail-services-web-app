import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, Input } from '@angular/core';
import { JobService } from "../services/job.service";
import { Router, ActivatedRoute } from "@angular/router";
import * as _ from 'lodash';

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
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { MatDialog } from "@angular/material";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  @Input('job') jobRecieved : any;

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  jobs = [{ client: "SKUK", value: 1 }, { client: "Shipley", value: 2 }, { client: "FOC", value: 3 }, { client: "Shipley", value: 4 }];
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

  activeDayIsOpen: boolean = true;
  job: any;

  constructor(private activatedRoute: ActivatedRoute, private modal: NgbModal, private _jobService: JobService, private router: Router) {
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
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


  // Model Opener
  handleEvent(action: string, event): void {
    console.log("Handling event", { action, event })
    this.modalData = { event, action };
    this.router.navigate(['/learners/' + event.jobid]);
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }



  ngOnInit() {
    console.log("JOV FROM SINGLE JOB PAGE", this.jobRecieved);
    
      if (this.router.url.includes('/jobs')) {
        this.viewDropdown = false;
        console.log("VIEW VALUE IS HERE");
        if (this.jobRecieved != undefined) {
          console.log("**********IN if Condition**********");
          this.populateAllJobs([this.jobRecieved])
      }
        else {
          this.getJobs();
          this.activatedRoute.params.subscribe(params => {
            this.jobId = params['jobid'];
            console.log("Calling getLearners with jobid = ", this.jobId);
            // this.filterJobUsingJobId(this.jobId);
          });
          // this.getJobs();
        }
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
    var dates = job.singleJobDate;
    console.log("Processing Job with dates = ", dates);
    var events = [];
    for (var i = 0; i < dates.length; i++) {
      var newObj = this.createEventObject({
        startingDate: dates[i],
        title: job.title + " - " + job.location.title,
        color: job.color,
        jobid: job._id
      })
      events.push(newObj);
    }
    console.log("Events = ", events);
    return events;
    // this.events = events;
  }

  jobChanged(event) {
    this.job = event.value;
    this.resetEvents();
    this.populateAllJobs([this.job]);
    console.log("this.job = ", this.job);
    // this.loadDatesForJob(this.job);
  }

  populateAllJobs(jobs) {
    console.log("PopulateAllJobs Called with jobs = ", jobs);
    for (var i = 0; i < jobs.length; i++) {
      var events = this.makeEventsArrayForJob(jobs[i]);
      this.events = [...events];
    }

  }
  resetEvents() {
    this.events = [];
  }

  // APIs
  getJobs() {
    this._jobService.getJobs().subscribe(jobs => {
      this.jobs = jobs;
      this.jobsForFilter = jobs;

      console.log('this.jobs::::::::::::::::::::::::', this.jobs);
      this.filterJobUsingJobId(this.jobId)
    }, err => {
      console.error(err);
    })
  }


  filterJobUsingJobId(jobId) {
    let finalJob;
    console.log('this.jobs:::::::::::::::::::::::::::::', this.jobsForFilter);
    _.forEach(this.jobsForFilter, (singleJob) => {
      console.log('singleJob:::::::::::::', singleJob);
      if (singleJob._id == jobId) {
        finalJob = singleJob;
      }
    })
    console.log('finalJob:::::::::::::::::::::::::::::::::::', finalJob);
    this.resetEvents();
    setTimeout(() => {    //<<<---    using ()=> syntax
      this.populateAllJobs([finalJob]);
    },500);

  }

}
