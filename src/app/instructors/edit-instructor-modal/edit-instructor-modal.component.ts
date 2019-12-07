import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { instructor } from 'src/app/interfaces/instructor';
import { InstructorService } from '../../services/instructor.service'
import { format } from 'url';

export interface Instructor {
  _id: string;
  name: string;
  dateOfJoining: Date;
  email: string;
  password: string;
  qualifications: []
};


@Component({
  selector: 'app-edit-instructor-modal',
  templateUrl: './edit-instructor-modal.component.html',
  styleUrls: ['./edit-instructor-modal.component.scss']
})
export class EditInstructorModalComponent implements OnInit {
  loading: Boolean = false;
  instructorData;
  passwordMismatch: boolean;
  ngOnInit() {

    console.log("DATA = ", this.data);
    this.instructorData = JSON.parse(JSON.stringify(this.data));
    // this.instructorData.dateOfJoining = this.formatDate(this.instructorData.dateOfJoining);
    console.log("DATE = ", this.instructorData.dateOfJoining);
    this.instructorData.confirmPassword = this.instructorData.password;

  }
  constructor(public dialogRef: MatDialogRef<Instructor>, @Inject(MAT_DIALOG_DATA) public data: any, public _instructorService: InstructorService) {
    // NO DEFINITION
  }
  validate(data) {
    console.log("Validating ", data);
    if (!data.name) return false;
    if (!data.email) return false;
    if (!data.password) return false;
    if (!data.dateOfJoining) return false;
    if (!data.confirmPassword) return false;
    if (data.password !== data.confirmPassword) {
      console.log("Password Mismatch")
      this.passwordMismatch = true;
      return false;
    }
    this.passwordMismatch = false;
    return true;
  }



  formatDate(date) {
    var d = new Date(date);
    return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
  }

  doSubmit() {
    console.log("Submit ", this.data);
    console.log("this.instructorData", this.instructorData);
    console.log("Validating = ", this.validate(this.data));
    if (!this.validate(this.instructorData)) {
      console.log("RETURNING");
      return;
    }

    // Do Submit
    this.loading = true;
    this._instructorService.editInstructor(this.instructorData).subscribe(instructors => {
      this.data = this.instructorData;
      this.loading = false;
      this.closoeDialog({
        action: 'edit',
        result: 'success',
        data: this.instructorData
      });
    }, err => {
      alert("Error editing instructor.")
      this.loading = false;
      this.closoeDialog({
        action: 'edit',
        result: 'err',
        data: err
      });
    });
  }

  delete() {
    console.warn("DELETING ", this.data._id);
    this.loading = true;
    this._instructorService.deleteInstructor(this.instructorData._id).subscribe(instructors => {
      this.data = instructors;
      this.loading = false;
      this.closoeDialog({
        action: 'delete',
        result: 'success',
        data: this.instructorData
      });
    }, err => {
      alert("Error deleting instructor.")
      this.loading = false;
      this.closoeDialog({
        action: 'delete',
        result: 'err',
        data: err
      });
    });

  }



  closoeDialog(result) {
    this.dialogRef.close(result);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
