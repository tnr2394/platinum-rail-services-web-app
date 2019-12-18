import { Component, OnInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent, MatDialog } from '@angular/material';
import { MaterialService } from "../../services/material.service";
import { LearnerService } from "../../services/learner.service";
import { JobService } from "../../services/job.service";
import { Router, NavigationExtras } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';


@Component({
  selector: 'app-assignment-status',
  templateUrl: './assignment-status.component.html',
  styleUrls: ['./assignment-status.component.scss']
})
export class AssignmentStatusComponent implements OnInit {
  assignment;

  // displayedColumns: string[];
  learners: [];

  displayedColumns: string[] = ['name', 'email', 'actions'];
  dataSource: MatTableDataSource<any>;

  learner;
  job;
  jobId;
  unit;
  unitArray;

  constructor(private activatedRoute: ActivatedRoute, private _materialService: MaterialService, private _learnerService: LearnerService, private _jobService: JobService) {
    this.learners = [];
    this.dataSource = new MatTableDataSource(this.learners);
  }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      this.jobId = params['jobid'];
      console.log("Calling getLearners with jobid = ", this.jobId);
      this.getJob(this.job);
    });


    this.getAssignmentList(this.jobId);
    this.assignmentStatusWithLearner(this.jobId);
    this.getJob(this.jobId);
  }


  getAssignmentList(jobId) {
    this._materialService.getMaterialUsingJobId(jobId).subscribe((data) => {
      this.unit = data[0];
      this.unitArray = data;
      this.assignment = data.assignment;
    });
  }

  getJob(jobId) {
    var that = this;
    this._jobService.getJobById(jobId).subscribe((jobs) => {
      console.log("Job Received =  Assignment Status", jobs);
      this.job = jobs.pop();
      console.log("Setting job = ", { job: this.job });
    });
  }



  loadLearners(object) {
    console.log("OBJECT", object);
    this.learners = object.learners;
    console.log("Learners loaded by event = ", object.learners);
  }

  checkArray(assignmentArray, assignment) {
    let index = _.findIndex(assignmentArray, function (o) { return o.assignmentId == assignment; });
    if (index >= 0) {
      return assignmentArray[index].assignmentStatus;
    } else {
      return 'Unassigned';
    }
  }


  assignmentStatusWithLearner(jobId) {
    this._materialService.assignmentStatusWithLearner(jobId).subscribe((data) => {
      this.learner = data;
      console.log('Learner List', this.learner);
    });
  }
}
