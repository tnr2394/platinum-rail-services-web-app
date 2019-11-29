import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { LearnerService } from '../../services/learner.service';
import { ActivatedRoute } from '@angular/router';
import { FilterService } from '../../services/filter.service';
import { AddLearnerModalComponent } from '../../learners/add-learner-modal/add-learner-modal.component';
import { EditLearnerModalComponent } from '../../learners/edit-learner-modal/edit-learner-modal.component';
import { Observable } from 'rxjs';
import {JobService} from '../../services/job.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
  job;
  learners: any = [];
  bgColors: string[];
  lastColor;
  length;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  jobId;
  displayedColumns: string[] = ['name','email','actions'];
  dataSource:  MatTableDataSource<any>;
  paginator: MatPaginator;
  sort: MatSort;
  
  
  constructor(public _learnerService: LearnerService,public dialog: MatDialog, public _filter: FilterService, public _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute, private _jobService: JobService) {
    this.bgColors = ["badge-info","badge-success","badge-warning","badge-primary","badge-danger"]; 
    this.learners = [];
    this.dataSource = new MatTableDataSource(this.learners);
  }
  
  ngOnInit(){
    this.activatedRoute.params.subscribe(params=>{
      this.jobId = params['jobid'];
      console.log("Calling getLearners with jobid = ",this.jobId);
      this.getJob(this.job);
    })    
  }
  
  
  loadLearners(object){
    this.learners = object.learners;
    console.log("Learners loaded by event = ",object.learners);
  }
  
  
  getJob(jobId){
    var that = this;
    console.log("Getting JOB for jobid = ",this.jobId);
    this._jobService.getJobById(this.jobId).subscribe((jobs)=>{
      console.log("Job Received = ",jobs);
      this.job = jobs.pop();
      console.log("Setting job = ",{job: this.job});
    });
  }
}

