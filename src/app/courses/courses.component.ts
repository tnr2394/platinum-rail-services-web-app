import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {CourseService} from '../course.service';

import { Observable } from 'rxjs';
import { Course } from '../interfaces/course';
import { MatPaginator, PageEvent } from '@angular/material';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  courses: any;
  bgColors: string[];
  lastColor;
  currentPage: any;
  dataSource: any;
   // MatPaginator Inputs
   length = 100;
   pageSize = 5;
   pageSizeOptions: number[] = [5, 10, 25, 100];
   displayedColumns;
   // MatPaginator Output
   pageEvent: PageEvent;
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;

  constructor(public _courseService: CourseService) {
    this.bgColors = ["badge-info","badge-success","badge-warning","badge-primary","badge-danger"]; 
    this.courses = [];
    // this.courses = [{_id:"123",title:"Hello",duration:24}];
    this.displayedColumns = ['Sr.No.', 'Title', 'Duration', 'Action'];
    this.dataSource = this.courses;
    this.dataSource.paginator = this.paginator;
    
    // this.dataSource.paginator.pageIndex = 0;


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
  

  getCourses(){
    var that = this;
    this._courseService.getCourses().subscribe((data)=>{
      this.courses = data;
      console.log("Data Received : ",this.courses);
      // this.dataSource = this.courses;
      this.handlePage({pageIndex:0, pageSize:5});

    });
    // this.$courses = this._courseService.getCourses().pipe();
  }
}
