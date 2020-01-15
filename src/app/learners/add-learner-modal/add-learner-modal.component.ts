import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { LearnerService } from 'src/app/services/learner.service';
declare var $;


@Component({
  selector: 'app-add-learner-modal',
  templateUrl: './add-learner-modal.component.html',
  styleUrls: ['./add-learner-modal.component.scss']
})
export class AddLearnerModalComponent implements OnInit {
  loading: Boolean = false;
  confirmPassword = new FormControl('');
  passwordMismatch: boolean;
  show: boolean;
  pwd: boolean;
  show1: boolean;
  pwd1: boolean;


  ngOnInit() {
    this.confirmPassword.setErrors({
      nomatch: true
    });

    $("#password").click(function () {
      $("#password").toggleClass("fa-eye fa-eye-slash");
    });

    $("#cpassword").click(function () {
      $("#cpassword").toggleClass("fa-eye fa-eye-slash");
    });


  }
  constructor(public _snackBar: MatSnackBar, public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, public _learnerService: LearnerService, private formBuilder: FormBuilder) {
    // NO DEFINITION
  }

  validate(data) {
    console.log("Validating ", data);
    if (!data.name) return false;
    if (!data.email) return false;
    if (!data.password) return false;
    if (!data.confirmPassword) return false;
    if (data.password !== data.confirmPassword) {
      this.passwordMismatch = true;
      return false;
    }
    this.passwordMismatch = false;
    return true;
  }

  doSubmit() {
    console.log("Submit ", this.data);
    console.log("Validating = ", this.validate(this.data));
    if (!this.validate(this.data)) {
      console.log("RETURNING");
      return;
    }


    // Do Submit
    this.loading = true;
    this._learnerService.addLearner(this.data).subscribe(data => {
      this.data = data;
      this.loading = false;
      console.log("Added Successfully", data);
      this.dialogRef.close(data);

    }, error => {
      console.log('Error', error);
      this.openSnackBar(error, "Ok");
      this.loading = false;
      this.dialogRef.close(null);
    });

  }

  password() {
    this.show = !this.show;
    this.pwd = !this.pwd;
  }

  cpassword() {
    this.show1 = !this.show1;
    this.pwd1 = !this.pwd1
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
