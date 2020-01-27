import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service'
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerService } from 'src/app/services/learner.service';
import { EditLearnerModalComponent } from 'src/app/learners/edit-learner-modal/edit-learner-modal.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';

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

  constructor(private _jobService: JobService, public _learnerService: LearnerService,
    private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog, public _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getLearner()
    // GETTING LEARNER ID
    this.activatedRoute.params.subscribe(params => {
      console.log("ID-----", params['id']);
      this._learnerService.getLearner(params['id']).subscribe(learner => {
        this.learner = learner.pop();
        console.log("learner:::", this.learner);
        this.name = this.learner.name;
        this.email = this.learner.email;
        this.mobile = this.learner.mobile;
        this.profilePath = this.learner.profilePic;
        this.getJob(this.learner.job._id);
      })

    })
    console.log("The learner is", this.learner);
  }
  getLearner(){
    this.activatedRoute.params.subscribe(params => {
      console.log("ID-----", params['id']);
      this._learnerService.getLearner(params['id']).subscribe(learner => {
        this.learner = learner.pop();
        console.log("learner:::", this.learner);
        this.name = this.learner.name;
        this.email = this.learner.email;
        this.mobile = this.learner.mobile;
        this.profilePath = this.learner.profilePic;
        this.getJob(this.learner.job._id);
      })

    })
    console.log("The learner is", this.learner);
  }

  getJob(id) {
    this._jobService.getJobById(id).subscribe((jobRecieved) => {
      console.log("Job Recieved", jobRecieved);
      this.job = jobRecieved.pop();
      this.client = this.job.client.name;
      this.location = this.job.location.title;
      this.course = this.job.course.title;
      this.instructor = this.job.instructors;
    })
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

  editLearner(){
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

}
