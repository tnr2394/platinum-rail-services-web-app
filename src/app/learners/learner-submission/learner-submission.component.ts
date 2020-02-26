import { Component, OnInit } from '@angular/core';
import { AddFileModalComponent } from '../../files/add-file-modal/add-file-modal.component'
import { MatDialog, MatSnackBar } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LearnerService } from '../../services/learner.service';
import { FilterService } from '../../services/filter.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { NewFileModalComponent } from '../../files/new-file-modal/new-file-modal.component';

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
  statusByInstructor;
  remark;
  deadlineDate;

  // remark = new FormGroup({
  //   remark: new FormControl(),
  //   deadlineDate: new FormControl(),
  //   status: new FormControl()
  // });

  allStatus = [
    { id: 1, name: 'Requested for Resubmission'},
    { id: 1, name: 'Completed' }
  ]
  olderRemarks = [
    // {date:'01/02/2020',text: 'This is a demo remark'},
    // { date: '10/03/2020', text: 'This is a demo remark which is longer than the last remark' },
    // { date: '15/03/2020', text: 'This is a remark' }
  ]

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
    var addedCourse = this.openDialog(NewFileModalComponent, { allotmentId: this.allotmentId, status: this.statusToChange }).subscribe((courses) => {
      console.log("Course added in controller = ", courses);
      this.getAllotments(this.allotmentId)
    }, err => {
      this.openSnackBar("Something Went Wrong", "Ok");
    });
  }

  // doSubmit(data, assignmentStatus) {

  //   var Resubmission = {
  //     allotmentId: this.allotmentId,
  //     status: assignmentStatus,
  //     remark: data.value.remark,
  //     deadlineDate: data.value.deadlineDate
  //   }

    // console.log("this.form", this.remark.controls);
    
    // this.loading = true;

    // this._learnerService.updateAssignmentAllotmentUsingAllotmentId(Resubmission).subscribe(data => {
    //   this.getAllotments(this.allotmentId)
    //   this.remark.reset();
    //   if (assignmentStatus == 'Completed') {
    //     this.openSnackBar("Assignment marked as completed.", "Ok");
    //   } else {
    //     this.openSnackBar("Assignment requested for resubmission.", "Ok");
    //   }
    //   this.loading = false;
    // }, err => {
    //   this.openSnackBar("Something Went Wrong", "Ok");
    // })
  // }

  submit(){
    console.log('this.statusByInstructor', this.statusByInstructor);
    console.log('this.remark', this.remark);
    console.log('allotmentId', this.allotmentId);
    console.log('deadlineDate', this.deadlineDate );
    var data = {
      allotmentId: this.allotmentId,
      status: this.statusByInstructor,
      remark: this.remark,
      deadlineDate: this.deadlineDate
    }
    this._learnerService.updateAssignmentAllotmentUsingAllotmentId(data).subscribe(data => {
      this.getAllotments(this.allotmentId)
      if (this.statusByInstructor == 'Completed') {
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
      this.deadlineDate = this.assignment.deadlineDate
      // if (this.assignment.remark) {

      // } else {
      //   this.assignment.remark = 'No Remarks'
      // }

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
