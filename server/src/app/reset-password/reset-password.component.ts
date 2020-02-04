import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Observable } from 'rxjs';
declare var $;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  loginForm: FormGroup;
  activeRouteName: any;
  user: any;
  userType;
  show: boolean;
  pwd: boolean;
  show1: boolean;
  pwd1: boolean;
  show2: boolean;
  pwd2: boolean;
  passwordMismatch;


  constructor(public _snackBar: MatSnackBar, public route: Router, public dialog: MatDialog, public _loginService: LoginService, public router: ActivatedRoute, private recaptchaV3Service: ReCaptchaV3Service) {

  }

  ngOnInit() {

    this.loginForm = new FormGroup({
      oldPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    });

    $("#password").click(function () {
      $("#password").toggleClass("fa-eye fa-eye-slash");
    });

    $("#cpassword").click(function () {
      $("#cpassword").toggleClass("fa-eye fa-eye-slash");
    });

    $("#opassword").click(function () {
      $("#opassword").toggleClass("fa-eye fa-eye-slash");
    });

  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  password() {
    this.show1 = !this.show1;
    this.pwd1 = !this.pwd1;
  }

  cpassword() {
    this.show2 = !this.show2;
    this.pwd2 = !this.pwd2;
  }

  opassword() {
    this.show = !this.show;
    this.pwd = !this.pwd;
  }

  validate(data) {
    console.log("Validating ", data);
    if (!data.oldPassword) return false;
    if (!data.newPassword) return false;
    if (!data.confirmPassword) return false;
    if (data.newPassword !== data.confirmPassword) {
      this.passwordMismatch = true;
      return false;
    }
    this.passwordMismatch = false;
    return true;
  }


  doSubmit() {

    console.log("Submit ", this.loginForm.value);
    console.log("Validating = ", this.validate(this.loginForm.value));


    this.router.params.subscribe(param => {
      this.activeRouteName = param.user;
    });

    if (this.activeRouteName == 'admin') {
      this.userType = 'admin';
    } else if (this.activeRouteName == 'learner') {
      this.userType = 'learners';
    } else if (this.activeRouteName == 'instructor') {
      this.userType = 'instructors';
    } else if (this.activeRouteName == 'learner') {
      this.userType = 'learners';
    }

    this._loginService.resetPassword(this.loginForm.value, this.userType).subscribe(data => {
      console.log("Added Successfully", data);
      // this.loginForm.reset();
      this.ngOnInit();
      this.openSnackBar("Password changed successfully.", "Ok");
    }, err => {
      console.log('error while login', err);
      this.openSnackBar(err.msg, "Ok");
    });
  }
}
