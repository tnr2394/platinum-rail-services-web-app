import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { LearnerService } from '../../services/learner.service';
import { ActivatedRoute } from '@angular/router';
import { FilterService } from '../../services/filter.service';
import { Observable } from 'rxjs';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-exams-results',
  templateUrl: './exams-results.component.html',
  styleUrls: ['./exams-results.component.scss']
})

export class ExamsResultsComponent implements OnInit {
  job;
  learners: any = [];
  bgColors: string[];
  lastColor;
  length;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  jobId;
  displayedColumns: string[] = ['name', 'email', 'exam1', 'exam2'];
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  sort: MatSort;
  currentUser;
  loading: Boolean;

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  @Input('jo') isActive: Boolean;
  @Input('jobId') jobIdFromClient;
  @Output() getLearnersFromComponent: EventEmitter<any> = new EventEmitter<any>();
  @Output() learnerAdded: EventEmitter<any> = new EventEmitter<any>();

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  constructor(public _learnerService: LearnerService, public dialog: MatDialog, public _filter: FilterService, public _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute, private _jobService: JobService) {
    this.bgColors = ["badge-info", "badge-success", "badge-warning", "badge-primary", "badge-danger"];
    this.learners = [];
    this.dataSource = new MatTableDataSource(this.learners);
  }

  ngOnInit() {
    console.log("jobIdFromClient", this.jobIdFromClient);
    this.loading = true;
    if (this.jobIdFromClient != undefined) {
      this.jobId = this.jobIdFromClient
    }
    else {
      this.activatedRoute.params.subscribe(params => {
        this.jobId = params['jobid'];
        console.log("Calling getLearnersFromComponent with jobid = ", this.jobId);
      })
    }
    this.getLearners(this.jobId);
    this.getJob(this.job);
    this.currentUser = JSON.parse(localStorage.currentUser);
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

  getRandomColorClass(i) {
    var rand = Math.floor(Math.random() * this.bgColors.length);
    rand = i % 5;
    this.lastColor = rand;
    return this.bgColors[rand];
  }


  // UTILITY

  updateData(learners) {
    console.log("UPDATING DATA = ", learners)
    console.log("Emitting event getLearnersFromComponent with learners = ", learners);
    this.getLearnersFromComponent.emit({ learners })
    this.dataSource = new MatTableDataSource(learners);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log("SETTING SORT TO = ", this.dataSource.sort)
    console.log("SETTING paginator TO = ", this.dataSource.paginator)

  }

  handleSnackBar(data) {
    this.openSnackBar(data.msg, data.button);
  }

  openDialog(someComponent, data = {}): Observable<any> {
    console.log("OPENDIALOG", "DATA = ", data);
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  save(learner) {
    console.log('Cliecked');
    console.log('learners::::::', learner);
    this._learnerService.submitExamMarks(learner).subscribe((learners) => {
      this.learners = learners;
      this.loading = false;
      console.log("GOT LeARNERS");
      // this.updateData(learners)
    });
  }




  // API CALLS

  getLearners(jobId) {
    var that = this;
    console.log("Getting learners for jobid = ", jobId);
    this._learnerService.getLearnersByJobId(jobId).subscribe((learners) => {
      this.learners = learners;
      this.loading = false;
      console.log("GOT LeARNERS");
      this.updateData(learners)
    });
  }
  getJob(jobId) {
    var that = this;
    console.log("Getting JOB for jobid = ", this.jobId);
    this._jobService.getJobById(this.jobId).subscribe((jobs) => {
      console.log("Job Received = ", jobs);
      this.job = jobs.pop();
      console.log({ job: this.job });
    });
  }
}

