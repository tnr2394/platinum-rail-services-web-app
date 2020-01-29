import { Component, OnInit } from '@angular/core';
import { AddFileModalComponent } from '../../files/add-file-modal/add-file-modal.component'
import { MatDialog, MatSnackBar } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LearnerService } from '../../services/learner.service';
import { FilterService } from '../../services/filter.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-learner-submission',
  templateUrl: './learner-submission.component.html',
  styleUrls: ['./learner-submission.component.scss']
})
export class LearnerSubmissionComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['Materials'];

  constructor(public _filter: FilterService, public dialog: MatDialog, private _learnerService: LearnerService, private activatedRoute: ActivatedRoute, public _snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource(this.files);
  }

  allotmentId: any;
  loading: Boolean;
  assignment;
  learner;
  files = [];
  copyFiles = [];
  statusToChange;
  currentUser;
  isDisabled = true;

  remark = new FormGroup({
    remark: new FormControl(),
  });

  ngOnInit() {
    this.loading = true;
    this.activatedRoute.params.subscribe(params => {
      console.log(params['id']);
      this.allotmentId = params['id'];
    });
    this.getAllotments(this.allotmentId)
    this.currentUser = JSON.parse(localStorage.currentUser);
    if (this.currentUser.userRole == 'learner') {
      this.isDisabled = false;
    }
  }

  openDialog(someComponent, data = {}): Observable<any> {
    console.log("OPENDIALOG", "DATA = ", data);
    const dialogRef = this.dialog.open(someComponent, { width: "1000px", data });
    return dialogRef.afterClosed();
  }

  addFileModal() {
    var addedCourse = this.openDialog(AddFileModalComponent, { allotmentId: this.allotmentId, status: this.statusToChange }).subscribe((courses) => {
      console.log("Course added in controller = ", courses);
      this.getAllotments(this.allotmentId)
    }, err => {
      this.openSnackBar("Something Went Wrong", "Ok");
    });
  }

  doSubmit(data, assignmentStatus) {

    var Resubmission = {
      allotmentId: this.allotmentId,
      status: assignmentStatus,
      remark: data.value.remark
    }

    this.loading = true;

    this._learnerService.updateAssignmentAllotmentUsingAllotmentId(Resubmission).subscribe(data => {
      this.getAllotments(this.allotmentId)
      this.remark.reset();
      if (assignmentStatus == 'Completed') {
        this.openSnackBar("Assignment marked as completed.", "Ok");
      } else {
        this.openSnackBar("Assignment requested for resubmission.", "Ok");
      }
      this.loading = false;
    }, err => {
      this.openSnackBar("Something Went Wrong", "Ok");
    })
  }


  getAllotments(allotmentId) {
    console.log('Get Allotments Called', allotmentId);
    this._learnerService.getAllotedLearnerFilesUsingAllotmentId(allotmentId).subscribe(data => {
      this.assignment = data[0];
      this.loading = false;
      this.learner = data[0].learner;
      console.log('this.assignment----------', this.assignment);

      if (this.assignment.remark) {

      } else {
        this.assignment.remark = 'No Remarks'
      }

      if (this.assignment.status == 'Pending') {
        this.statusToChange = 'Submitted'
      } else {
        this.statusToChange = 'Re-submitted'
      }

      this.files = data[0].files;
      this.copyFiles = this.files;

      this.dataSource = new MatTableDataSource(this.files);
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  applyFilter(filterValue: string) {
    this.loading = false;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.files = this._filter.filter(filterValue, this.copyFiles, ['title', 'type']);
  }

  deletedFile(event) {
    this.openSnackBar("File Deleted Successfully", "Ok");
    console.log("File Deleted Event : ", event);
    this.files.splice(this.files.findIndex(function (i) {
      return i._id === event._id;
    }), 1);
  }

}
