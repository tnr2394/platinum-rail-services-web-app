import { Component, OnInit } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { LearnerService } from '../../services/learner.service';
import { JobService } from '../../services/job.service';
import { CourseService } from '../../services/course.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';



@Component({
  selector: 'app-learner-dashboard',
  templateUrl: './learner-dashboard.component.html',
  styleUrls: ['./learner-dashboard.component.scss']
})
export class LearnerDashboardComponent implements OnInit {

  jobId;
  learner;
  materialId = [];
  assignments;
  courseId;
  material = [];
  bgColors: string[];
  lastColor;
  constructor(private activatedRoute: ActivatedRoute, public _materialService: MaterialService, public _learnerService: LearnerService, public _jobService: JobService, public _courseService: CourseService, private router: Router) {
    this.bgColors = ['bg-info', 'bg-success', 'bg-warning', 'bg-primary', 'bg-danger'];
  }

  ngOnInit() {
    this.getAllotments();
  }

  getAllotments() {
    this.activatedRoute.params.subscribe(params => {
      console.log(params['id']);
      this._learnerService.getLearner(params['id']).subscribe(data => {
        console.log("RECEIVED = ", data);
        this.learner = data.pop();
        console.log("THis.learner", this.learner)
        this.learner.allotments.forEach((assignment) => {
          this.assignments = this.learner.allotments;
        })
        console.log("ASSIGNMENTS", this.assignments[0].assignment.title)
        if (this.learner.job == null) {
          console.log("LEARNER HAS NO JOB")
        }
        else {
          this.jobId = this.learner.job._id;
          console.log("JOBID", this.jobId)
          this.getJob()
        }
      });
    })
  }

  getJob() {
    this._jobService.getJobById(this.jobId).subscribe((job) => {
      console.log("Recieved job", job)
      job.forEach((job) => {
        if (this.jobId == job._id) {
          this.courseId = job.course._id;
        }
      })
      // console.log("course id", this.courseId)
      this.getMaterials();
    })
  }

  getMaterials() {
    this._courseService.getCourse(this.courseId).subscribe((material) => {
      console.log("RECIEVED", material)
      material[0].materials.forEach((material) => {
        if (material.type == "Reading") {
          this.material.push(material);
        }
      })
    })
  }

  getRandomColorClass(i) {
    var rand = Math.floor(Math.random() * this.bgColors.length);
    rand = i % 5;
    this.lastColor = rand;
    return this.bgColors[rand];
  }

  showMaterialFiles(material) {
    let navigationExtras: NavigationExtras = {
      state: {
        material: material
      }
    };
    this.router.navigateByUrl('/learnerReadingMaterial', navigationExtras);
  }

  showAllotmentTile(assignment) {
    console.log("ASSIGNMENT", assignment)
    this.router.navigateByUrl('/learnerAllotment/' + assignment._id);
  }


}
