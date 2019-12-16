import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SideNavServiceService } from './services/side-nav-service.service';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';
import { $ } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sidemenu', { static: true }) sidemenu: MatSidenav;
  reason = '';

  loggedInUser;
  currentUser;

  constructor(private router: Router, private sidenavService: SideNavServiceService, private _loginService: LoginService) {
    console.log("Child SideBar", this.sidemenu)
    this._loginService.userRole.subscribe(res => {
      console.log('RES', res, this.loggedInUser);
      this.loggedInUser = res;
    })

    this._loginService.userProfile.subscribe(res => {
      console.log('RES Profile--------------', res);
      this.currentUser = res;
    })

    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

    console.log('this.currentUser---------->>>>>>', this.currentUser);

    
    this.loggedInUser = localStorage.getItem("token");
  }
  ngOnInit(): void {
    console.log("Set Side Nav")
    this.sidenavService.setSidenav(this.sidemenu);
  }
  close(reason: string) {
    this.sidemenu.close();
  }

  Logout() {
    console.log('Logout is called');
    localStorage.clear();
    setTimeout(function () { window.location.reload() }, 1);
    this.router.navigate(['/login/admin']);
  }

}
