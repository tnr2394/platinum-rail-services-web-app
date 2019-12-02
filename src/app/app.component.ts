import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SideNavServiceService } from './services/side-nav-service.service';
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

  loggedInUser = localStorage.getItem("currentUser");

  constructor(private router: Router, private sidenavService: SideNavServiceService) {
    console.log("Child SideBar", this.sidemenu)
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
