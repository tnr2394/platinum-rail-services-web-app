import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { JobService } from '../../services/job.service'
import { JobComponent } from '../../jobs/job/job.component'
import { LearnersComponent } from '../../learners/learners.component'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  jobs = [];
  jobToPass;
  currentUser;
  clientName = '';
  selectedJob;
  clientId;
  private isSelected: string;
  @Output() openFilesSideNav: EventEmitter<any> = new EventEmitter<any>();


  constructor(public _jobService: JobService, private activatedRoute: ActivatedRoute) { }
  @ViewChild(JobComponent, { static: false }) jobComp: JobComponent;
  @ViewChild(LearnersComponent, { static: false }) learnerComp: LearnersComponent;

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.clientId = params.id;
      console.log('Client Id:::::::::::::', this.clientId);
      if (params.id != undefined) {
        this.getJobsByClientId();
      }
    });
    this.currentUser = JSON.parse(localStorage.currentUser);
    this.clientName = this.currentUser.name;
    // this.getJobs();
  }
  setColor(value, i) {
    this.isSelected = value;
  }

  jobChanged(job) {
    console.log("JOB CHANGED", job);
    this.selectedJob = job
    this.jobComp.job = job;
    this.jobComp.jobIdFromClient = job._id;
    this.jobComp.completionPercentage(job)
    this.jobComp.jobChangedByClient(job);
  }

  // getJobs() {
  //   this._jobService.getJobs().subscribe(jobs => {
  //     console.log("JOBS RECIEVED", jobs);
  //     this.jobs = jobs;
  //     this.displayJobs(this.jobs)
  //     // this.selectedJob = jobs[0]
  //     // let firstJob = jobs[0]
  //     // console.log("FIRST JOB", firstJob);
  //     // this.jobComp.job = firstJob;
  //     // this.jobComp.jobIdFromClient = firstJob._id;
  //     // this.jobComp.completionPercentage(firstJob)
  //     // // this.jobComp.job = jobs[0];
  //     // this.jobToPass = jobs[0];
  //     // console.log("this.jobToPass", this.jobToPass);

  //   })
  // }

  getJobsByClientId() {
    this._jobService.getJobByClientId(this.clientId).subscribe(jobs => {
      console.log("Job recieved::::::::::::::", jobs);
      this.jobs = jobs;
      this.displayJobs(this.jobs)
    })
  }

  displayJobs(jobs) {
    this.selectedJob = jobs[0]
    let firstJob = jobs[0]
    console.log("FIRST JOB", firstJob);
    this.jobComp.job = firstJob;
    if (firstJob && firstJob._id) {
      this.jobComp.jobIdFromClient = firstJob._id;
      this.jobComp.completionPercentage(firstJob)
    }
    // this.jobComp.job = jobs[0];
    this.jobToPass = jobs[0];
    console.log("this.jobToPass", this.jobToPass);
    console.log("this.selectedJob", this.selectedJob);
  }
  openFileDetails(data) {
    let event = data.event
    this.openFilesSideNav.emit({ event })
  }

}
