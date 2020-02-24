import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SideNavServiceService } from './services/side-nav-service.service';
import { LoginService } from './services/login.service';
import { NavigationService } from './services/navigation.service';
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
  disableTooltip;
  disabled: boolean;

  public onlineOffline: boolean = navigator.onLine;


  constructor(public routingState: NavigationService, public cd: ChangeDetectorRef, private router: Router, public route: ActivatedRoute, private sidenavService: SideNavServiceService, private _loginService: LoginService) {
    console.log("Child SideBar", this.sidemenu)
    this._loginService.userRole.subscribe(res => {
      this.loggedInUser = res;
    })


    routingState.loadRouting();


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

    console.log('onlineOffline:::::::::::', this.onlineOffline);


    $('.collapseToggle').on('click', function () {
      $(".sidebar").toggleClass('sidebar--Collapse');
      $('.main').toggleClass('menu--open');
      $('body').toggleClass('overflow_hidden');
      $('#toggleIcon').toggleClass('rotate');
      $(".sidebar").hasClass('sidebar--Collapse') ? $(".tooltip-class").css({ 'display': 'block' }) : $(".tooltip-class").css({ 'display': 'none' });
      $('.sidebar ul li a').click(function () {
        var windowWidth = $(window).width();
        if (windowWidth < 1025) {
          $(".sidebar").addClass('sidebar--Collapse');
          $('.main').removeClass('menu--open');
          $('body').removeClass('overflow_hidden');
          $('#toggleIcon').addClass('rotate');
        }
      });
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

  getToolTipEvent() {
    return $(".sidebar").hasClass('sidebar--Collapse');
  }

  getToolTip() {
    if ($(".sidebar").hasClass('sidebar--Collapse')) {
      this.disabled = true;
    }
    else {
      this.disabled = false;
    }
    return $(".sidebar").hasClass('sidebar--Collapse') ? 'expand' : 'collapse';
  }

  close(reason: string) {
    this.sidemenu.close();
  }

  Logout() {
    console.log('Logout is called');
    this._loginService.logout();
  }
}
