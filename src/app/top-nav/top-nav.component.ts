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

  constructor(public sideNavService: SideNavServiceService, public _loginService: LoginService) {
    this._loginService.userRole.subscribe(res => {
      console.log('Top nav Component Init');
      this.loggedInUser = res;
    })

    this.loggedInUser = localStorage.getItem("currentUser");

  }
  openMenu() {
    this.sideNavService.open();
  }

  ngOnInit() {
  }

}
