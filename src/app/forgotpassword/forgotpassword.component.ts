import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { LoginService } from '../services/login.service'


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  loading: Boolean = false;

  constructor(public _snackBar: MatSnackBar, public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, public _loginService: LoginService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log('Intialize Forgot password', this.data);
  }

  validate(data) {
    console.log("Validating ", data);
    if (!data.email) return false;
    return true;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  doSubmit() {
    console.log("Submit ", this.data);
    console.log("Validating = ", this.validate(this.data));
    if (!this.validate(this.data)) {
      console.log("RETURNING");
      return;
    }

    // // Do Submit
    this.loading = true;
    this._loginService.forgotPassword(this.data, 'instructors').subscribe(data => {
      console.log("Added Successfully", data);
      this.openSnackBar("Password Updated Successfully", "Ok");
      this.loading = false;
      this.dialogRef.close();
    }, err => {
      this.openSnackBar("Something Went Wrong", "Ok");
      this.loading = false;
      this.dialogRef.close(null);
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
