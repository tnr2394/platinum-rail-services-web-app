import { Component, OnInit, ViewChild } from '@angular/core';
import { JobService } from '../../services/job.service';
import { JobComponent } from '../../jobs/job/job.component';
declare var $;

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

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.currentUser);
    this.clientName = this.currentUser.name;

    $(document).ready(function () {
      $('mat-card').click(function () {
        $('mat-card').removeClass("active");
        $(this).addClass("active");
      });
    });

    this.getJobs();
  }

  jobChanged(job) {
    console.log("JOB CHANGED", job);
    this.jobComp.job = job;
    this.jobComp.jobIdFromClient = job._id;
    this.jobComp.completionPercentage(job)
    // $('.inner_card').addClass("active");

  }

  getJobs() {
    this._jobService.getJobs().subscribe(jobs => {
      console.log("JOBS RECIEVED", jobs);
      this.jobs = jobs;
      let firstJob = jobs[0]
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
