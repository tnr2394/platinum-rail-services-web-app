import { Component, OnInit, Input } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent, MatDialog } from '@angular/material';
import { MaterialService } from "../../services/material.service";
import { LearnerService } from "../../services/learner.service";
import { JobService } from "../../services/job.service";
import { Router, NavigationExtras } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';



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
  assignmentLength;
  learnerLength;
  @Input('jobId') jobIdFromClient; 
  constructor(private datePipe: DatePipe, private activatedRoute: ActivatedRoute, private _materialService: MaterialService, private _learnerService: LearnerService, private _jobService: JobService) {
    this.learners = [];
    this.dataSource = new MatTableDataSource(this.learners);
  }

  public test(){
    console.log("CALLED FROM MATERIALS");
  }
  ngOnInit() {
    console.log("ASSIGNMENT STATU CALLED");
    
    console.log("jobIdFromClient", this.jobIdFromClient);
    
    if (this.jobIdFromClient != undefined){
      this.jobId = this.jobIdFromClient
    }
    else{
      this.activatedRoute.params.subscribe(params => {
        this.jobId = params['jobid'];
        console.log("Calling getLearners with jobid = ", this.jobId);
      });
    }

    this.getAssignmentList(this.jobId);
    this.assignmentStatusWithLearner(this.jobId);
  }


  getAssignmentList(jobId) {
    this._materialService.getMaterialUsingJobId(jobId).subscribe((data) => {
      this.unit = data[0];
      this.unitArray = data;
      this.assignment = data.assignment;
      this.assignmentLength = this.unit.assignment.length;
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

  checkArrayWithDate(assignmentArray, assignment) {
    let index = _.findIndex(assignmentArray, function (o) { return o.assignmentId == assignment; });
    if (index >= 0) {
      const statusAndDate = assignmentArray[index].assignmentStatus + ' on ' + this.datePipe.transform(assignmentArray[index].updatedAt, 'MMMM d, y');

      return statusAndDate;
    } else {
      return 'Unassigned';
    }
  }


  assignmentStatusWithLearner(jobId) {
    this._materialService.assignmentStatusWithLearner(jobId).subscribe((data) => {
      this.learner = data;
      this.learnerLength = this.learner.length;
      console.log('Learner List:::::::::::::::::::::::',this.learner);
    });
  }
}
