import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent, MatDialog } from '@angular/material';
import { FilterService } from "../services/filter.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { LearnerService } from '../services/learner.service';
import { JobService } from '../services/job.service';
import { CourseService } from '../services/course.service';
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
  displayedColumns: string[] = ['Learner', 'Status', 'View'];
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

  constructor(private router: Router,public _courseService: CourseService,public _learnerService: LearnerService, public _jobService: JobService, public _filter: FilterService, public _snackBar: MatSnackBar) {
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
    // this.getLearners(jobId);
    this.getCourses();
    console.log("THIS>DATASOURCE", this.dataSource)
  }
  courseChanged(event){
    this.selectedCourse = event.value;
    console.log('this.selectedCourse', this.selectedCourse)
    this.jobs = []
    this.getJobs();
  }
  jobChanged(event){
    console.log('job changed', event)
    this.selectedJob = event.value._id;
    this.getLearners(this.selectedJob);
  }
  materialChanged(event){
    this.selectedMaterial = event.value
  }
  goToInstructorsSubmission(learner){
    console.log("LEARNER",learner)
    let NavigationExtras: NavigationExtras = {
      state: {
        learner: learner,
        material: this.selectedMaterial  
      }
    };
    this.router.navigateByUrl('/submission/learner/learner._id', NavigationExtras)
  }

  // API CALLS
  getJobs() {
    this._jobService.getJobs().subscribe((data) => {
      data.forEach((job)=>{
        if(job.course._id == this.selectedCourse._id){
          this.jobs.push(job)
        }
      })
      console.log("JOBS ARE", this.jobs)
  });
}
  getLearners(jobId) {
    this._learnerService.getLearnersByJobId(jobId).subscribe((data)=>{
      this.learners = data;
      this.dataSource = new MatTableDataSource(this.learners);
      console.log("-----LEARNERS ARE-----",this.learners)
    });
  }
  
  getCourses(){
    this._courseService.getCourses().subscribe((course)=>{
      console.log("COURSES ARE", course)
      this.courses = course;
    })
  }
  // routerLink = "/submission/learner/{{learner._id}}
}
