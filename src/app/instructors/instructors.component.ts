import { Component, OnInit, ViewChild } from '@angular/core';
import { InstructorService } from '../services/instructor.service';
import { Observable } from 'rxjs';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent, MatDialog } from '@angular/material';
import { AddInstructorModalComponent } from './add-instructor-modal/add-instructor-modal.component';
import { EditInstructorModalComponent } from './edit-instructor-modal/edit-instructor-modal.component';
import { FilterService } from "../services/filter.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-instructors',
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.scss']
})
export class InstructorsComponent implements OnInit {
  loading: Boolean;
  instructors: any = [];
  bgColors: string[];
  lastColor;
  length;
  view;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  displayedColumns: string[] = ['name', 'dateOfJoining', 'actions'];
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  sort: MatSort;
  searchText;

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

  constructor(private router: Router, public _instructorService: InstructorService, public dialog: MatDialog, public _filter: FilterService, public _snackBar: MatSnackBar) {
    this.bgColors = ["badge-info", "badge-success", "badge-warning", "badge-primary", "badge-danger"];
    this.instructors = [];
    this.dataSource = new MatTableDataSource(this.instructors);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    const paginatorIntl = this.paginator._intl;
    paginatorIntl.nextPageLabel = '';
    paginatorIntl.previousPageLabel = '';
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filter(searchText) {
    console.log('FILTER CALLED', searchText);
    if (searchText === '') {
      this.dataSource = this.instructors;
      this.dataSource.paginator = this.paginator;
      // this.handlePage({pageIndex:0, pageSize:this.pageSize});
      return;
    }
    this.dataSource = this._filter.filter(searchText, this.instructors, ['name']);
    this.dataSource.paginator = this.paginator;
    // this.filiterator();
  }

  getRandomColorClass(i) {
    var rand = Math.floor(Math.random() * this.bgColors.length);
    rand = i % 5;
    this.lastColor = rand;
    return this.bgColors[rand];
  }
  
  ngOnInit() {
    this.loading = true;
    this.getCourses();

    console.log('Function is calling');

    if (this.router.url.includes('/dashboard')) {
      this.view = true;
      console.log("VIEW VALUE IS", this.view)
    }
  }


  // UTILITY

  updateData(instructors) {
    console.log("UPDATING DATA = ", instructors)
    this.dataSource = new MatTableDataSource(instructors);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log("SETTING SORT TO = ", this.dataSource.sort)
    console.log("SETTING paginator TO = ", this.dataSource.paginator)

  }
  showFormattedDate(date) {
    var d = new Date(date);
    return d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
  }


  // MODALS
  addInstructorModal() {
    var addedInstructor = this.openDialog(AddInstructorModalComponent).subscribe((instructors) => {
      if (instructors == undefined) return;
      console.log("Instructor added in controller = ", instructors);
      this.instructors.push(instructors);
      this.openSnackBar("Instructor Added Successfully", "Ok");
      this.updateData(this.instructors);
    }, err => {
      return this.openSnackBar("Instructor could not be Added", "Ok");
    });
  }


  editInstructorModal(index, data) {
    this.openDialog(EditInstructorModalComponent, data).subscribe((instructor) => {
      console.log("DIALOG CLOSED", instructor)
      // Handle Undefined

      if (!instructor) { return }

      // Handle Error

      if (instructor && instructor.result == "err") return this.openSnackBar("instructor could not be edited", "Ok");

      // EDIT HANDLE
      if (instructor && instructor.action == 'edit') {
        console.log("HANDLING EDIT SUCCESS", instructor.data);
        data = instructor.data;
        var Index = this.instructors.findIndex(function (i) {
          return i._id === data._id;
        })
        this.instructors[Index] = instructor.data;
        this.handleSnackBar({ msg: "Instructor Edited Successfully", button: "Ok" });
      }
      // DELETE HANDLE
      else if (instructor && instructor.action == 'delete') {
        console.log("Deleted ", instructor);
        this.instructors.splice(this.instructors.findIndex(function (i) {
          return i._id === data._id;
        }), 1);
        this.handleSnackBar({ msg: "Instructor Deleted Successfully", button: "Ok" });
      }
      this.updateData(this.instructors);

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

  goToSingleInstructor(instructor) {
    let NavigationExtras: NavigationExtras = {
      state: {
        instructor: instructor,
      }
    };
    this.router.navigateByUrl('/instructors/' + instructor._id)
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  // API CALLS

  getCourses() {
    var that = this;
    this._instructorService.getInstructors().subscribe((instructors) => {
      this.instructors = instructors;
      this.loading = false;
      this.updateData(instructors)
    });
  }
}
