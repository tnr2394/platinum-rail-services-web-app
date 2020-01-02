import { Component, OnInit } from '@angular/core';
import { JobService } from '../services/job.service';
import { InstructorService } from '../services/instructor.service';
import { CourseService } from '../services/course.service';
import { LoginService } from '../services/login.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: any;

  constructor(public _jobService: JobService,public _loginService:LoginService, public _instructorService: InstructorService, public _courseService: CourseService) { 
    this._loginService.currentUser.subscribe(x => this.currentUser = x);
  }

  jobs;
  instructors;
  courses;

  ngOnInit() {
    this.getJobs();
    this.getInstructors();
    this.getCourses();
    this.currentUser = JSON.parse(localStorage.currentUser);
  }

  getJobs() {
    var that = this;
    this._jobService.getJobs().subscribe((data) => {
      this.jobs = data;
      console.log('Jobs Received : ', this.jobs);
    })
  }

  getInstructors() {
    var that = this;
    this._instructorService.getInstructors().subscribe((instructors) => {
      this.instructors = instructors;
    });
  }

  getCourses() {
    var that = this;
    this._courseService.getCourses().subscribe((courses) => {
      this.courses = courses;
    });
  }

}
