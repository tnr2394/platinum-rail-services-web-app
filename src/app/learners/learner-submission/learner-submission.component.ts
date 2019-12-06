import { Component, OnInit } from '@angular/core';
import { AddFileModalComponent } from '../../files/add-file-modal/add-file-modal.component'
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-learner-submission',
  templateUrl: './learner-submission.component.html',
  styleUrls: ['./learner-submission.component.scss']
})
export class LearnerSubmissionComponent implements OnInit {

  constructor(public dialog: MatDialog, private activatedRoute: ActivatedRoute, public _snackBar: MatSnackBar) { }

  allotmentId: any;

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      console.log(params['id']);
      this.allotmentId = params['id'];
    });
  }

  openDialog(someComponent, data = {}): Observable<any> {
    console.log("OPENDIALOG", "DATA = ", data);
    const dialogRef = this.dialog.open(someComponent, { width: "1000px", data });
    return dialogRef.afterClosed();
  }

  addFileModal() {
    var addedCourse = this.openDialog(AddFileModalComponent, { allotmentId: this.allotmentId }).subscribe((courses) => {
      if (courses == undefined) return;
      console.log("Course added in controller = ", courses);
    }, err => {
    });
  }


}
