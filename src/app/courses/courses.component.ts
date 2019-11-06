import { Component, OnInit, ViewChild } from '@angular/core';
import {CourseService} from '../services/course.service';
import { Observable } from 'rxjs';
import { MatPaginator, PageEvent, MatDialog } from '@angular/material';
import { AddCourseModalComponent } from './add-course-modal/add-course-modal.component';
import { EditCourseModalComponent } from './edit-course-modal/edit-course-modal.component';
import {FilterService} from "../services/filter.service";
@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  searchText: string;
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
  
  constructor(public _courseService: CourseService,public dialog: MatDialog, public _filter: FilterService) {
    this.bgColors = ["badge-info","badge-success","badge-warning","badge-primary","badge-danger"]; 
    this.courses = [];
    this.dataSource = this.courses;
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
      this.getCourses();
    }
    
    
    // UTILITY
    filter(searchText){
      console.log("FILTER CALLED",searchText);
      if(searchText === ""){
        this.dataSource = this.courses;
        this.dataSource.paginator = this.paginator;
        this.handlePage({pageIndex:0, pageSize:this.pageSize});
          return;
      }
      this.dataSource = this._filter.filter(searchText,this.courses,['title','duration']);
      this.dataSource.paginator = this.paginator;
      // this.iterator();
    }  
    // MODALS
    addCourseModal(){
      var addedCourse = this.openDialog(AddCourseModalComponent).subscribe((course)=>{
        if(course == undefined) return;
        console.log("Subscribe Listend Course added = ",course);
        this._courseService.addCourse(course).subscribe(courses=>{
          this.courses = courses;
        });
        
      });
    }
    
    
    editCourseModal(data){
      this.openDialog(EditCourseModalComponent,data).subscribe((course)=>{
        if(course == undefined) return;
        if(data.title !== course.title || data.duration !== course.duration){
          this._courseService.editCourse(course).subscribe(courses=>{
            this.courses = courses;
            this.handlePage({pageIndex:0, pageSize:5});
          });
        }
      });
    }
    
    
    
    
    
    openDialog(someComponent,data = {}): Observable<any> {
      console.log("OPENDIALOG","DATA = ",data)
      const dialogRef = this.dialog.open(someComponent, {data});
      return dialogRef.afterClosed();
    }
    
    
    
    
    
    
    
    // API CALLS
    
    getCourses(){
      var that = this;
      this._courseService.getCourses().subscribe((data)=>{
        this.courses = data;
        console.log("Data Received : ",this.courses);
        // Linking with paginator
        this.handlePage({pageIndex:0, pageSize:5});
        
      });
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
      const part = this.courses.slice(start, end);
      this.dataSource = part;
      this.dataSource.paginator = this.paginator;
      if(this.dataSource.paginator == undefined) this.dataSource.paginator.pageIndex = 0;
      console.log("Iterator = ",this.dataSource);
      
    }
    // END PAGINATOR
  }
  