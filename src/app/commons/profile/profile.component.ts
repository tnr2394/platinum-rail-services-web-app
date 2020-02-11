import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { JobService } from '../../services/job.service'
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerService } from 'src/app/services/learner.service';
import { EditLearnerModalComponent } from 'src/app/learners/edit-learner-modal/edit-learner-modal.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { InstructorService } from 'src/app/services/instructor.service';
import { EditInstructorModalComponent } from 'src/app/instructors/edit-instructor-modal/edit-instructor-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  job;
  instructor: any;
  client: any;
  location: any;
  course: any;
  learner: any;
  name: any;
  email: any;
  mobile: any;
  profilePath;
  view;
  isLearner: Boolean = false;
  isInstructor: Boolean = false;
  dateOfJoining: Date;
  isJob: boolean = false;

  @Input('learnerForProfile') learnerId;
  @Input('instructorForProfile') instructorId;
  @Input('jobDetailsForProfile') jobDetails;
  // @Input('job') jobFromLearner;
  constructor(private _jobService: JobService, public _learnerService: LearnerService, public _instrctorService: InstructorService,
    private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog, public _snackBar: MatSnackBar) { }

  // ngOnInit() {
  //   console.log("-----learner-----", this.learnerId);
  //   console.log("-----instructor-----", this.instructorId);
  //   console.log("-----job Details-----", this.jobDetails);
  //   if (this.learnerId != undefined) {
  //     this.isLearner = true
  //     this.getLearner()
  //   }
  //   else if (this.instructorId != undefined) {
  //     this.isInstructor = true;
  //     console.log("instructor recieved is", this.instructorId);
  //     this.getInstructor();
  //   }
  //   if (this.jobDetails != undefined) {
  //     this.isJob = true
  //     this.getJobValues(this.jobDetails)
  //   }

  // }
  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log("changes in profile", changes);
  //   if (changes.jobDetails != undefined) {
  //     if (changes.jobDetails.currentValue != undefined) {
  //       this.getJobValues(changes.jobDetails.currentValue)
  //     }
  //   }
  //   // if (changes.jobFromLearner){
  //   //   if (changes.jobFromLearner.currentValue) this.getJobValues(changes.jobFromLearner.currentValue)
  //   // }
  // }



  ngOnInit() {
    console.log("-----learner-----", this.learnerId);
    console.log("-----instructor-----", this.instructorId);
    console.log("-----job-----", this.jobDetails);
    if (this.learnerId != undefined) {
      this.isLearner = true
      this.getLearner()
    }
    else if (this.instructorId != undefined) {
      this.isInstructor = true;
      console.log("instructor recieved is", this.instructorId);
      this.getInstructor();
    }
    else if (this.jobDetails != undefined) {
      this.isJob = true
      this.getJobValues(this.jobDetails)
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log("changes in profile", changes);
    if (changes.jobDetails != undefined) {
      if (changes.jobDetails.currentValue != undefined) {
        this.getJobValues(changes.jobDetails.currentValue)
      }
    }
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
  handleSnackBar(data) {
    this.openSnackBar(data.msg, data.button);
  }

  getLearner() {
    this._learnerService.getLearner(this.learnerId).subscribe(learner => {
      this.learner = learner.pop();
      console.log("learner:::", this.learner);
      this.name = this.learner.name;
      this.email = this.learner.email;
      this.mobile = this.learner.mobile;
      this.profilePath = this.learner.profilePic;
      console.log("this.learner.job._id", this.learner.job._id);

      this.getJob(this.learner.job._id);
      console.log("The learner is", this.learner);
    })
    // this.activatedRoute.params.subscribe(params => {
    //   console.log("ID-----", params['id']);
    //   this._learnerService.getLearner(params['id']).subscribe(learner => {
    //     this.learner = learner.pop();
    //     console.log("learner:::", this.learner);
    //     this.name = this.learner.name;
    //     this.email = this.learner.email;
    //     this.mobile = this.learner.mobile;
    //     this.profilePath = this.learner.profilePic;
    //     this.getJob(this.learner.job._id);
    //   })

    // })
  }

  getInstructor() {
    this._instrctorService.getInstructorById(this.instructorId).subscribe((res => {
      console.log('Get Instructor Detail', res[0]);
      this.instructor = res[0];
      console.log("Got inst details", this.instructor);
      this.name = this.instructor.name;
      this.profilePath = this.instructor.profilePic;
      this.mobile = this.instructor.mobile;
      this.email = this.instructor.email;
      this.dateOfJoining = new Date(this.instructor.dateOfJoining);
    }))
  }


  getJob(id) {
    console.log("get bob by id", id);
    console.group("!!!!!!!!!")

    this._jobService.getJobById(id).subscribe((jobRecieved2) => {
      console.log("Job Recieved", JSON.parse(JSON.stringify(jobRecieved2)));
      this.job = JSON.parse(JSON.stringify(jobRecieved2.pop()));
      this.getJobValues(this.job)

      console.groupEnd()

    })
  }
  getJobValues(job) {
    this.client = job.client;
    this.location = job.location.title;
    this.course = job.course;
    this.instructor = job.instructors;
  }

  editLearner() {
    this.openDialog(EditLearnerModalComponent, this.learner).subscribe((data) => {
      console.log("DIALOG CLOSED", data)
      // Handle Error
      if (!data) return;// this.openSnackBar("learner could not be edited","Ok");
      if (data.result == "err") return this.openSnackBar("learner could not be edited", "Ok");

      // EDIT HANDLE
      if (data.action == 'edit') {
        console.log("HANDLING EDIT SUCCESS", data);
        data = data;
        this.getLearner()


        this.handleSnackBar({ msg: "Learner edited successfully.", button: "Ok" });
      }
      // DELETE HANDLE
      else if (data.action == 'delete') {
        console.log("Deleted ", data);
        this.learner.splice(this.learner.findIndex(function (i) {
          return i._id === data.data._id;
        }), 1);
        this.handleSnackBar({ msg: "Learner deleted successfully.", button: "Ok" });
      }
      // this.updateData(this.learners);
    });
  }

  editInstructor(index, data) {
    data = this.instructor;
    console.log("DATA", data);

    this.openDialog(EditInstructorModalComponent, data).subscribe((instructor) => {
      console.log("DIALOG CLOSED", instructor)
      // this.getInstructor();
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

}
