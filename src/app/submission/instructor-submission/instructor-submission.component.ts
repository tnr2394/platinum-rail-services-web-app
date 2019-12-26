import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LearnerService } from '../../services/learner.service'
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-instructor-submission',
  templateUrl: './instructor-submission.component.html',
  styleUrls: ['./instructor-submission.component.scss']
})
export class InstructorSubmissionComponent implements OnInit {

  learner;
  title;
  unitNo;
  assignmentNo;
  assignment;
  displayData = [];
  display: Boolean = false;
  files = [];
  data: any;
  allotmentId;

  remark = new FormGroup({
    remark: new FormControl(),
  });


  constructor(public _snackBar: MatSnackBar, public _learnerService: LearnerService, public router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.learner = this.router.getCurrentNavigation().extras.state.learner;
        this.title = this.router.getCurrentNavigation().extras.state.title;
        this.unitNo = this.router.getCurrentNavigation().extras.state.unitNo;
        this.assignmentNo = this.router.getCurrentNavigation().extras.state.assignmentNo;
      }
    });
  }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      console.log(params['id']);
      this.allotmentId = params['id'];
    });
    this.getAllotments(this.allotmentId)

  }


  // getAllotments() {
  //   // console.log(this.learner);
  //   this._learnerService.getLearner(this.learner._id).subscribe(data => {
  //     console.log("RECEIVED = ", data)
  //     data.forEach((item) => {
  //       // console.log(item.allotments)
  //       item.allotments.forEach((item) => {
  //         if (item.assignment != null) {
  //           if (item.assignment.title == this.title
  //             || item.assignmet.unitNo == this.unitNo
  //             || item.assignment.assignmentNo == this.assignmentNo) {
  //             this.displayData.push(item)
  //           }
  //         }
  //       })
  //     })
  //   });
  //   console.log("displayData", this.displayData)
  // }

  getAllotments(allotmentId) {
    console.log('Allotemnt Id:', allotmentId);
    this._learnerService.getAllotedLearnerFilesUsingAllotmentId(allotmentId).subscribe(data => {
      console.log("RECEIVED Allotment = ", data[0])
      console.log("RECEIVED = ", data[0].files)
      this.assignment = data[0];
      this.files = data[0].files;
    });
  }

  doSubmit(data, assignmentStatus) {

    var Resubmission = {
      allotmentId: this.allotmentId,
      status: assignmentStatus,
      remark: data.value.remark
    }

    this._learnerService.updateAssignmentAllotmentUsingAllotmentId(Resubmission).subscribe(data => {
      this.getAllotments(this.allotmentId)
      this.remark.reset();
      this.openSnackBar("Changes made Successfully", "Ok");
    }, err => {
      this.openSnackBar("Something Went Wrong", "Ok");
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  deletedFile(event) {
    console.log("File Deleted Event : ", event);
    this.openSnackBar("File Deleted Successfully", "Ok");
    this.files.splice(this.files.findIndex(function (i) {
      return i._id === event._id;
    }), 1);
  }

}
