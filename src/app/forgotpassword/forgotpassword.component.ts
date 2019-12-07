import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { LoginService } from '../services/login.service'


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  loading: Boolean = false;

  constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, public _loginService: LoginService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log('Intialize Forgot password', this.data);
  }

  validate(data) {
    console.log("Validating ", data);
    if (!data.email) return false;
    return true;
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
      this.data = data;
      console.log("Added Successfully", data);
      this.loading = false;
      this.dialogRef.close(data);
    }, err => {
      alert("Error Adding Client.")
      this.loading = false;
      this.dialogRef.close(null);
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
