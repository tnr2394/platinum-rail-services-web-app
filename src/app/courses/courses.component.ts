import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseService } from '../services/course.service';
import { Observable } from 'rxjs';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent, MatDialog } from '@angular/material';
import { AddCourseModalComponent } from './add-course-modal/add-course-modal.component';
import { EditCourseModalComponent } from './edit-course-modal/edit-course-modal.component';
import { FilterService } from "../services/filter.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})

export class CoursesComponent implements OnInit {
  loading: Boolean;
  courses: any = [];
  bgColors: string[];
  lastColor;
  length;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  view;

  displayedColumns: string[] = ['title', 'duration', 'actions'];
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


  constructor(private router: Router, public _courseService: CourseService, public dialog: MatDialog, public _filter: FilterService, public _snackBar: MatSnackBar) {
    this.bgColors = ["badge-info", "badge-success", "badge-warning", "badge-primary", "badge-danger"];
    this.courses = [];
    this.dataSource = new MatTableDataSource(this.courses);
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
  ngOnInit() {
    console.log("VALUE OF COURSES IS", this.courses);

    this.loading = true;
    this.getCourses();
    if (this.router.url.includes('/dashboard')) {
      this.view = true;
      console.log("VIEW VALUE IS", this.view)
    }

  }


  // UTILITY

  updateData(courses) {
    console.log("UPDATING DATA = ", courses)
    this.dataSource = new MatTableDataSource(courses);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log("SETTING SORT TO = ", this.dataSource.sort)
    console.log("SETTING paginator TO = ", this.dataSource.paginator)

  }



  // MODALS
  addCourseModal() {
    var addedCourse = this.openDialog(AddCourseModalComponent).subscribe((courses) => {
      if (courses == undefined) return;
      console.log("Course added in controller = ", courses);
      this.courses.push(courses);
      this.openSnackBar("Course Added Successfully", "Ok");
      this.updateData(this.courses);
    }, err => {
      return this.openSnackBar("Course could not be Added", "Ok");
    });
  }


  editCourseModal(index, data) {
    this.openDialog(EditCourseModalComponent, data).subscribe((course) => {
      console.log("DIALOG CLOSED", course)

      // Handle Undefined
      if (!course) { return }
      // Handle Error
      if (course.result == "err") return this.openSnackBar("Course could not be edited", "Ok");

      // EDIT HANDLE
      if (course.action == 'edit') {
        console.log("HANDLING EDIT SUCCESS", course.data);
        data = course.data;
        var Index = this.courses.findIndex(function (i) {
          return i._id === data._id;
        })
        this.courses[Index] = course.data;
      }
      // DELETE HANDLE
      else if (course.action == 'delete') {
        console.log("Deleted ", course);
        this.courses.splice(this.courses.findIndex(function (i) {
          return i._id === data._id;
        }), 1);
      }
      this.updateData(this.courses);
      this.handleSnackBar({ msg: "Course Edited Successfully", button: "Ok" });
    });
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




  // API CALLS

  getCourses() {
    var that = this;
    this._courseService.getCourses().subscribe((courses) => {
      this.courses = courses;
      this.loading = false;
      this.updateData(courses)
    });
  }
}
