import { Component, OnInit, Input, OnChanges } from '@angular/core';
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
import { Select2OptionData } from 'ng2-select2';



@Component({
  selector: 'app-assignment-status',
  templateUrl: './assignment-status.component.html',
  styleUrls: ['./assignment-status.component.scss']
})
export class AssignmentStatusComponent implements OnInit, OnChanges {
  public learnerToDisplay: Array<Select2OptionData> = [];
  public optionsForlearners: Select2Options;
  public currentLearner: string;
  public unitsToDisplay: Array<Select2OptionData> = [];
  public optionsForUnits: Select2Options;
  public currentUnit: string;
  
  ngOnChanges(changes) {
    console.log("IN ON CHANGES",changes);
    // changes.prop contains the old and the new value...
  }
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

  // public test() {
  //   console.log("CALLED FROM MATERIALS");
  // }
  
  ngOnInit() {
    this.optionsForlearners = {
      multiple: true,
      placeholder: "Choose learners",
    }
    this.optionsForUnits = {
      multiple: true,
      placeholder: "Choose Unit Numbers",
    }
    // console.log("ASSIGNMENT STATU CALLED");

    // console.log("jobIdFromClient", this.jobIdFromClient);

    if (this.jobIdFromClient != undefined) {
      this.jobId = this.jobIdFromClient
    }
    else {
      this.activatedRoute.params.subscribe(params => {
        this.jobId = params['jobid'];
        // console.log("Calling getLearners with jobid = ", this.jobId);
      });
    }

    this.getAssignmentList(this.jobId);
    this.assignmentStatusWithLearner(this.jobId);
  }

  changedLearner(data: { value: string[] }) {
    console.log("change", data);
    this.currentLearner = data.value.join(',');
    // this.queryParamsObj['instructorId'] = this.current;
    console.log("this.current", this.currentLearner);
  }
  changedUnit(data: { value: string[] }) {
    console.log("change", data);
    this.currentUnit = data.value.join(',');
    // this.queryParamsObj['instructorId'] = this.current;
    console.log("this.current", this.currentUnit);
  }

  getFilteredData(){
    console.log("**this.currentLearner", this.currentLearner);
    console.log("**this.currentUnit", this.currentUnit);
    let data = {
      unitNo: this.currentUnit,
      learnerid : this.currentLearner,
      jobId: this.jobId
    }
  }


  getAssignmentList(jobId) {
    this._materialService.getMaterialUsingJobId(jobId).subscribe((data) => {
      this.unit = data[0];
      this.unitArray = data;
      data.forEach(value=>{
        if (value._id != null){
          let temp = {
            id: value._id,
            text: "Unit - " + value._id
          }
          this.unitsToDisplay.push(temp)
        }
      })
      console.log("**unit data is ", data);
      this.assignment = data.assignment;
      this.assignmentLength = this.unit.assignment.length;
    });
  }

  loadLearners(object) {
    // console.log("OBJECT", object);
    this.learners = object.learners;
    // console.log("Learners loaded by event = ", object.learners);
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

  checkArrayForRouting(assignmentArray, assignment) {
    let index = _.findIndex(assignmentArray, function (o) { return o.assignmentId == assignment; });
    if (index >= 0) {
      return assignmentArray[index].allotmentId;
    } else {
      return 'Unassigned';
    }
  }


  assignmentStatusWithLearner(jobId) {
    this._materialService.assignmentStatusWithLearner(jobId).subscribe((data) => {
      this.learner = data;
      data.forEach(value=>{
        let temp = {
          id: value._id,
          text: value.learnerName
        }
        this.learnerToDisplay.push(temp)
      })
      // console.log("**learnerToDisplay", this.learnerToDisplay);
      this.learnerLength = this.learner.length;
      // console.log('Learner List:::::::::::::::::::::::', this.learner);
    });
  }
}
