import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { LearnerService } from '../../services/learner.service';
import { ActivatedRoute } from '@angular/router';
import { FilterService } from '../../services/filter.service';
import { AddLearnerModalComponent } from '../../learners/add-learner-modal/add-learner-modal.component';
import { EditLearnerModalComponent } from '../../learners/edit-learner-modal/edit-learner-modal.component';
import { Observable } from 'rxjs';
import { JobService } from '../../services/job.service';
import { AllocateLearnerModalComponent } from './allocate-learner-modal/allocate-learner-modal.component';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
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

  allocateLearners() {
    this.openDialog(AllocateLearnerModalComponent, this.learners).subscribe((allocatedLearners) => {
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
    });
  }

  getJob(jobId) {
    var that = this;
    console.log("Getting JOB for jobid = ", this.jobId);
    this._jobService.getJobById(this.jobId).subscribe((jobs) => {
      console.log("Job Received = ", jobs);
      this.job = jobs.pop();
      console.log("Setting job = ", { job: this.job });
    });
  }
}