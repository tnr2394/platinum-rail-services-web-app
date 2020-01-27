import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SideNavServiceService } from './services/side-nav-service.service';
import { LoginService } from './services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
// import { $ } from 'protractor';
declare var $: any;

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
  instructorRouteName;
  toolTip: any = 'expand';
  isVisible: boolean = true;

  constructor(public cd: ChangeDetectorRef, private router: Router, public route: ActivatedRoute, private sidenavService: SideNavServiceService, private _loginService: LoginService) {
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

      if (this.currentUser && this.currentUser.userRole == 'instructor') {
        this.instructorRouteName = '/instructors/' + this.currentUser._id;
        console.log(' this.currentUser', this.instructorRouteName);
      }
    })
  }

  ngOnInit(): void {

    $('.collapseToggle').on('click', function () {
      $(".sidebar").toggleClass('sidebar--Collapse');
      // $('.main').toggleClass('main--slide'); 
      $('#toggleIcon').toggleClass('rotate');
    });
    this.sidenavService.setSidenav(this.sidemenu);

    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.loggedInUser = localStorage.getItem("token");

    console.log(' this.currentUser', this.currentUser);

    if (this.currentUser && this.currentUser.userRole == 'learner') {
      this.learnerRouteName = '/learner/' + this.currentUser._id;
      console.log(' this.currentUser', this.learnerRouteName);
    }
    if (this.currentUser && this.currentUser.userRole == 'instructor') {
      this.instructorRouteName = '/instructors/' + this.currentUser._id;
      console.log(' this.currentUser', this.instructorRouteName);
    }
  }

  getToolTip() {
    return $(".sidebar").hasClass('sidebar--Collapse') ? 'expand' : 'collapse';
  }

  ngOnChanges() {
    this.cd.detectChanges();
  }

  close(reason: string) {
    this.sidemenu.close();
  }

  Logout() {
    console.log('Logout is called');
    this._loginService.logout();
  }
}
