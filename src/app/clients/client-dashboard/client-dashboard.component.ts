import { Component, OnInit, ViewChild } from '@angular/core';
import { JobService } from '../../services/job.service'
import { JobComponent } from '../../jobs/job/job.component'
import { LearnersComponent } from '../../learners/learners.component'

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

  constructor(public _jobService: JobService) { }
  @ViewChild(JobComponent, { static: false }) jobComp: JobComponent;
  @ViewChild(LearnersComponent, { static: false }) learnerComp: LearnersComponent;

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.currentUser);
    this.clientName = this.currentUser.name

    this.getJobs();
  }

  jobChanged(job){
    console.log("JOB CHANGED", job);
    this.jobComp.job = job;
    this.jobComp.jobIdFromClient = job._id;
    this.jobComp.completionPercentage(job)
    this.jobComp.jobChangedByClient(job);
  }

  getJobs(){
    this._jobService.getJobs().subscribe(jobs=>{
      console.log("JOBS RECIEVED", jobs);
      this.jobs = jobs;
      let firstJob = jobs[1]
      console.log("FIRST JOB", firstJob);
      this.jobComp.job = firstJob;
      this.jobComp.jobIdFromClient = firstJob._id;
      this.jobComp.completionPercentage(firstJob)
      // this.jobComp.job = jobs[0];
      this.jobToPass = jobs[0];
      console.log("this.jobToPass", this.jobToPass);
    })
  }

}
