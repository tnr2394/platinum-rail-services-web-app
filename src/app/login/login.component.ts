import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LoginService } from '../services/login.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  activeRouteName: any;
  constructor(public route: Router, public _loginService: LoginService, public router: ActivatedRoute) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
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

    this._loginService.login(this.loginForm.value, this.activeRouteName).subscribe(data => {
      console.log("Added Successfully", data);
    }, err => {
      alert("Error Adding Learner.")
    });
  }


}
