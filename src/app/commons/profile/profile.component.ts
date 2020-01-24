import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service'
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerService } from 'src/app/services/learner.service';

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
  learner: any;
  name: any;
  email: any;
  mobile: any;
  profilePath;

  constructor(private _jobService: JobService, public _learnerService: LearnerService,
    private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // GETTING LEARNER ID
    this.activatedRoute.params.subscribe(params => {
      console.log("ID-----", params['id']);
      this._learnerService.getLearner(params['id']).subscribe(learner => {
        this.learner = learner.pop();
        console.log("learner:::", this.learner);
        this.name = this.learner.name;
        this.email = this.learner.email;
        this.mobile = this.learner.mobile;
        this.profilePath = this.learner.profilePic;
        this.getJob(this.learner.job._id);
      })

    })
    console.log("The learner is", this.learner);
  }

  getJob(id) {
    this._jobService.getJobById(id).subscribe((jobRecieved) => {
      console.log("Job Recieved", jobRecieved);
      this.job = jobRecieved.pop();
      this.client = this.job.client.name;
      this.location = this.job.location.title;
      this.course = this.job.course.title;
      this.instructor = this.job.instructors;
    })
  }

}
