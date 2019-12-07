import { Component, OnInit, ViewChild } from '@angular/core';
import {CourseService} from '../services/course.service';
import { Observable } from 'rxjs';
import { MatPaginator, PageEvent, MatDialog } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AddJobModalComponent } from './add-job-modal/add-job-modal.component';
import { EditJobModalComponent } from './edit-job-modal/edit-job-modal.component';

import { FilterService } from '../services/filter.service';
import { JobService } from '../services/job.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormsModule, NgForm } from '@angular/forms'


@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  test = [];
  searchText: string;
  jobs;
  courses: any = [];
  bgColors: string[];
  lastColor;
  currentPage: any;
  dataSource: MatTableDataSource<any>;

  // MatPaginator Inputs
  length;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  sort: MatSort;
  paginator: MatPaginator;
  // MatPaginator Output
  pageEvent: PageEvent;
  displayedColumns: string[] = ['sr.no','client','instructor','status','course','actions']
  
  // @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;

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
  
  constructor(public _jobService: JobService, public _courseService: CourseService, public dialog: MatDialog, public _filter: FilterService, public _snackBar: MatSnackBar) {
    this.bgColors = ['badge-info','badge-success','badge-warning','badge-primary','badge-danger']; 
    this.jobs = [];
    // this.dataSource = this.jobs;
    this.dataSource = new MatTableDataSource<any>(this.jobs);
    console.log("DATA SOURCE", this.dataSource)
    // 
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;    
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // this.paginator.page.subscribe(
    //   (event) => {
    //     console.log('Paginator', event)
    //     // this.handlePage(event);
    //   });
  }
   

    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    getRandomColorClass(i){
      var rand = Math.floor(Math.random() * this.bgColors.length);
      rand = i % 5;
      this.lastColor = rand;
      
      return this.bgColors[rand];
    }
    ngOnInit() {
      // this.getCourses();
      this.getJobs();
      // this.getStatus()
    }
    
  getStatus(jobs){
    console.log('in status', jobs.length)
    // jobs.forEach((item)=>{
      // console.log("---ITEM")
    // })
    let today = new Date();
    
      if(jobs.length != undefined){
        for(var i = 0; i < jobs.length ; i++){
        let status;
      for (var j = 0; j < jobs[i].singleJobDate.length; j++){
        let lastDate = new Date(jobs[i].singleJobDate.slice(-1)[0])
        let firstDate = new Date(jobs[i].singleJobDate[0])

        if( lastDate < today){
           status = 'Completed'
        }
        else if(firstDate < today && lastDate > today){
           status = 'Active'
        }
        else{
           status = 'New'
        }
      Object.assign(jobs[i], {status:status})
    }
      this.jobs = jobs;
  }}
  else{

      // Object.assign(jobs, { status: 'New' }) 
        for (var j = 0; j < jobs.singleJobDate.length; j++) {
          console.log("in else for loop")
          let lastDate = new Date(jobs.singleJobDate.slice(-1)[0])
          let firstDate = new Date(jobs.singleJobDate[0])
          if (lastDate < today) {
            status = 'Completed'
          }
          else if (firstDate < today && lastDate > today) {
            status = 'Active'
          }
          else {
            status = 'New'
          }
        }
        this.jobs.forEach((job)=>{
          if(job._id == jobs.id){
            Object.assign(job, { status: status })
            console.log("JOB", job)
          }
        })
          //
        // this.jobs.push(jobs);
      console.log("ONLY SINGLE JOB", jobs)
  }}
    
    // UTILITY
  updateData(jobs) {
    console.log('UPDATING DATA = ', jobs)
    this.dataSource = new MatTableDataSource(jobs);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log('SETTING SORT TO = ', this.dataSource.sort)
    console.log('SETTING paginator TO = ', this.dataSource.paginator)
  }

    filter(searchText){
      console.log('FILTER CALLED',searchText);
      if(searchText === ''){
        this.dataSource = this.jobs;
        this.dataSource.paginator = this.paginator;
        // this.handlePage({pageIndex:0, pageSize:this.pageSize});
          return;
      }
      this.dataSource = this._filter.filter(searchText,this.jobs,['title','client']);
      this.dataSource.paginator = this.paginator;
      // this.iterator();
    } 
    // MODALS
    addJobModal(){
      var addedJob = this.openDialog(AddJobModalComponent, { width: '1000px', height:'967px'}).subscribe((job)=>{
        if(job == undefined) return;
        console.log('Subscribe Listend Job added = ',job);
          this.jobs.push(job);
          this.updateData(this.jobs); 
          this.getStatus(job);
          this.openSnackBar("Job Added Successfully", "Ok");
      }, err => {
          return this.openSnackBar("Job could not be Added", "Ok");
      });
    }
    

  editJobModal(index, data) {
    this.openDialog(EditJobModalComponent, data).subscribe((data) => {
      console.log("DIALOG CLOSED", data)
      // Handle Error
      if (!data) return;
      if (data.result == "err") return this.openSnackBar("Job could not be edited", "Ok");

      // EDIT HANDLE
      if (data.action == 'edit') {
        console.log("HANDLING EDIT SUCCESS", data);
        data = data;
        var Index = this.jobs.findIndex(function (i) {
          console.log("GETTING INDEX", data)
          return i._id === data.data._id;
        })
        console.log("********************", "HELLO", this.jobs[Index]);
        // this.getStatus(this.jobs[Index])
        this.ngOnInit();
        this.jobs[Index] = data.data;
        // this.getStatus(this.jobs[Index])
        
        console.log("check index", Index)
      }
      // DELETE HANDLE
      else if (data.action == 'delete') {
        console.log("Deleted ", data);
        this.jobs.splice(this.jobs.findIndex(function (i) {
          return i._id === data.data._id;
        }), 1);
      }
      this.updateData(this.jobs);
      this.handleSnackBar({ msg: "Changes made Successfully", button: "Ok" });
    });
  }

  handleSnackBar(data) {
    this.openSnackBar(data.msg, data.button);
  }

    openDialog(someComponent,data = {}): Observable<any> {
      console.log('OPENDIALOG','DATA = ',data)
      const dialogRef = this.dialog.open(someComponent, { data, width: '1000px', height: '967px' });

      return dialogRef.afterClosed();
    }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

    getJobs(){
      var that = this;
      this._jobService.getJobs().subscribe((data)=>{
        this.jobs = data;
        console.log('Jobs Received : ', this.jobs);
        this.updateData(this.jobs);
        this.getStatus(data);
      })
    }
    // Paginator
    // public handlePage(e: any) {
    //   this.currentPage = e.pageIndex;
    //   this.pageSize = e.pageSize;
    //   console.log('HANDLING PAGE EVENT ',{pageSize: this.pageSize,currentPage: this.currentPage})
    //   this.iterator();
    // }
    
    // private iterator() {
    //   const end = (this.currentPage + 1) * this.pageSize;
    //   const start = this.currentPage * this.pageSize;
    //   const part = this.jobs.slice(start, end);
    //   this.dataSource = part;
    //   this.dataSource.paginator = this.paginator;
    //   if(this.dataSource.paginator == undefined) this.dataSource.paginator.pageIndex = 0;
    //   console.log('Iterator = ',this.dataSource);
      
    // }
    // END PAGINATOR
  }
  