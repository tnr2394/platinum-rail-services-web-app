import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { LearnerService } from '../../services/learner.service';
import { ActivatedRoute } from '@angular/router';
import { FilterService } from '../../services/filter.service';
import { AddLearnerModalComponent } from '../../learners/add-learner-modal/add-learner-modal.component';
import { EditLearnerModalComponent } from '../../learners/edit-learner-modal/edit-learner-modal.component';
import { Observable } from 'rxjs';
import { JobService } from '../../services/job.service';
import { AllocateLearnerModalComponent } from './allocate-learner-modal/allocate-learner-modal.component';
import { MaterialsComponent } from '../../courses/materials/materials.component';
import { AssignmentStatusComponent } from '../../clients/assignment-status/assignment-status.component'


@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit, AfterViewInit {
  job;
  learners: any = [];
  materials = [];
  bgColors: string[];
  lastColor;
  length;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  jobId;
  displayedColumns: string[] = ['name', 'email', 'actions'];
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  sort: MatSort;
  displayAllocate: Boolean = true;
  currentUser;
  startDate;
  endDate;

  @ViewChild(MaterialsComponent, { static: false }) materialsComp: MaterialsComponent;
  @ViewChild(AssignmentStatusComponent, { static: false }) assignmentStatusComp: AssignmentStatusComponent;

  constructor(public _learnerService: LearnerService, public dialog: MatDialog, public _filter: FilterService, public _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute, private _jobService: JobService) {
    this.bgColors = ["badge-info", "badge-success", "badge-warning", "badge-primary", "badge-danger"];
    this.learners = [];
    this.dataSource = new MatTableDataSource(this.learners);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.jobId = params['jobid'];
      console.log("Calling getLearners with jobid = ", this.jobId);
      this.getJob(this.job);
    });

    this.currentUser = JSON.parse(localStorage.currentUser);
  }
  ngAfterViewInit(): void {

    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

  }

  openDialog(someComponent, data = {}): Observable<any> {
    console.log("OPENDIALOG", "DATA = ", data);
    const dialogRef = this.dialog.open(someComponent, { data, width: '500px', height: '600px' });
    return dialogRef.afterClosed();
  }

  loadLearners(object) {
    console.log("OBJECT", object);
    this.learners = object.learners;
    console.log("Learners loaded by event = ", object.learners);
  }
  loadMaterials(object) {
    this.materials = object.materials;
    console.log('OBJECT', object);
  }
  assignmentAdded() {
    console.log("IN ASSIGNMENT ADDED METHOD");

    this.assignmentStatusComp.ngOnInit();
  }

  allocateLearners() {
    this.openDialog(AllocateLearnerModalComponent, this.learners).subscribe((allocatedLearners) => {
      if (allocatedLearners == undefined) return
      let learners = [];
      console.log("allocatedLearners", allocatedLearners);

      if (allocatedLearners) {
        allocatedLearners.forEach((learner) => {
          learners.push({ learner: learner._id, assignments: this.materials });
        });
      }

      console.log("LEARNERS TO SEND", learners);
      this._learnerService.allocateLearner(learners).subscribe(data => {
        console.log("DATA SENT");
      });
      this.materialsComp.clearCheckBox();
      this.assignmentStatusComp.ngOnInit();
      this.openSnackBar("Materials Allocated Successfully", "Ok");
    }, err => {
      return this.openSnackBar("Materials could not be allocated", "Ok");
    });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getJob(jobId) {
    var that = this;
    console.log("Getting JOB for jobid = ", this.jobId);
    this._jobService.getJobById(this.jobId).subscribe((jobs) => {
      console.log("Job Received = ", jobs);
      this.startDate = jobs[0].startingDate;
      console.log('start Date:::::::::::::::::::::::::::', this.startDate);
      this.endDate = jobs[0].singleJobDate[jobs[0].singleJobDate.length - 1]

      var today: any = new Date();

      console.log('Today Date:::::::::::::::::::', today);

      //use Math.abs to avoid sign
      var q = Math.abs(today - this.startDate);
      var d = Math.abs(this.endDate - this.startDate);
      // alert("Rounded: " + Math.round((q / d) * 100) + "%");
      // alert("Fraction: " + ((q / d) * 100) + "%");


      this.job = jobs.pop();
      console.log("Setting job = ", { job: this.job });
    });
  }
}