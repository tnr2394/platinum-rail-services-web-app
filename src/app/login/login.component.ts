import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { ForgotpasswordComponent } from '../forgotpassword/forgotpassword.component';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  activeRouteName: any;
  user: any;
  msg: string = null;
  errmsg: string = null;

  constructor(public route: Router, public dialog: MatDialog, public _loginService: LoginService, public router: ActivatedRoute, private recaptchaV3Service: ReCaptchaV3Service) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });

    if (this._loginService.currentUserValue) {

      console.log('Inside IF----------');
      this.route.navigate(['/dashboard']);
    }

  }

  ngOnInit() {
    this.router.params.subscribe(param => {
      this.activeRouteName = param.user;
    });
  }

  validate(data) {
    console.log("Validating ", data);
    if (!data.email) return false;
    if (!data.password) return false;
    return true;
  }

  openDialog(someComponent, data = { user: this.activeRouteName }): Observable<any> {
    console.log("OPENDIALOG", "DATA = ", data);
    const dialogRef = this.dialog.open(someComponent, { data });
    return dialogRef.afterClosed();
  }


  // MODALS
  addClientModal() {
    var addedClient = this.openDialog(ForgotpasswordComponent).subscribe((client) => {
      console.log("Client added in controller = ", client);
      if (client == undefined) return;
      //   this.clients.push(client);
      //   this.openSnackBar("Client Added Successfully", "Ok");
      //   this.updateData(this.clients);
      // }, err => {
      // return this.openSnackBar("Client could not be Added", "Ok");
    });
  }



  doSubmit() {

    this.router.params.subscribe(param => {
      this.activeRouteName = param.user;
    });

    console.log(' this.activeRouteName:', this.activeRouteName);

    this.recaptchaV3Service.execute('importantAction').subscribe((token) => {
      console.log('Token:', token);
      this._loginService.login(this.loginForm.value, this.activeRouteName, token).subscribe(data => {
        console.log("Added Successfully", data);
      }, err => {
        console.log('error while login', err);
        this.errmsg = err.error.message;
      });
    })
  }

}
