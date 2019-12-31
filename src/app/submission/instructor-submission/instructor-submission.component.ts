import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LearnerService } from '../../services/learner.service'
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FilterService } from "../../services/filter.service";

@Component({
  selector: 'app-instructor-submission',
  templateUrl: './instructor-submission.component.html',
  styleUrls: ['./instructor-submission.component.scss']
})
export class InstructorSubmissionComponent implements OnInit {

  learner;
  loading: Boolean;
  title;
  unitNo;
  assignmentNo;
  assignment;
  displayData = [];
  display: Boolean = false;
  files = [];
  copyFiles;
  data: any;
  allotmentId;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['Materials'];

  remark = new FormGroup({
    remark: new FormControl(),
  });


  constructor(public _filter: FilterService, public _snackBar: MatSnackBar, public _learnerService: LearnerService, public router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.learner = this.router.getCurrentNavigation().extras.state.learner;
        this.title = this.router.getCurrentNavigation().extras.state.title;
        this.unitNo = this.router.getCurrentNavigation().extras.state.unitNo;
        this.assignmentNo = this.router.getCurrentNavigation().extras.state.assignmentNo;
      }
      this.files = [];
      // this.allMaterials = this.materials[];
      this.dataSource = new MatTableDataSource(this.files);

    });
  }

  ngOnInit() {
    this.loading = true;
    this.activatedRoute.params.subscribe(params => {
      console.log(params['id']);
      this.allotmentId = params['id'];
    });
    this.getAllotments(this.allotmentId)

  }

  applyFilter(filterValue: string) {
    console.log("IN APPLY FILTER", filterValue);
    this.loading = false;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // console.log("this.dataSource.filter", this.dataSource.filter)
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    console.log("THIS.MATERIALS IS", this.files);

    // this.dataSource = this._filter.filter(filterValue, this.files, ['title','type']);
    this.files = this._filter.filter(filterValue, this.copyFiles, ['title', 'type']);
    // this.dataSource.paginator = this.paginator;
  }

  getAllotments(allotmentId) {
    console.log('Allotemnt Id:', allotmentId);
    this._learnerService.getAllotedLearnerFilesUsingAllotmentId(allotmentId).subscribe(data => {
      console.log("RECEIVED Allotment = ", data[0])
      console.log("RECEIVED = ", data[0].files)
      this.assignment = data[0];
      this.loading = false;
      this.files = data[0].files;
      this.copyFiles = this.files;
      this.dataSource = new MatTableDataSource(this.files);
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
      if (assignmentStatus == 'Completed') {
        this.openSnackBar("Assignment marked as completed.", "Ok");
      } else {
        this.openSnackBar("Assignment requested for resubmission.", "Ok");
      }
    }, err => {
      this.openSnackBar("Something Went Wrong", "Ok");
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  // UTILITY

  updateData(files) {
    console.log("UPDATING DATA = ", files)
    this.dataSource = new MatTableDataSource(files);
  }



  deletedFile(event) {
    console.log("File Deleted Event : ", event);
    this.openSnackBar("File Deleted Successfully", "Ok");

    this.files.splice(this.files.findIndex(function (i) {
      return i._id === event._id;
    }), 1);

    this.updateData(this.files);
  }




}
