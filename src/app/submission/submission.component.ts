import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent, MatDialog } from '@angular/material';
import { FilterService } from "../services/filter.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { LearnerService } from '../services/learner.service';
import { JobService } from '../services/job.service';
import { CourseService } from '../services/course.service';
import { MaterialService } from "../services/material.service";
import { Router, NavigationExtras, ActivatedRoute, PRIMARY_OUTLET } from "@angular/router";
import { Pipe, PipeTransform } from '@angular/core';
import { NgForm } from '@angular/forms';
import { isEmpty } from 'rxjs/operators';
import { NavigationService } from '../services/navigation.service';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { resolve } from 'url';
import { reject } from 'q';



@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})

export class SubmissionComponent implements OnInit {
  loadingJobs: Boolean;
  loadingAssignments: Boolean
  loadingLearners: Boolean
  learners: any = [];
  jobs = [];
  courses;
  selectedJob;
  selectedCourse;
  selectedMaterial;
  materials = [];
  title = []
  options = [];
  statusList = [];
  unitNo = []
  assignmentNo = [];
  assignment: any = [];
  unitList = [];
  selectedUnit;
  selectedAssignment;
  displayedColumns: string[] = ['learnerName', 'Assignment', 'Status', 'View'];
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  sort: MatSort;
  // @ViewChild('form') ngForm: NgForm;
  model = { optionOne: false, optionTwo: false, optionThree: false }
  formChangesSubscription;
  filteredLearners = [];
  sepArray = [];
  bgColors = [];
  justUnit = [];
  filterAssignment = [];
  unit = [];
  finalLearner = [];
  lastColor;
  copyLearners;
  firstJob

  selJob;
  selUnit;
  selAss;
  selStatus: any = [];

  queryParamsObj = {}

  assignmentStatus = [
    { id: '0', label: 'Completed', display: 'Completed', status: 'Completed', checked: false },
    { id: '0', label: 'Pending', display: 'Pending', status: 'Pending', checked: false },
    { id: '1', label: 'Re-Submitted', display: 'ReSubmitted', status: 'Re-submitted', checked: false },
    { id: '2', label: 'Resubmit Requestted', display: 'ResubmitRequested', status: 'Requested for Resubmission', checked: false },
    { id: '3', label: 'Submitted', display: 'Submitted', status: 'Submitted', checked: false },
  ];
  initialData: any;
  allLearners: any
  actualList: [];
  // filterUnit: []


  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(private change: ChangeDetectorRef, private route: ActivatedRoute, private navService: NavigationService, private router: Router, public _materialService: MaterialService, public _courseService: CourseService, public _learnerService: LearnerService, public _jobService: JobService, public _filter: FilterService, public _snackBar: MatSnackBar) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.dataSource = new MatTableDataSource(this.learners);
    this.bgColors = ["badge-info", "badge-success", "badge-warning", "badge-primary", "badge-danger"];
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit() {

    // console.group(" Ng On init ")

    this.route.queryParams.subscribe(params => {

      console.log("params", params, typeof (params))

      if (params.Pending && params.Pending == 'true') {
        this.queryParamsObj['Pending'] = true;
        this.assignmentStatus.forEach((e2) => {
          if (e2.display == 'Pending') {
            e2.checked = true
          }
        })
      }

      if (params.Completed && params.Completed == 'true') {
        this.queryParamsObj['Completed'] = true;
        this.assignmentStatus.forEach((e2) => {
          if (e2.display == 'Completed') {
            e2.checked = true
          }
        })
      }

      if (params.Submitted && params.Submitted == 'true') {
        this.queryParamsObj['Submitted'] = true;
        this.assignmentStatus.forEach((e2) => {
          if (e2.display == 'Submitted') {
            e2.checked = true
          }
        })
      }

      if (params.ReSubmitted && params.ReSubmitted == 'true') {
        this.queryParamsObj['ReSubmitted'] = true;
        this.assignmentStatus.forEach((e2) => {
          if (e2.display == 'ReSubmitted') {
            e2.checked = true
          }
        })
      }

      if (params.ResubmitRequested && params.ResubmitRequested == 'true') {
        this.queryParamsObj['ResubmitRequested'] = true;
        this.assignmentStatus.forEach((e2) => {
          if (e2.display == 'ResubmitRequested') {
            e2.checked = true
          }
        })
      }


      if (params) {


        this.selJob = params.job;
        this.queryParamsObj['job'] = this.selJob;

        const paramsJobId = params.job || null
        const paramsUnit = params.unit
        const paramsAssignment = params.assignment


        this.serverFilter(params);

        if (paramsJobId != 'undefined' && paramsJobId != 'null' && paramsJobId) {
          this.getAssignmentList(paramsJobId);
          this.queryParamsObj['job'] = paramsJobId;
          this.getAllAllotedAssignmentsUsingJobId(paramsJobId).then((data) => {
            console.log(" All allLearners data", data)
            if (data != null && data != undefined) {
              this.allLearners = JSON.parse(JSON.stringify(data))
              this.actualList = JSON.parse(JSON.stringify(data))
            }


            if (paramsUnit != undefined) {
              this.selUnit = Number(paramsUnit);
              console.log('this.selUnit :::::::::::::', this.selUnit);
              this.queryParamsObj['unit'] = this.selUnit;
              this.filterAssignmentUsingUnitNumber(this.selUnit);
            }

            if (paramsAssignment != undefined) {
              this.selAss = paramsAssignment;
              this.queryParamsObj['assignment'] = this.selAss;
            }

          }).catch((error) => {
            console.log(" Error ", error)
          })
        }
        else {
          console.log(" Without params ")
          this.getJobs();
        }
      } else {
        console.log(" ELSE ")
      }
    })
    this.loadingJobs = true;
    this.getJobs();
  }

