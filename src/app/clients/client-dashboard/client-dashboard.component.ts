import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service'

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  jobs = [];
  currentUser;
  clientName = '';

  constructor(public _jobService: JobService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.currentUser);
    this.clientName = this.currentUser.name

    this.getJobs();
  }

  getJobs(){
    this._jobService.getJobs().subscribe(jobs=>{
      console.log("JOBS RECIEVED", jobs);
      this.jobs = jobs;
    })
  }

}
