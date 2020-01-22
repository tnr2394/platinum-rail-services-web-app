import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  job;
  instructor: any;
  client: any;
  location: any;
  course: any;

  constructor(private _jobService: JobService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.currentUser);
    console.log("Current User", this.currentUser);
    this.getJob()
  }

  getJob(){
    this._jobService.getJobById(this.currentUser.job).subscribe((jobRecieved)=>{
      console.log("Job Recieved", jobRecieved);
      this.job = jobRecieved.pop();
      this.client = this.job.client.name;
      this.location = this.job.location.title;
      this.course = this.job.location.title;
      this.instructor = this.job.instructors;
      // console.log("=====This.job=====", this.job);
      
    })
  }

}
