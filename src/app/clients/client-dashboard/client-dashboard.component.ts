import { Component, OnInit, ViewChild } from '@angular/core';
import { JobService } from '../../services/job.service'
import { JobComponent } from '../../jobs/job/job.component'

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
    this.clientName = this.currentUser.name

    this.getJobs();
  }

  jobChanged(job){
    console.log("JOB CHANGED", job);
    this.jobToPass = job._id;
    // this.jobComp.ngOnInit()
  }

  getJobs(){
    this._jobService.getJobs().subscribe(jobs=>{
      console.log("JOBS RECIEVED", jobs);
      this.jobs = jobs;
      this.jobToPass = jobs[0];
      console.log("this.jobToPass", this.jobToPass);
    })
  }

}
