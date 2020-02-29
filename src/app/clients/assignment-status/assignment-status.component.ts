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
  unitArrayCopy: any;
  selectedLearnerArray: any[];
  selectedUnitsArray: any[];
  allotmentArray = [];

  ngOnChanges(changes) {
    console.log("IN ON CHANGES", changes);
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
  loading;
  selectedLearners;
  selectedUnits;
  @Input('jobId') jobIdFromClient;
  constructor(private datePipe: DatePipe, private activatedRoute: ActivatedRoute, private _materialService: MaterialService, private _learnerService: LearnerService, private _jobService: JobService) {
    this.learners = [];
    this.dataSource = new MatTableDataSource(this.learners);
  }

  // public test() {
  //   console.log("CALLED FROM MATERIALS");
  // }

  ngOnInit() {
    this.loading = true
    // this.optionsForlearners = {
    //   multiple: true,
    //   placeholder: {
    //     id: '0', // the value of the option
    //     text: 'Select an option'
    //   },
    //   allowClear: true,
    //   closeOnSelect: false
    // }
    // this.optionsForUnits = {
    //   multiple: true,
    //   placeholder: "Choose Unit Numbers",
    //   allowClear: true,
    //   closeOnSelect: false
    // }
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
    this.assignmentStatusWithLearner();
  }

  // changedLearner(data: { value: string[] }) {
  //   console.log("change", data);
  //   this.currentLearner = data.value.join(',');
  //   // this.queryParamsObj['instructorId'] = this.current;
  //   console.log("this.current", this.currentLearner);
  // }
  learnersSelected(){
    console.log("***seleted Learners are", this.selectedLearners);
  }
  
  changedUnit(data: { value: string[] }) {
    console.log("change", data);
    this.currentUnit = data.value.join(',');
    // this.queryParamsObj['instructorId'] = this.current;
    console.log("this.current", this.currentUnit);
  }

  getFilteredData() {
    this.selectedLearnerArray = []
    if(this.selectedLearners){
      this.selectedLearners.forEach(learner => {
        console.log("in for each learner is", learner);
        this.selectedLearnerArray.push(learner._id)
      })
    }
   
    this.selectedUnitsArray = []
    if(this.selectedUnits){
      this.selectedUnits.forEach(unit => {
        console.log("in for each unit is", unit);
        this.selectedUnitsArray.push(unit.id)
      })
    }
    
    // this.loading = true;
    console.log("**this.selectedLearners", this.selectedLearners, "selectedLearnersArray", this.selectedLearnerArray);
    console.log("**this.selectedUnits", this.selectedUnits, "selectedUnitsArray", this.selectedUnitsArray);
    if (this.selectedUnitsArray && this.selectedUnitsArray.length > 0) {
      this.unitArray = []
      this.selectedUnitsArray.forEach(unit => {
        var index = _.findIndex(this.unitArrayCopy, function (o) { return o._id == unit })
        if (index > -1) this.unitArray.push(this.unitArrayCopy[index])
      })
    }
    else this.unitArray = this.unitArrayCopy
    
    this.assignmentStatusWithLearner()
    
  }


  getAssignmentList(jobId) {
    this._materialService.getMaterialUsingJobId(jobId).subscribe((data) => {
      this.unit = data[0];
      this.unitArray = data;
      console.log("**this.unitArray", this.unitArray);
      this.unitArrayCopy = data
      data.forEach(value => {
        if (value._id != null) {
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
      this.loading = false
    });
  }

  loadLearners(object) {
    // console.log("OBJECT", object);
    this.learners = object.learners;
    // console.log("Learners loaded by event = ", object.learners);
  }

  checkArray(assignmentArray, assignment) {
    // console.log('assignmentArray::::::::', assignmentArray);

    if (assignmentArray.length != 0) {
      let index = _.findIndex(assignmentArray, function (o) { return o.assignmentId == assignment; });
      if (index >= 0) {
        return assignmentArray[index].assignmentStatus;
      } else {
        return 'Unassigned';
      }
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

  unassignedClicked(learn, assignment, i){
    console.log("***learner", learn);
    console.log("***assignment", assignment);
    this.unit.assignment[i]['assignmentStatus'] == "selected"
    // assignment.assignmentStatus
    let newData = {
      learner: learn._id,
      assignment: assignment.assignmentId
    }
    if(this.allotmentArray){
      var index = _.findIndex(this.allotmentArray, function (o) { return (o.learnerId == newData.learner && o.assignmentId == newData.assignment)})
      if(index > -1) this.allotmentArray.splice(index,1)
      else this.allotmentArray.push(newData)
    }
    console.log("this.allotmentArray", this.allotmentArray);
  }


  assignmentStatusWithLearner() {
    let learner, unitNo
    // learner = this.selectedLearnerArray ? this.currentLearner.split(',') : undefined
    // unitNo = this.currentUnit ? this.currentUnit.split(',') : undefined
    let data = {
      _id: this.jobId,
      learner: this.selectedLearnerArray,
      unitNo: this.selectedUnitsArray
    }
    this._materialService.assignmentStatusWithLearner(data).subscribe((data) => {
      if (data.length == 0) {
        return;
      } else {
        this.learner = data;
        console.log('this.learner======~~~~~', this.learner);
        data.forEach(value => {
          let temp = {
            id: value._id,
            text: value.learnerName
          }
          this.learnerToDisplay.push(temp)
        })
        console.log("**learnerToDisplay", this.learnerToDisplay);
        this.learnerLength = this.learner.length;
        this.loading = false
      }
    });
  }
}
