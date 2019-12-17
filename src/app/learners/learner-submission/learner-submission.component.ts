import { Component, OnInit } from '@angular/core';
import { AddFileModalComponent } from '../../files/add-file-modal/add-file-modal.component'
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LearnerService } from '../../services/learner.service';

@Component({
  selector: 'app-learner-submission',
  templateUrl: './learner-submission.component.html',
  styleUrls: ['./learner-submission.component.scss']
})
export class LearnerSubmissionComponent implements OnInit {

  constructor(public dialog: MatDialog, private _learnerService: LearnerService, private activatedRoute: ActivatedRoute, public _snackBar: MatSnackBar) { }

  allotmentId: any;
  assignment;
  files;

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      console.log(params['id']);
      this.allotmentId = params['id'];
    });
    this.getAllotments(this.allotmentId)
  }

  openDialog(someComponent, data = {}): Observable<any> {
    console.log("OPENDIALOG", "DATA = ", data);
    const dialogRef = this.dialog.open(someComponent, { width: "1000px", data });
    return dialogRef.afterClosed();
  }

  addFileModal() {
    var addedCourse = this.openDialog(AddFileModalComponent, { allotmentId: this.allotmentId }).subscribe((courses) => {
      console.log("Course added in controller = ", courses);
      this.getAllotments(this.allotmentId)
    }, err => {
    });
  }




  getAllotments(allotmentId) {
    console.log('Get Allotments Called', allotmentId);
    this._learnerService.getAllotedLearnerFilesUsingAllotmentId(allotmentId).subscribe(data => {
      console.log("RECEIVED Allotment = ", data[0])
      console.log("RECEIVED = ", data[0].files)
      this.assignment = data[0];
      this.files = data[0].files;
    });
  }

  deletedFile(event) {
    console.log("File Deleted Event : ", event);
    this.files.splice(this.files.findIndex(function (i) {
      return i._id === event._id;
    }), 1);
  }


}
