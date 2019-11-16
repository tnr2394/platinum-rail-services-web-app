import { Component, OnInit, ViewChild } from '@angular/core';
import {CourseService} from '../services/course.service';
import { Observable } from 'rxjs';
import { MatPaginator, PageEvent, MatDialog } from '@angular/material';
import { AddJobModalComponent } from './add-job-modal/add-job-modal.component';
import { EditJobModalComponent } from './edit-job-modal/edit-job-modal.component';
import {FilterService} from "../services/filter.service";
import { JobService } from "../services/job.service";

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  searchText: string;
  jobs;
  courses: any = [];
  bgColors: string[];
  lastColor;
  currentPage: any;
  dataSource: any;
  // MatPaginator Inputs
  length;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  // MatPaginator Output
  pageEvent: PageEvent;
  
  
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  
  constructor(public _jobService: JobService, public _courseService: CourseService,public dialog: MatDialog, public _filter: FilterService) {
    this.bgColors = ["badge-info","badge-success","badge-warning","badge-primary","badge-danger"]; 
    // this.courses = [];
    this.jobs = [];
    this.dataSource = this.jobs;
    this.dataSource.paginator = this.paginator;
    
  }
  
  ngAfterViewInit() {
    this.paginator.page.subscribe(
      (event) => {
        console.log("Paginator",event)
        this.handlePage(event);
      });
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
    }
    
    
    // UTILITY
    filter(searchText){
      console.log("FILTER CALLED",searchText);
      if(searchText === ""){
        this.dataSource = this.jobs;
        this.dataSource.paginator = this.paginator;
        this.handlePage({pageIndex:0, pageSize:this.pageSize});
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
        console.log("Subscribe Listend Job added = ",job);
        this._jobService.addJob(job).subscribe(jobs=>{
          this.jobs = jobs;
        });
      });
    }
    
    
    // editJobModal(data){
    //   this.openDialog(EditJobModalComponent,data).subscribe((job)=>{
    //     if(job == undefined) return;
    //     if(data.title !== job.title || data.duration !== course.duration){
    //       this._courseService.editCourse(course).subscribe(courses=>{
    //         this.courses = courses;
    //         this.handlePage({pageIndex:0, pageSize:5});
    //       });
    //     }
    //   });
    // }
    
    
    
    
    
    openDialog(someComponent,data = {}): Observable<any> {
      console.log("OPENDIALOG","DATA = ",data)
      const dialogRef = this.dialog.open(someComponent, data);
      return dialogRef.afterClosed();
    }
    
    
    
    
    
    
    
    // API CALLS
    
    // getCourses(){
    //   var that = this;
    //   this._courseService.getCourses().subscribe((data)=>{
    //     this.courses = data;
    //     console.log("Data Received : ",this.courses);
    //     // Linking with paginator
    //     // this.handlePage({pageIndex:0, pageSize:5});
        
    //   });
    // }

    getJobs(){
      var that = this;
      this._jobService.getJobs().subscribe((data)=>{
        this.jobs = data;
        console.log("Jobs Received : ", this.jobs);
        // Linking with paginator
        this.handlePage({pageIndex:0, pageSize:5});
      })
    }
    
    
    
    
    
    // Paginator
    public handlePage(e: any) {
      this.currentPage = e.pageIndex;
      this.pageSize = e.pageSize;
      console.log("HANDLING PAGE EVENT ",{pageSize: this.pageSize,currentPage: this.currentPage})
      this.iterator();
    }
    
    private iterator() {
      const end = (this.currentPage + 1) * this.pageSize;
      const start = this.currentPage * this.pageSize;
      const part = this.jobs.slice(start, end);
      this.dataSource = part;
      this.dataSource.paginator = this.paginator;
      if(this.dataSource.paginator == undefined) this.dataSource.paginator.pageIndex = 0;
      console.log("Iterator = ",this.dataSource);
      
    }
    // END PAGINATOR
  }
  