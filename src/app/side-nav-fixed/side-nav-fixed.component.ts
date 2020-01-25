import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SideNavServiceService } from '../services/side-nav-service.service';
import { LoginService } from '../services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;


@Component({
  selector: 'app-side-nav-fixed',
  templateUrl: './side-nav-fixed.component.html',
  styleUrls: ['./side-nav-fixed.component.scss']
})
export class SideNavFixedComponent implements OnInit {

  loggedInUser;
  currentUser;
  learnerRouteName;
  instructorRouteName;
  isVisible: boolean = true;

  constructor(private router: Router, public route: ActivatedRoute, private sidenavService: SideNavServiceService, private _loginService: LoginService) {
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
      alert('clicked');
      $(".sidebar").toggleClass('sidebar--Collapse');
      // $('.main').toggleClass('main--slide'); 
      $('#toggleIcon').toggleClass('rotate');
    });


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



  Logout() {
    console.log('Logout is called');
    this._loginService.logout();
  }


}