  jobChanged(event) {
    console.log("event details", event.value)
    delete this.queryParamsObj['unit'];
    delete this.queryParamsObj['assignment'];
    this.queryParamsObj['job'] = event.value;
    this.changeQuery();
  }

  selectedStatus(event, index, status, display) {
    console.log("event", event, "index", index, "status", status);
    if (event == true) {
      this.queryParamsObj[display] = true;
      this.changeQuery();
    }

    else if (event == false) {
      this.queryParamsObj[display] = false;
      this.changeQuery();
      console.log('Event false Called');
    }
  }


  filterUsingStatus(assignment) {
    if (!assignment.length) {
    } else {
      const finalarray = [];
      this.learners.forEach((e1) => assignment.forEach((e2) => {
        if (e1.assignmentStatus == e2) {
          finalarray.push(e1)
        }
      }));
    }
  }


  assignmentNoChanged(event) {
    this.selectedAssignment = event.value;
    this.queryParamsObj['assignment'] = this.selectedAssignment;
    this.changeQuery();
  }


  unitNoChanged(event) {
    this.selectedUnit = event.value;
    this.filterAssignmentUsingUnitNumber(this.selectedUnit);
    this.queryParamsObj['unit'] = this.selectedUnit;
    delete this.queryParamsObj['assignment'];
    this.changeQuery();
  }

  filterAssignmentUsingUnitNumber(unitNo) {
    console.log('Unit No::::', unitNo);
    this.unit.forEach((e1) => {
      if (e1._id == unitNo) {
        this.assignment = e1.assignment;
      }
    })
  }


  getRandomColorClass(i) {
    var rand = Math.floor(Math.random() * this.bgColors.length);
    rand = i % 5;
    this.lastColor = rand;
    return this.bgColors[rand];
  }

  goToInstructorsSubmission(learner) {
    let NavigationExtras: NavigationExtras = {
      state: {
        learner: learner,
        title: this.selectedMaterial.title,
        unitNo: this.unitNo,
        assignmentNo: this.assignmentNo
      }
    };
    this.router.navigateByUrl('/submission/learner/learner._id', NavigationExtras)
  }

  // API CALLS
  getJobs() {
    this._jobService.getJobs().subscribe((data) => {
      this.jobs = data;
      this.loadingJobs = false;
      console.log("JOBS ARE", this.jobs)
    });
  }


  // UTILITY UPDATE DATA
  updateData(learner) {
    console.log("UPDATING DATA = ", learner)
    this.dataSource = new MatTableDataSource(learner);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log("SETTING SORT TO = ", this.dataSource.sort)
    console.log("SETTING paginator TO = ", this.dataSource.paginator)
  }

  getAssignmentList(jobId) {
    this._materialService.getMaterialUsingJobIdWithNoGroup(jobId).subscribe((data) => {
      this.unit = data;
      this.assignment = data[0].assignment;
    });
  }


  getAllAllotedAssignmentsUsingJobId(jobId) {
    return new Promise((resolve, reject) => {
      this._materialService.allAllotedAssignmentUsingJobId(jobId).subscribe((data) => {

        console.log('data===========>>>>>>>.', data)
        if (data.length) {
          console.log('Inside IF');
          this.learners = data;
          this.copyLearners = this.learners;
          this.loadingAssignments = false;
          return resolve(this.copyLearners);
        } else {
          console.log('Inside Else');
          this.copyLearners = null;
          return resolve(this.copyLearners);
        }


        // console.log('Data=========>>>>>>>>>>>>>>', data);
        // var obj = data[0];
        // if (!isEmpty(obj)) {
        //   this.learners = data;
        //   this.copyLearners = this.learners;
        //   this.loadingAssignments = false;
        //   return resolve(this.copyLearners);
        // } else {
        //   this.copyLearners = [];
        //   return resolve(this.copyLearners);
        // }

        // function isEmpty(obj) {
        //   for (var key in obj) {
        //     if (obj.hasOwnProperty(key))
        //       return false;
        //   }
        //   return true;
        // }

      });
    })

  }



  getAllotmentListUsingAssignmentId(assignmentId) {
    this._learnerService.getAllotmentListUsingAssignmentId(assignmentId).subscribe((data) => {
      this.learners = data;
      this.loadingLearners = false;
    });
  }



  // Change query
  changeQuery() {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: this.queryParamsObj });
  }


  serverFilter(paramsData) {
    return new Promise((resolve, reject) => {
      this._materialService.filterAllotedAssignment(paramsData).subscribe((data) => {

        var obj = data[0];
        if (!isEmpty(obj)) {
          this.learners = data;
          this.copyLearners = this.learners;
          this.loadingAssignments = false;
          this.updateData(this.learners)

          return resolve(this.copyLearners);
        } else {
          this.copyLearners = [];
          return resolve(this.copyLearners);
        }

        function isEmpty(obj) {
          for (var key in obj) {
            if (obj.hasOwnProperty(key))
              return false;
          }
          return true;
        }

      });

    })

  }

}
