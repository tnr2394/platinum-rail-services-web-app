import { Component, OnInit } from '@angular/core';
import { SideNavServiceService } from '../services/side-nav-service.service';
import { LoginService } from '../services/login.service';


@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

  loggedInUser;
  currentUser;

  constructor(public sideNavService: SideNavServiceService, public _loginService: LoginService) {

    this._loginService.userToken.subscribe(res => {
      this.loggedInUser = res;
    })

    this._loginService.userProfile.subscribe(res => {
      this.currentUser = res;
    })


  }
  openMenu() {
    this.sideNavService.open();
  }

  ngOnInit() {
    this.loggedInUser = localStorage.getItem("currentUser");
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
  }
}
