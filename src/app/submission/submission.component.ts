import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent, MatDialog } from '@angular/material';
import { FilterService } from "../services/filter.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { LearnerService } from '../services/learner.service';
import { JobService } from '../services/job.service';
import { CourseService } from '../services/course.service';
import { MaterialService } from "../services/material.service";
import { Router, NavigationExtras } from "@angular/router";
import { Pipe, PipeTransform } from '@angular/core';
import { NgForm } from '@angular/forms';
import { isEmpty } from 'rxjs/operators';



@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})

export class SubmissionComponent implements OnInit {
  loadingJobs: Boolean;
  loadingAssignments: Boolean
  loadingLearners: Boolean
  learners;
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
  assignment;
  selectedUnit;
  selectedAssignment;
  displayedColumns: string[] = ['Learner', 'Assignment', 'Status', 'View'];
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  sort: MatSort;
  // @ViewChild('form') ngForm: NgForm;
  model = { optionOne: false, optionTwo: false, optionThree: false }
  formChangesSubscription;
  filteredLearners = [];

  sepArray = [];

  assignmentStatus = [
    { id: '0', display: 'Completed', status: 'Completed', checked: false },
    { id: '0', display: 'Pending', status: 'Pending', checked: false },
    { id: '1', display: 'Re-Submitted', status: 'Re-submitted', checked: false },
    { id: '2', display: 'Resubmit Requestted', status: 'Requested for Resubmission', checked: false },
    { id: '3', display: 'Submitted', status: 'Submitted', checked: false },
  ];
  initialData: any;

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

  constructor(private router: Router, public _materialService: MaterialService, public _courseService: CourseService, public _learnerService: LearnerService, public _jobService: JobService, public _filter: FilterService, public _snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource(this.learners);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit() {
    this.loadingJobs = true;
    this.getJobs();
    // this.getMaterials();
  }

  jobChanged(event) {
    this.loadingAssignments = true;
    // this.learners = [];
    let emptyList = [];
    this.dataSource = new MatTableDataSource(emptyList);
    this.selectedJob = event.value._id;
    this.getAssignmentList(this.selectedJob);
    this.getAllAllotedAssignmentsUsingJobId(this.selectedJob);
  }

  statusChanged(data) {
    this.filterUsingStatus(data.source.value);
  }

  selectedStatus(event, index, status) {
    console.log("event", event, "index", index, "status", status);
    if (event == true) {
      this.sepArray.push(status);
    }

    else if (event == false) {
      const index = this.sepArray.indexOf(status);
      if (index > -1) {
        this.sepArray.splice(index, 1);
      }
    }
    this.filterUsingStatus(this.sepArray);
  }


  filterUsingStatus(assignment) {
    if (!assignment.length) {
      this.dataSource = new MatTableDataSource(this.learners);
    } else {
      const finalarray = [];
      this.learners.forEach((e1) => assignment.forEach((e2) => {
        if (e1.assignmentStatus == e2) {
          finalarray.push(e1)
        }
      }));
      this.dataSource = new MatTableDataSource(finalarray);
    }
  }

  assignmentNoChanged(event) {
    this.selectedAssignment = event.value;
    console.log('this.selectedAssignment', this.selectedAssignment);
    this.getAllotmentListUsingAssignmentId(this.selectedAssignment);
    this.loadingLearners = true;

  }

  goToInstructorsSubmission(learner) {
    console.log("LEARNER", learner)
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

  getLearners(jobId) {
    this._learnerService.getLearnersByJobId(jobId).subscribe((data) => {
      this.learners = data;
      this.dataSource = new MatTableDataSource(this.learners);
      console.log("-----LEARNERS ARE-----", this.learners)
    });
  }

  getAssignmentList(jobId) {
    this._materialService.getMaterialUsingJobIdWithNoGroup(jobId).subscribe((data) => {
      this.assignment = data[0].assignment;
      this.loadingAssignments = false;
      console.log(' this.assignment length', this.assignment.length);
    });
  }


  getAllAllotedAssignmentsUsingJobId(jobId) {

    this._materialService.allAllotedAssignmentUsingJobId(jobId).subscribe((data) => {

      var obj = data[0];

      function isEmpty(obj) {
        for (var key in obj) {
          if (obj.hasOwnProperty(key))
            return false;
        }
        return true;
      }

      if (!isEmpty(obj)) {
        this.learners = data;
        this.dataSource = new MatTableDataSource(this.learners);
        this.dataSource.paginator = this.paginator;
        this.loadingAssignments = false;
      }
    });
  }




  getAllotmentListUsingAssignmentId(assignmentId) {
    this._learnerService.getAllotmentListUsingAssignmentId(assignmentId).subscribe((data) => {
      this.learners = data;
      this.loadingLearners = false;
      this.dataSource = new MatTableDataSource(this.learners);
      this.dataSource.paginator = this.paginator;
      console.log("-----LEARNERS ARE-----", this.learners)
    });
  }
}
