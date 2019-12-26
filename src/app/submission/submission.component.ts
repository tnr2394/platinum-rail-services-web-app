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

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})

export class SubmissionComponent implements OnInit {
  learners;
  jobs = [];
  courses;
  selectedJob;
  selectedCourse;
  selectedMaterial;
  materials = [];
  title = []
  unitNo = []
  assignmentNo = [];
  assignment;
  selectedUnit;
  selectedAssignment;
  displayedColumns: string[] = ['Learner', 'Assignment', 'Status', 'View'];
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  sort: MatSort;
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
    this.getJobs();
    this.getMaterials();
  }

  jobChanged(event) {
    this.selectedJob = event.value._id;
    // this.getLearners(this.selectedJob);
    this.getAssignmentList(this.selectedJob);
  }

  materialChanged(event) {
    this.selectedMaterial = event.value
  }

  unitNoChanged(event) {
    this.selectedUnit = event.value;
  }

  assignmentNoChanged(event) {
    this.selectedAssignment = event.value;
    console.log('this.selectedAssignment', this.selectedAssignment);
    this.getAllotmentListUsingAssignmentId(this.selectedAssignment);
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
      console.log('Data----->>>>>', data);
      this.assignment = data[0].assignment;
    });
  }

  getAllotmentListUsingAssignmentId(assignmentId) {
    this._learnerService.getAllotmentListUsingAssignmentId(assignmentId).subscribe((data) => {
      this.learners = data;
      this.dataSource = new MatTableDataSource(this.learners);
      this.dataSource.paginator = this.paginator;
      console.log("-----LEARNERS ARE-----", this.learners)
    });
  }

  getMaterials() {
    this._materialService.getAllMaterials().subscribe((material) => {
      material.material.forEach((item) => {
        if (item.type == 'Assignment') {
          this.materials.push(item)
          this.title.push(item.title)
          this.unitNo.push(item.unitNo)
          this.assignmentNo.push(item.assignmentNo)
        }
      })
      console.log("MATERIAL RECIEVED", material.material)
    })
  }
}
