import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SideNavServiceService } from './side-nav-service.service';
import { $ } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sidemenu', {static: true}) sidemenu: MatSidenav;
  reason = '';

  constructor(private sidenavService: SideNavServiceService){
    console.log("Child SideBar",this.sidemenu)
  }
  ngOnInit(): void {
    console.log("Set Side Nav")
    this.sidenavService.setSidenav(this.sidemenu);
  }
  close(reason: string) {
    this.sidemenu.close();
  }

}
