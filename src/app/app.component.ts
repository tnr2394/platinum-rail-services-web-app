import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SideNavServiceService } from './services/side-nav-service.service';
import { LoginService } from './services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  learnerRouteName;

  constructor(private router: Router, public route: ActivatedRoute, private sidenavService: SideNavServiceService, private _loginService: LoginService) {
    console.log("Child SideBar", this.sidemenu)
    this._loginService.userRole.subscribe(res => {
      this.loggedInUser = res;
    })

    this._loginService.userProfile.subscribe(res => {
      this.currentUser = res;
      if (this.currentUser && this.currentUser.userRole == 'learner') {
        this.learnerRouteName = '/learner/' + this.currentUser._id;
        console.log(' this.currentUser', this.learnerRouteName);
      }
    })
  }

  ngOnInit(): void {
    console.log("Set Side Nav")
    this.sidenavService.setSidenav(this.sidemenu);

    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.loggedInUser = localStorage.getItem("token");

    console.log(' this.currentUser', this.currentUser);

    if (this.currentUser && this.currentUser.userRole == 'learner') {
      this.learnerRouteName = '/learner/' + this.currentUser._id;
      console.log(' this.currentUser', this.learnerRouteName);
    }
  }

  close(reason: string) {
    this.sidemenu.close();
  }

  Logout() {
    console.log('Logout is called');
    localStorage.clear();
    this.router.navigate(['/login/admin']);
    setTimeout(function () { window.location.reload() }, 1);

  }

}
