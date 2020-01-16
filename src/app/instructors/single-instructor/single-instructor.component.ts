import { Component, OnInit } from '@angular/core';
import { MatPaginator, PageEvent, MatDialog } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JobService } from '../../services/job.service';
import { InstructorService } from '../../services/instructor.service';
import { FilterService } from '../../services/filter.service';
import { EditInstructorModalComponent } from '../../instructors/edit-instructor-modal/edit-instructor-modal.component'

@Component({
  selector: 'app-single-instructor',
  templateUrl: './single-instructor.component.html',
  styleUrls: ['./single-instructor.component.scss']
})
export class SingleInstructorComponent implements OnInit {

  instructor;
  instructorId;
  dataSource: MatTableDataSource<any>;
  length;
  currentUser;
  jobs;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  sort: MatSort;
  paginator: MatPaginator;
  searchText;
  loading;
  profilePath;
  view;
  // MatPaginator Output
  pageEvent: PageEvent;


  displayedColumns: string[] = ['sr.no', 'client', 'location', 'instructor', 'course', 'actions']

  constructor(public dialog: MatDialog, public _snackBar: MatSnackBar, public _filter: FilterService, public _instrctorService: InstructorService, public _jobService: JobService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.activatedRoute.params.subscribe(params => {
      this.instructorId = params.id;
    });
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<any>(this.jobs);
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.getJob(this.instructorId);
    this.getInstructor(this.instructorId);
  }

  getJob(instructorId) {
    console.log('Get Job Called');
    this._jobService.getJobByInstructorId(instructorId).subscribe((res => {
      console.log('Get Jobs', res);
      this.jobs = res;
      this.updateData(res);
    }))
  }

  getInstructor(instructorId) {
    this._instrctorService.getInstructorById(instructorId).subscribe((res => {
      console.log('Get Instructor Detail', res[0]);
      this.instructor = res[0];
      this.profilePath = this.instructor.profilePic;
    }))
  }

  editInstructorModal(index, data) {
    this.openDialog(EditInstructorModalComponent, data).subscribe((instructor) => {
      console.log("DIALOG CLOSED", instructor)

      this.getInstructor(this.instructorId);
      // Handle Undefined

      if (!instructor) { return }

      // Handle Error

      if (instructor && instructor.result == "err") return this.openSnackBar("instructor could not be edited", "Ok");

      // EDIT HANDLE
      if (instructor && instructor.action == 'edit') {
        console.log("HANDLING EDIT SUCCESS", instructor.data);
        console.log('This Instructor after update:', this.instructor);
        this.handleSnackBar({ msg: "Instructor Edited Successfully", button: "Ok" });
      }

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

  updateData(jobs) {
    this.dataSource = new MatTableDataSource(jobs);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log('SETTING SORT TO = ', this.dataSource.sort)
    console.log('SETTING paginator TO = ', this.dataSource.paginator)
  }

  filter(searchText) {
    console.log('FILTER CALLED', searchText);
    if (searchText === '') {
      this.dataSource = this.jobs;
      this.dataSource.paginator = this.paginator;
      // this.handlePage({pageIndex:0, pageSize:this.pageSize});
      return;
    }
    this.dataSource = this._filter.filter(searchText, this.jobs, ['title', 'client']);
    this.dataSource.paginator = this.paginator;
    // this.iterator();
  }

}
