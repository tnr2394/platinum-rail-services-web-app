import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Observable } from 'rxjs';




@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  loginForm: FormGroup;
  activeRouteName: any;
  user: any;
  constructor(public route: Router, public dialog: MatDialog, public _loginService: LoginService, public router: ActivatedRoute, private recaptchaV3Service: ReCaptchaV3Service) {
    this.loginForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required, Validators.email]),
      newPassword: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }

  validate(data) {
    console.log("Validating ", data);
    if (!data.email) return false;
    if (!data.password) return false;
    return true;
  }

  doSubmit() {

    this.router.params.subscribe(param => {
      this.activeRouteName = param.user;
    });

    this.recaptchaV3Service.execute('importantAction').subscribe((token) => {
      console.log('')
      console.log('Token:----------', token);

      this._loginService.resetPassword(this.loginForm.value, this.activeRouteName).subscribe(data => {
        console.log("Added Successfully", data);
      }, err => {
        console.log('error while login');
        alert("error while login.")
      });
    })
  }



}
