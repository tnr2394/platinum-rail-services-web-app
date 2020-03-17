import { Component, OnInit, ViewChild, AfterViewInit, Input, Inject, ElementRef, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatSidenavModule, MatSidenav } from '@angular/material';
import { LearnerService } from '../../services/learner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterService } from '../../services/filter.service';
import { AddLearnerModalComponent } from '../../learners/add-learner-modal/add-learner-modal.component';
import { EditLearnerModalComponent } from '../../learners/edit-learner-modal/edit-learner-modal.component';
import { Observable } from 'rxjs';
import { JobService } from '../../services/job.service';
import { AllocateLearnerModalComponent } from './allocate-learner-modal/allocate-learner-modal.component';
import { MaterialsComponent } from '../../courses/materials/materials.component';
import { AssignmentStatusComponent } from '../../clients/assignment-status/assignment-status.component'
import { LearnersComponent } from '../../learners/learners.component'
import { SchedulerComponent } from '../../scheduler/scheduler.component'
import { MaterialService } from 'src/app/services/material.service';
declare var $: any;


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
  loading: boolean = false;
  jobForScheduler;
  completionPercent;
  clientDashboard;
  displayDetails = false
  sendDataToAllocateModal: { learners: any; materials: number; };
  learnersAlloted = false;
  @Input('jobIdFromClient') jobIdFromClient;
  @Input('jobFromClient') jobFromClient;
  @Output() openFilesSideNav: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MaterialsComponent, { static: false }) materialsComp: MaterialsComponent;
  @ViewChild(AssignmentStatusComponent, { static: false }) assignmentStatusComp: AssignmentStatusComponent;
  @ViewChild(LearnersComponent, { static: false }) learnersComp: LearnersComponent;
  allLearners: any;
  learnerAssignmentStatus: any;
  displayLearnersTab = false;


  constructor(private router: Router,
    public _learnerService: LearnerService, public dialog: MatDialog, public _filter: FilterService, 
    public _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute, private _jobService: JobService,
    private _materialService: MaterialService,) {
    this.bgColors = ["badge-info", "badge-success", "badge-warning", "badge-primary", "badge-danger"];
    this.learners = [];
    this.dataSource = new MatTableDataSource(this.learners);
  }

  ngOnInit(): void {


    this.currentUser = JSON.parse(localStorage.currentUser);

    console.log("this.jobIdFromClient", this.jobIdFromClient);

    if (this.currentUser.userRole == 'client') {
      this.clientDashboard = true;
      console.log("VIEW VALUE IS", this.clientDashboard)
    }
    if(this.jobFromClient){
      console.log("##########this.jobFromClient onInit", this.jobFromClient);
      this.jobId = this.jobFromClient._id
      this.getJob(this.jobId)
      this.getLearners(this.jobId)
      this.assignmentStatusWithLearner()
      this.learnersComp.jobIdFromClient = this.jobId
    }
    if (this.jobIdFromClient != undefined) {
      console.log("##########this.jobIdFromClient onInit", this.jobIdFromClient);
      this.jobId = this.jobIdFromClient._id
      this.getJob(this.jobId)
      this.getLearners(this.jobId)
      this.assignmentStatusWithLearner()
      this.learnersComp.jobIdFromClient = this.jobId
    }
    else {
      this.activatedRoute.params.subscribe(params => {
        this.jobId = params['jobid'];
        console.log("Calling getLearners with jobid = ", this.jobId);
        if (this.jobId != undefined) {
          this.displayLearnersTab = true
          this.getJob(this.job);
          this.assignmentStatusWithLearner()
          this.getLearners(this.jobId)
        }
      });

    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Changes in job", changes);
    if (changes.jobFromClient != undefined) {
      if (changes.jobFromClient.currentValue != undefined) {
        this.job = changes.jobFromClient.currentValue
        this.jobId = changes.jobFromClient.currentValue._id
        console.log("&&&&&&&&&&this.jobId", this.jobId);
        this.getLearners(this.jobId)
        this.assignmentStatusWithLearner()
      }
    }
    if (changes.jobFromClient && changes.jobFromClient.currentValue){
      console.log("##########this.jobFromClient On Changes", this.jobFromClient);
    }
  }

  jobChangedByClient(job) {
    console.log("in jobChangedByClient");
    this.learnersComp.jobIdFromClient = job._id;
    this.getLearners(job._id)
    // this.learnersComp.getLearners(job._id);
    this.assignmentStatusComp.assignmentStatusWithLearner()
  }
  ngAfterViewInit(): void {

    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

  }

  openDialog(someComponent, data = {}): Observable<any> {
    console.log("OPENDIALOG", "DATA = ", data);
    const dialogRef = this.dialog.open(someComponent, { data, width: '600px', height: '600px' });
    return dialogRef.afterClosed();
  }

  loadLearners(object) {
    console.log("OBJECT", object);
    this.learners = object.learners;
    console.log("Learners loaded by event = ", object.learners);
  }
  addedLearner(object) {
    console.log("Object in addedLearner", object);
    this.assignmentStatusComp.ngOnInit();
  }
  loadMaterials(object) {
    this.materials = object.materials;
    console.log('OBJECT', object);
    this.sendDataToAllocateModal = {
      learners: this.learners,
      materials: this.materials.length
    }
  }
  assignmentAdded() {
    console.log("IN ASSIGNMENT ADDED METHOD");
    this.assignmentStatusComp.ngOnInit();
  }
  scheduler(job) {
    console.log("JOB found in scheculer", job);
    this.jobForScheduler = job;
    let dialogRefScheduler = this.dialog.open(SchedulerComponent, {
      data: [this.jobForScheduler],
      // minWidth: '100vw',
      // height: '100vh'
      panelClass: 'customScheduler',
      width: '100%',
      // margin: 'auto',
      height: '100vh'
    })
  }

  allocateLearners() {
    this.learnersAlloted = false
    this.openDialog(AllocateLearnerModalComponent, this.sendDataToAllocateModal).subscribe((allocatedLearners) => {
      if (allocatedLearners == undefined) return
      let learners = [];
      if (allocatedLearners) {
        allocatedLearners.forEach((learner) => {
          learners.push({ learner: learner, assignments: this.materials });
        });
      }
      this._learnerService.allocateLearner(learners).subscribe(data => {
        console.log("DATA SENT", learners);
        this.learnersAlloted = true
        console.log("*****this.learnersAlloted", this.learnersAlloted);
        this.assignmentStatusComp.ngOnInit();
      });
      this.materialsComp.clearCheckBox();
      this.openSnackBar("Materials Allocated Successfully", "Ok");
    }, err => {
      return this.openSnackBar("Materials could not be allocated", "Ok");
    });
  }
  allocatedFromMaterialTile(event) {
    console.log("In job", event);

    this.assignmentStatusComp.ngOnInit();
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  openSideNav(event) {
    console.log("OPEN SIDE NAV EVENT", event);
    this.displayDetails = true;
  }
  getJob(jobId) {
    var that = this;
    this.loading = true;
    this._jobService.getJobById(this.jobId).subscribe((jobs) => {
      console.log("GETTING SINGLE JOB", jobs);
      this.jobForScheduler = jobs[0];
      this.job = jobs.pop();
      this.completionPercentage(this.job)
      console.log("Setting job = ", { job: this.job });
      this.loading = false;
    });
  }
  openFileDetails(event){
    this.openFilesSideNav.emit({event})
  }

  getLearners(jobId){
    this._learnerService.getLearnersByJobId(jobId).subscribe(responseLearner=>{
      this.allLearners = responseLearner;
      console.log("***this.allLearners in job", this.allLearners);
    })
  }
  assignmentStatusWithLearner(){
    console.log("this.jobId in assignmentStatusWithLearner", this.jobId);
    let data = {
      _id: this.jobId,
    }
    this._materialService.assignmentStatusWithLearner(data).subscribe(responseData=>{
      console.log("assignmentStatusWithLearner responseData", responseData);
      this.learnerAssignmentStatus = responseData
    })
  }

  completionPercentage(job) {
    this.startDate = new Date(job.singleJobDate[0]);
    this.endDate = new Date(job.singleJobDate[job.singleJobDate.length - 1])
    let start = new Date(job.singleJobDate[0]).getTime()
    let end = new Date(job.singleJobDate[job.singleJobDate.length - 1]).getTime()
    let today = new Date().getTime()
    let totalDays = (end - start) / (1000 * 3600 * 24)
    let daysPassed = (today - start) / (1000 * 3600 * 24)
    this.completionPercent = Math.round((daysPassed / totalDays) * 100);

    if (this.completionPercent < 0) {
      this.completionPercent = 0;
    }
    if (this.completionPercent > 100) {
      this.completionPercent = 100;
    }
  }
  formatSubtitle = (percent: number) => {
    return "complete"
  }
}